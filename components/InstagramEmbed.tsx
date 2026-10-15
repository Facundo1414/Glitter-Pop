'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

type InstagramWindow = Window & {
  instgrm?: { Embeds?: { process: () => void } }
}

function processInstagramEmbeds() {
  (window as InstagramWindow).instgrm?.Embeds?.process()
}

export function InstagramEmbed({ url, label, className = '' }: { url: string; label: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const placeholder = document.createElement('blockquote')
    placeholder.className = 'instagram-media'
    placeholder.setAttribute('data-instgrm-permalink', url)
    placeholder.setAttribute('data-instgrm-version', '14')
    placeholder.style.width = '100%'
    placeholder.style.maxWidth = '100%'
    placeholder.style.minWidth = '0'
    placeholder.style.margin = '0'
    container.replaceChildren(placeholder)
    processInstagramEmbeds()

    return () => { container.replaceChildren() }
  }, [url])

  return <div ref={containerRef} role="group" aria-label={label} className={`instagram-embed ${className}`} />
}

export function InstagramEmbedScript() {
  return <Script id="instagram-embed-script" src="https://www.instagram.com/embed.js" strategy="afterInteractive" onReady={processInstagramEmbeds} />
}
