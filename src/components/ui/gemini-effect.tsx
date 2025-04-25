"use client"

import { useEffect, useRef } from "react"

export const GoogleGeminiEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const circles: Circle[] = []
    const minRadius = 5
    const maxRadius = 20
    const totalCircles = 30
    const colors = ["#4285f4", "#34a853", "#fbbc05", "#ea4335"]

    class Circle {
      x: number
      y: number
      radius: number
      color: string
      dx: number
      dy: number
      
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = minRadius + Math.random() * (maxRadius - minRadius)
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.dx = (Math.random() - 0.5) * 2
        this.dy = (Math.random() - 0.5) * 2
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
      }

      update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy
        }

        this.x += this.dx
        this.y += this.dy
        this.draw()
      }
    }

    const init = () => {
      circles.length = 0
      for (let i = 0; i < totalCircles; i++) {
        circles.push(new Circle())
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      circles.forEach((circle) => {
        circle.update()
      })
      
      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      init()
    }

    handleResize()
    animate()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  )
} 