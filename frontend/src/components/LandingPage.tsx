'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Database, Lock, CheckCircle } from 'lucide-react'
import { ParticleHover } from './ParticleHover'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

export function LandingPage() {
    const scrollToApp = () => {
        const appSection = document.getElementById('app-section')
        if (appSection) {
            appSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-4 z-10 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <ParticleHover className="inline-block mb-6">
                                <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                                    Privacy-Preserving AI on Blockchain
                                </span>
                            </ParticleHover>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-400 to-primary">
                                Fathom-0x Protocol
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                                Secure, private document analysis powered by TEE oracles and decentralized storage
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <ParticleHover>
                                    <Button size="lg" onClick={scrollToApp}>
                                        Launch App <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </ParticleHover>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-primary rounded-full"></div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Choose Fathom?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Built on cutting-edge blockchain technology to ensure your data stays private and secure
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Lock className="w-10 h-10 text-primary" />,
                                title: "Client-Side Encryption",
                                desc: "Documents are encrypted in your browser using AES-256 before upload. Your plaintext data never leaves your device.",
                            },
                            {
                                icon: <Database className="w-10 h-10 text-primary" />,
                                title: "Decentralized Storage",
                                desc: "Encrypted files stored on Walrus network with redundancy. No single point of failure or control.",
                            },
                            {
                                icon: <CheckCircle className="w-10 h-10 text-primary" />,
                                title: "Verifiable On-Chain",
                                desc: "All queries and metadata recorded on Sui blockchain. Complete transparency and immutable audit trail.",
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <Card className="bg-card/50 backdrop-blur-sm h-full">
                                    <CardHeader className="items-center text-center">
                                        <div className="p-4 bg-primary/10 rounded-xl mb-4">
                                            {feature.icon}
                                        </div>
                                        <CardTitle>{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tech Stack Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20"
                    >
                        <Card className="bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-center">Built With</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap justify-center items-center gap-8">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2 font-bold text-primary">CHAIN</div>
                                        <p className="font-semibold text-muted-foreground">Sui Blockchain</p>
                                    </div>
                                    <div className="text-center">
                                        <Database className="w-10 h-10 mb-2 text-primary mx-auto" />
                                        <p className="font-semibold text-muted-foreground">Walrus Storage</p>
                                    </div>
                                    <div className="text-center">
                                        <Lock className="w-10 h-10 mb-2 text-primary" />
                                        <p className="font-semibold text-muted-foreground">TEE Oracles</p>
                                    </div>
                                    <div className="text-center">
                                        <Zap className="w-10 h-10 mb-2 text-primary mx-auto" />
                                        <p className="font-semibold text-muted-foreground">AI-Powered RAG</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Why Sui & Walrus Section */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Sui & Walrus?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            We chose Sui blockchain and Walrus storage for specific technical advantages that make this architecture possible
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Sui Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="text-3xl font-bold text-primary">SUI</div>
                                        <CardTitle>Sui Blockchain</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Object-Centric Model</p>
                                                <p className="text-sm text-muted-foreground">Documents as first-class objects with ownership and access control built-in at the protocol level</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Parallel Execution</p>
                                                <p className="text-sm text-muted-foreground">High throughput for concurrent queries - process multiple document queries simultaneously without congestion</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Event-Driven Oracle Integration</p>
                                                <p className="text-sm text-muted-foreground">Rich event system enables off-chain oracles to listen and respond to queries in real-time</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Sub-Second Finality</p>
                                                <p className="text-sm text-muted-foreground">Fast confirmation times mean near-instant registration and query submission for better UX</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Move Language Security</p>
                                                <p className="text-sm text-muted-foreground">Resource-oriented programming prevents common vulnerabilities - assets can't be copied or accidentally destroyed</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Walrus Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Database className="w-8 h-8 text-secondary" />
                                        <CardTitle>Walrus Storage</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Decentralized by Design</p>
                                                <p className="text-sm text-muted-foreground">No single point of failure or control - data distributed across a network of storage nodes</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Erasure Coding</p>
                                                <p className="text-sm text-muted-foreground">Efficient redundancy - files split and encoded so they can be recovered even if many nodes are offline</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Native Sui Integration</p>
                                                <p className="text-sm text-muted-foreground">Built specifically for Sui ecosystem - seamless blob ID references in smart contracts</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Cost Efficient</p>
                                                <p className="text-sm text-muted-foreground">Pay once for storage epochs - no recurring fees for data retrieval or bandwidth costs</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-foreground">Content Addressable</p>
                                                <p className="text-sm text-muted-foreground">Blob IDs cryptographically tied to content - immutable references that can't be tampered with</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Architecture Benefits */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 max-w-4xl mx-auto"
                    >
                        <Card className="bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-center">The Perfect Combination</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-muted-foreground leading-relaxed">
                                        <span className="font-semibold text-foreground">Sui + Walrus = Verifiable Private AI.</span> Sui provides the coordination layer with fast finality and object ownership, 
                                        while Walrus handles cost-effective decentralized storage. Together they enable:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                            <p className="font-semibold text-foreground mb-2">Privacy Without Compromise</p>
                                            <p className="text-sm text-muted-foreground">Encrypted data on Walrus + metadata on Sui = verifiable queries over private documents</p>
                                        </div>
                                        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                                            <p className="font-semibold text-foreground mb-2">Trustless Oracle Integration</p>
                                            <p className="text-sm text-muted-foreground">Sui events trigger oracles, results verified on-chain - no centralized intermediaries</p>
                                        </div>
                                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                            <p className="font-semibold text-foreground mb-2">Censorship Resistant</p>
                                            <p className="text-sm text-muted-foreground">Decentralized storage + blockchain = no single entity can block access or delete data</p>
                                        </div>
                                        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
                                            <p className="font-semibold text-foreground mb-2">Transparent & Auditable</p>
                                            <p className="text-sm text-muted-foreground">All queries, answers, and proofs recorded immutably for complete accountability</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

