'use client'

import { useEffect, useRef } from 'react'

export function MatrixRain({ className = '' }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+'
        const fontSize = 14
        const columns = canvas.width / fontSize
        const drops: number[] = []

        for (let i = 0; i < columns; i++) {
            drops[i] = 1
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.05)' // Slate-900 with very low opacity for trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length))

                // Randomly vary between cyan and blue (matching logo gradient)
                const random = Math.random()
                if (random > 0.9) {
                    ctx.fillStyle = '#67e8f9' // Bright cyan (cyan-300)
                } else if (random > 0.7) {
                    ctx.fillStyle = '#22d3ee' // Cyan (cyan-400)
                } else if (random > 0.4) {
                    ctx.fillStyle = '#06b6d4' // Cyan (cyan-500) - primary
                } else if (random > 0.2) {
                    ctx.fillStyle = '#3b82f6' // Blue (blue-500) - secondary
                } else {
                    ctx.fillStyle = '#60a5fa' // Light blue (blue-400)
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 opacity-20 ${className}`}
        />
    )
}
