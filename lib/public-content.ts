import 'server-only'

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import content from '@/data/content.json'
import { selectPublicServiceRows } from '@/lib/service-selection'
import {
  getFaqs,
  getPackages,
  getPortfolioItems,
  getServices,
  getSettingsMap,
  getTeamMembers,
} from '@/lib/db'

export type PublicSettings = Record<string, string>

function availableImage(image: string): string {
  if (!image.startsWith('/images/')) return image
  if (!/^\/images\/(?:portfolio\/)?[A-Za-z0-9._-]+$/.test(image)) return ''
  return existsSync(join(process.cwd(), 'public', image.slice(1))) ? image : ''
}

async function withFallback<T>(label: string, load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load()
  } catch {
    console.error(`Public ${label} unavailable; using local content.`)
    return fallback
  }
}

export function loadPublicSettings() {
  return withFallback('settings', getSettingsMap, {} as PublicSettings)
}

export function loadPublicServices() {
  const fallback = content.services.map((item) => ({ ...item, image: availableImage(item.image) }))
  return withFallback('services', async () => {
    const rows = await getServices()
    const current = selectPublicServiceRows(rows)
    if (current.length !== 2) return fallback
    return current.map((item) => ({
      id: String(item.id), title: item.title, description: item.description,
      image: availableImage(item.image_url), duration: item.duration, icon: item.icon,
    }))
  }, fallback)
}

export function loadPublicTeam() {
  return withFallback('team', async () => {
    const rows = await getTeamMembers()
    return rows.map((member) => ({
      id: String(member.id), name: member.name, role: member.role,
      description: member.description, image: member.image_url,
    }))
  }, content.business.team.map((member, index) => ({ ...member, id: String(index + 1), image: '' })))
}

export function loadPublicPackages() {
  return withFallback('packages', async () => {
    const rows = await getPackages()
    return rows.map((item) => ({
      id: String(item.id), name: item.name, price: String(item.price),
      duration: item.duration, features: item.features, ideal: item.ideal_for,
      popular: item.popular,
    }))
  }, content.packages)
}

export function loadPublicFaqs() {
  return withFallback('faqs', async () => {
    const rows = await getFaqs()
    return rows.map((item) => ({ id: String(item.id), question: item.question, answer: item.answer }))
  }, content.faqs)
}

export function loadPublicPortfolio() {
  return withFallback('portfolio', async () => {
    const rows = await getPortfolioItems()
    return rows
      .map((item) => ({ id: String(item.id), title: item.title, image: availableImage(item.image_url), category: item.category }))
      .filter((item) => item.image)
  }, content.portfolio
    .map((item) => ({ ...item, image: availableImage(item.image) }))
    .filter((item) => item.image))
}
