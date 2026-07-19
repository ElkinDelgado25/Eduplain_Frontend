import { useEffect, useRef } from 'react'
import type { COBEOptions, Globe } from 'cobe'

const markers: NonNullable<COBEOptions['markers']> = [
  { location: [-0.1807, -78.4678], size: 0.13 },
  { location: [4.711, -74.0721], size: 0.055 },
  { location: [-12.0464, -77.0428], size: 0.055 },
  { location: [-33.4489, -70.6693], size: 0.055 },
  { location: [19.4326, -99.1332], size: 0.055 },
  { location: [9.9281, -84.0907], size: 0.055 },
  { location: [8.9824, -79.5199], size: 0.055 },
  { location: [-34.6037, -58.3816], size: 0.055 },
  { location: [-15.7939, -47.8828], size: 0.055 },
  { location: [40.7128, -74.006], size: 0.055 },
  { location: [40.4168, -3.7038], size: 0.055 },
  { location: [18.4861, -69.9312], size: 0.055 },
]

const arcs: NonNullable<COBEOptions['arcs']> = [
  { from: [-0.1807, -78.4678], to: [40.7128, -74.006] },
  { from: [-0.1807, -78.4678], to: [40.4168, -3.7038] },
  { from: [-0.1807, -78.4678], to: [19.4326, -99.1332] },
  { from: [-0.1807, -78.4678], to: [-34.6037, -58.3816] },
  { from: [-0.1807, -78.4678], to: [18.4861, -69.9312] },
]

function EduplainGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let globe: Globe | null = null
    let resizeObserver: ResizeObserver | null = null
    let animationFrame = 0
    let cancelled = false
    let phi = -0.45

    async function mountGlobe() {
      const canvas = canvasRef.current
      const container = containerRef.current

      if (!canvas || !container) {
        return
      }

      const { default: createGlobe } = await import('cobe')

      if (cancelled) {
        return
      }

      const getSize = () => {
        const width = container.getBoundingClientRect().width
        return Math.max(280, Math.min(width, 560))
      }

      const renderGlobe = () => {
        globe?.destroy()

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        const size = getSize()
        const width = Math.floor(size * pixelRatio)
        const height = Math.floor(size * pixelRatio)

        canvas.width = width
        canvas.height = height
        canvas.style.width = `${size}px`
        canvas.style.height = `${size}px`

        globe = createGlobe(canvas, {
          devicePixelRatio: pixelRatio,
          width,
          height,
          phi,
          theta: 0.18,
          dark: 1,
          diffuse: 0.95,
          scale: 1.03,
          mapSamples: 16000,
          mapBrightness: 3.4,
          mapBaseBrightness: 0.28,
          baseColor: [0.04, 0.28, 0.72],
          markerColor: [0.34, 0.68, 1],
          glowColor: [0.03, 0.2, 0.62],
          offset: [0, 0],
          markers,
          arcs,
          arcColor: [0.34, 0.68, 1],
          arcHeight: 0.28,
          arcWidth: 0.6,
          markerElevation: 0.02,
        })
      }

      const animate = () => {
        phi += 0.0025
        globe?.update({ phi })
        animationFrame = requestAnimationFrame(animate)
      }

      renderGlobe()
      animate()
      resizeObserver = new ResizeObserver(renderGlobe)
      resizeObserver.observe(container)
    }

    void mountGlobe()

    return () => {
      cancelled = true
      cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
      globe?.destroy()
    }
  }, [])

  return (
    <div className="globe-panel" ref={containerRef} aria-hidden="true">
      <canvas className="globe-canvas" ref={canvasRef} />
      <div className="globe-caption">
        <span>12 países</span>
        <span>1 comunidad</span>
      </div>
    </div>
  )
}

export default EduplainGlobe
