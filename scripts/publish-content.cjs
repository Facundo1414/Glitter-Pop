// One-time, guarded publication of the site's curated services and portfolio.
// Usage: node scripts/publish-content.cjs <absolute-backup-path>
const { existsSync, readFileSync, writeFileSync } = require('node:fs')
const { isAbsolute } = require('node:path')

if (existsSync('.env')) process.loadEnvFile('.env')
const { db } = require('@vercel/postgres')

const backupPath = process.argv[2]
if (!backupPath || !isAbsolute(backupPath) || existsSync(backupPath)) {
  throw new Error('Provide an unused absolute path for the database backup.')
}

const content = JSON.parse(readFileSync('data/content.json', 'utf8'))
const instagramPosts = JSON.parse(readFileSync('data/instagram-posts.json', 'utf8'))
const oldPortfolio = [
  ['Festival de Verano', '/images/image-1.webp'],
  ['Cumpleaños Ana', '/images/image-2.webp'],
  ['Evento Corporativo Tech', '/images/image-3.webp'],
  ['Boda Mágica', '/images/image-4.webp'],
  ['Fiesta Neon', '/images/image-5.webp'],
  ['Quinceañera Sofi', '/images/image-6.webp'],
]

async function main() {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    await client.query('LOCK TABLE services, portfolio_items, settings IN EXCLUSIVE MODE')
    const services = (await client.query('SELECT * FROM services ORDER BY id')).rows
    const portfolio = (await client.query('SELECT * FROM portfolio_items ORDER BY id')).rows
    const settings = (await client.query("SELECT * FROM settings WHERE key IN ('portfolio_mode', 'hero_video_url', 'instagram_posts') ORDER BY key")).rows

    const oldServicesOnly = services.length === 1 && services[0].title === 'Eventos Corporativos'
    const newServicesOnly = services.length === content.services.length && services.every((row, index) =>
      row.title === content.services[index].title && row.description === content.services[index].description)
    const oldPortfolioOnly = portfolio.length === oldPortfolio.length && portfolio.every((row, index) =>
      row.title === oldPortfolio[index][0] && row.image_url === oldPortfolio[index][1])
    const newPortfolioOnly = portfolio.length === content.portfolio.length && portfolio.every((row, index) =>
      row.title === content.portfolio[index].title && row.image_url === content.portfolio[index].image)

    if ((!oldServicesOnly && !newServicesOnly) || (!oldPortfolioOnly && !newPortfolioOnly)) {
      throw new Error('Database content differs from the audited defaults. No changes made.')
    }

    writeFileSync(backupPath, JSON.stringify({ services, portfolio, settings }, null, 2), { flag: 'wx' })

    if (oldServicesOnly) {
      await client.query('DELETE FROM services')
      for (const [index, item] of content.services.entries()) {
        await client.query(
          'INSERT INTO services (title, description, image_url, duration, icon, display_order) VALUES ($1, $2, $3, $4, $5, $6)',
          [item.title, item.description, item.image, item.duration, item.icon, index],
        )
      }
    }
    if (oldPortfolioOnly) {
      await client.query('DELETE FROM portfolio_items')
      for (const [index, item] of content.portfolio.entries()) {
        await client.query(
          'INSERT INTO portfolio_items (title, image_url, category, display_order) VALUES ($1, $2, $3, $4)',
          [item.title, item.image, item.category, index],
        )
      }
    }

    await client.query("INSERT INTO settings (key, value) VALUES ('portfolio_mode', 'visible') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value")
    await client.query("INSERT INTO settings (key, value) VALUES ('hero_video_url', $1) ON CONFLICT (key) DO NOTHING", ['https://www.instagram.com/p/Dd2PkunxaxR/'])
    await client.query("INSERT INTO settings (key, value) VALUES ('instagram_posts', $1) ON CONFLICT (key) DO NOTHING", [instagramPosts.join('\n')])

    await client.query('COMMIT')
    console.log(`Published ${content.services.length} services and ${content.portfolio.length} portfolio photos. Backup: ${backupPath}`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await db.end()
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1 })
