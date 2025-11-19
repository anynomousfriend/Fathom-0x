/// Fathom Protocol - Verifiable RAG for Private Data on Walrus
/// 
/// This module enables users to query documents stored on Walrus through a
/// verifiable oracle system with cryptographic proof of integrity.
module fathom::fathom {
    use sui::event;
    use std::string::{Self, String};

    // ========== Error Codes ==========
    
    const ENotAuthorized: u64 = 1;
    const EInvalidSignature: u64 = 2;
    const EDocumentNotFound: u64 = 3;

    // ========== Structs ==========

    /// Administrative capability for managing the protocol
    public struct AdminCap has key, store {
        id: UID
    }

    /// Main configuration object for the Fathom protocol
    public struct FathomConfig has key {
        id: UID,
        oracle_address: address,
        document_count: u64,
    }

    /// Represents a document stored on Walrus
    public struct Document has key, store {
        id: UID,
        walrus_blob_id: String,
        owner: address,
        name: String,
        description: String,
        created_at: u64,
    }

    /// Represents a query submitted by a user
    public struct Query has key, store {
        id: UID,
        document_id: ID,
        question: String,
        requester: address,
        answered: bool,
        answer: String,
        signature: vector<u8>,
        timestamp: u64,
    }

    // ========== Events ==========

    /// Emitted when a new query is submitted
    public struct QuerySubmitted has copy, drop {
        query_id: ID,
        document_id: ID,
        question: String,
        requester: address,
        timestamp: u64,
    }

    /// Emitted when an oracle provides an answer
    public struct InsightGenerated has copy, drop {
        query_id: ID,
        answer: String,
        signature: vector<u8>,
        oracle: address,
        timestamp: u64,
    }

    /// Emitted when a new document is registered
    public struct DocumentRegistered has copy, drop {
        document_id: ID,
        walrus_blob_id: String,
        owner: address,
        name: String,
    }

    // ========== Initialization ==========

    /// Module initializer - creates AdminCap and FathomConfig
    fun init(ctx: &mut TxContext) {
        // Create admin capability
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };

        // Create main config
        let config = FathomConfig {
            id: object::new(ctx),
            oracle_address: ctx.sender(),
            document_count: 0,
        };

        // Transfer admin cap to deployer
        transfer::transfer(admin_cap, ctx.sender());
        
        // Share config object
        transfer::share_object(config);
    }

    // ========== Admin Functions ==========

    /// Update the oracle address (only admin)
    public entry fun update_oracle(
        _admin: &AdminCap,
        config: &mut FathomConfig,
        new_oracle: address,
    ) {
        config.oracle_address = new_oracle;
    }

    // ========== Document Management ==========

    /// Register a new document stored on Walrus
    public entry fun register_document(
        config: &mut FathomConfig,
        walrus_blob_id: vector<u8>,
        name: vector<u8>,
        description: vector<u8>,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext,
    ) {
        let document = Document {
            id: object::new(ctx),
            walrus_blob_id: string::utf8(walrus_blob_id),
            owner: ctx.sender(),
            name: string::utf8(name),
            description: string::utf8(description),
            created_at: sui::clock::timestamp_ms(clock),
        };

        let doc_id = object::id(&document);
        let doc_name = document.name;
        let blob_id = document.walrus_blob_id;
        let owner = document.owner;

        // Emit registration event
        event::emit(DocumentRegistered {
            document_id: doc_id,
            walrus_blob_id: blob_id,
            owner,
            name: doc_name,
        });

        config.document_count = config.document_count + 1;

        // Transfer document to owner
        transfer::transfer(document, ctx.sender());
    }

    // ========== Query Functions ==========

    /// Submit a query for a document
    public entry fun submit_query(
        document: &Document,
        question: vector<u8>,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext,
    ) {
        let query = Query {
            id: object::new(ctx),
            document_id: object::id(document),
            question: string::utf8(question),
            requester: ctx.sender(),
            answered: false,
            answer: string::utf8(b""),
            signature: vector::empty(),
            timestamp: sui::clock::timestamp_ms(clock),
        };

        let query_id = object::id(&query);
        let doc_id = query.document_id;
        let question_str = query.question;
        let requester = query.requester;
        let timestamp = query.timestamp;

        // Emit query event for oracle to listen
        event::emit(QuerySubmitted {
            query_id,
            document_id: doc_id,
            question: question_str,
            requester,
            timestamp,
        });

        // Share query object so oracle can modify it
        transfer::share_object(query);
    }

    /// Oracle submits an answer to a query
    public entry fun submit_answer(
        config: &FathomConfig,
        query: &mut Query,
        answer: vector<u8>,
        signature: vector<u8>,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext,
    ) {
        // Verify caller is the authorized oracle
        assert!(ctx.sender() == config.oracle_address, ENotAuthorized);
        
        // Verify query hasn't been answered yet
        assert!(!query.answered, ENotAuthorized);

        // Update query with answer
        query.answered = true;
        query.answer = string::utf8(answer);
        query.signature = signature;

        // Emit insight event
        event::emit(InsightGenerated {
            query_id: object::id(query),
            answer: query.answer,
            signature: query.signature,
            oracle: ctx.sender(),
            timestamp: sui::clock::timestamp_ms(clock),
        });
    }

    // ========== View Functions ==========

    /// Get document information
    public fun get_document_info(document: &Document): (String, String, address) {
        (document.walrus_blob_id, document.name, document.owner)
    }

    /// Get query information
    public fun get_query_info(query: &Query): (String, bool, String) {
        (query.question, query.answered, query.answer)
    }

    /// Get oracle address
    public fun get_oracle_address(config: &FathomConfig): address {
        config.oracle_address
    }

    // ========== Test Functions ==========

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
