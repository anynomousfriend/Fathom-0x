'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Database, Waves, Lock, CheckCircle } from 'lucide-react'
import { ParticleHover } from './ParticleHover'
import { ConnectButton } from '@mysten/dapp-kit'

export function LandingPage() {
    const scrollToApp = () => {
        const appSection = document.getElementById('app-section')
        if (appSection) {
            appSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.05),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:40px_40px]"></div>
                </div>

                <div className="container mx-auto px-4 z-10 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Logo Icon */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex justify-center mb-8"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                                    <Waves className="w-12 h-12 text-white" />
                                </div>
                            </motion.div>

                            <ParticleHover className="inline-block mb-6">
                                <span className="px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold">
                                    Privacy-Preserving AI on Blockchain
                                </span>
                            </ParticleHover>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600">
                                Fathom Protocol
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                                Secure, private document analysis powered by TEE oracles and decentralized storage
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <ParticleHover>
                                    <button
                                        onClick={scrollToApp}
                                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 flex items-center gap-2"
                                    >
                                        Launch App <ArrowRight className="w-5 h-5" />
                                    </button>
                                </ParticleHover>

                                <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-slate-200 shadow-lg">
                                    <ConnectButton className="!bg-transparent !text-slate-900 hover:!bg-slate-100 transition-colors" />
                                </div>
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
                    <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Why Choose Fathom?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Built on cutting-edge blockchain technology to ensure your data stays private and secure
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Lock className="w-10 h-10 text-blue-600" />,
                                title: "Client-Side Encryption",
                                desc: "Documents are encrypted in your browser using AES-256 before upload. Your plaintext data never leaves your device.",
                                color: "blue"
                            },
                            {
                                icon: <Database className="w-10 h-10 text-cyan-600" />,
                                title: "Decentralized Storage",
                                desc: "Encrypted files stored on Walrus network with redundancy. No single point of failure or control.",
                                color: "cyan"
                            },
                            {
                                icon: <CheckCircle className="w-10 h-10 text-emerald-600" />,
                                title: "Verifiable On-Chain",
                                desc: "All queries and metadata recorded on Sui blockchain. Complete transparency and immutable audit trail.",
                                color: "emerald"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className={`p-8 rounded-2xl bg-gradient-to-br from-${feature.color}-50 to-white border border-${feature.color}-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}
                            >
                                <div className={`w-16 h-16 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tech Stack Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200"
                    >
                        <h3 className="text-2xl font-bold text-center mb-8 text-slate-900">Built With</h3>
                        <div className="flex flex-wrap justify-center items-center gap-8">
                            <div className="text-center">
                                <div className="text-4xl mb-2">⛓️</div>
                                <p className="font-semibold text-slate-700">Sui Blockchain</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-2">🐋</div>
                                <p className="font-semibold text-slate-700">Walrus Storage</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-2">🔒</div>
                                <p className="font-semibold text-slate-700">TEE Oracles</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-2">🤖</div>
                                <p className="font-semibold text-slate-700">AI-Powered RAG</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
