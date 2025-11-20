'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    life: number
}

export function ParticleHover({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const particles = useRef<Particle[]>([])
    const animationFrameId = useRef<number>()
    const mouse = useRef({ x: 0, y: 0, active: false })

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = container.offsetWidth
            canvas.height = container.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const createParticle = (x: number, y: number) => {
            const colors = ['#60A5FA', '#34D399', '#A78BFA', '#F472B6']
            return {
                x,
                y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (mouse.current.active) {
                for (let i = 0; i < 2; i++) {
                    particles.current.push(createParticle(mouse.current.x, mouse.current.y))
                }
            }

            particles.current.forEach((p, index) => {
                p.x += p.vx
                p.y += p.vy
                p.life -= 0.02
                p.size -= 0.01

                if (p.life <= 0 || p.size <= 0) {
                    particles.current.splice(index, 1)
                    return
                }

                ctx.globalAlpha = p.life
                ctx.fillStyle = p.color
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })

            animationFrameId.current = requestAnimationFrame(animate)
        }
        animate()

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            mouse.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true
            }
        }

        const handleMouseLeave = () => {
            mouse.current.active = false
        }

        container.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            window.removeEventListener('resize', resize)
            container.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('mouseleave', handleMouseLeave)
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
        }
    }, [])

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none z-10"
            />
            <div className="relative z-20">
                {children}
            </div>
        </div>
    )
}
