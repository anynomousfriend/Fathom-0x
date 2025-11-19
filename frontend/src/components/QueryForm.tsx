'use client'

import { useState } from 'react'
import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { Send, Loader2 } from 'lucide-react'

interface QueryFormProps {
  documentId: string
  onAnswerReceived: (answer: any) => void
}

export function QueryForm({ documentId, onAnswerReceived }: QueryFormProps) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const client = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock()

  const packageId = process.env.NEXT_PUBLIC_PACKAGE_ID
  const configId = process.env.NEXT_PUBLIC_CONFIG_OBJECT_ID

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }

    if (!packageId || !configId) {
      setError('Contract not configured. Please check environment variables.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const txb = new TransactionBlock()

      // Call submit_query function
      txb.moveCall({
        target: `${packageId}::fathom::submit_query`,
        arguments: [
          txb.object(documentId),
          txb.pure(Array.from(new TextEncoder().encode(question))),
          txb.object('0x6'), // Clock object
        ],
      })

      signAndExecute(
        {
          transactionBlock: txb,
          options: {
            showEffects: true,
            showEvents: true,
          },
        },
        {
          onSuccess: async (result) => {
            console.log('Query submitted successfully:', result)
            
            // Start polling for answer
            pollForAnswer(result.digest)
          },
          onError: (error) => {
            console.error('Transaction failed:', error)
            setError('Failed to submit query. Please try again.')
            setLoading(false)
          },
        }
      )
    } catch (err) {
      console.error('Error submitting query:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const pollForAnswer = async (txDigest: string, attempts = 0) => {
    const maxAttempts = 30 // 30 attempts * 2 seconds = 1 minute
    
    if (attempts >= maxAttempts) {
      setError('Timeout waiting for answer. The oracle may be offline.')
      setLoading(false)
      return
    }

    try {
      // Wait 2 seconds before checking
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Query events for InsightGenerated
      const events = await client.queryEvents({
        query: {
          MoveEventType: `${packageId}::fathom::InsightGenerated`,
        },
        order: 'descending',
        limit: 10,
      })

      // Check if we have a matching event
      const matchingEvent = events.data.find(event => {
        // In production, you'd check the query_id matches
        return true // For demo, accept the latest
      })

      if (matchingEvent) {
        const { answer, signature, timestamp } = matchingEvent.parsedJson as any
        
        onAnswerReceived({
          question,
          answer,
          signature,
          timestamp,
        })

        setLoading(false)
        setQuestion('')
      } else {
        // Continue polling
        pollForAnswer(txDigest, attempts + 1)
      }
    } catch (err) {
      console.error('Error polling for answer:', err)
      pollForAnswer(txDigest, attempts + 1)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to know about this document?
          </label>
          <textarea
            id="question"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="e.g., What is the main conclusion of this research paper?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Query...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Query</span>
            </>
          )}
        </button>

        {loading && (
          <div className="text-center text-sm text-gray-600">
            <p>⏳ Waiting for oracle to process your query...</p>
            <p className="text-xs mt-1">This may take 10-30 seconds</p>
          </div>
        )}
      </form>
    </div>
  )
}
