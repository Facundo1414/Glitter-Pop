export const featuredInstagramVideoUrl = 'https://www.instagram.com/p/Dd2PkunxaxR/'

export function parseInstagramPostUrl(url: string) {
  try {
    const parsed = new URL(url.trim())
    const match = parsed.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]+)\/?$/)
    if (parsed.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(parsed.hostname) || !match) return null

    const baseUrl = `https://www.instagram.com/${match[1]}/${match[2]}/`
    const imageIndex = parsed.searchParams.get('img_index')
    const postUrl = imageIndex && /^\d{1,2}$/.test(imageIndex) ? `${baseUrl}?img_index=${imageIndex}` : baseUrl
    return { url: postUrl, embedUrl: `${baseUrl}embed/`, kind: match[1] === 'reel' ? 'Reel' : 'Publicación' }
  } catch {
    return null
  }
}
