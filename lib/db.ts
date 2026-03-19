import { sql } from "@vercel/postgres";
import contentData from "@/data/content.json";

type ServiceRow = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  duration: string;
  icon: string;
  display_order: number;
};

type PackageRow = {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string[];
  ideal_for: string;
  popular: boolean;
  display_order: number;
};

type FaqRow = {
  id: number;
  question: string;
  answer: string;
  display_order: number;
};

type PortfolioRow = {
  id: number;
  title: string;
  image_url: string;
  category: string;
  display_order: number;
};

type TeamRow = {
  id: number;
  name: string;
  role: string;
  description: string;
  image_url: string;
  display_order: number;
};

let initialized = false;
let initPromise: Promise<void> | null = null;

async function seedIfEmpty() {
  const servicesCount = await sql<{
    count: string;
  }>`SELECT COUNT(*)::text AS count FROM services`;
  if (servicesCount.rows[0]?.count === "0") {
    for (let i = 0; i < contentData.services.length; i += 1) {
      const item = contentData.services[i];
      await sql`
        INSERT INTO services (title, description, image_url, duration, icon, display_order)
        VALUES (${item.title}, ${item.description}, ${item.image}, ${item.duration}, ${item.icon}, ${i})
      `;
    }
  }

  const packagesCount = await sql<{
    count: string;
  }>`SELECT COUNT(*)::text AS count FROM packages`;
  if (packagesCount.rows[0]?.count === "0") {
    for (let i = 0; i < contentData.packages.length; i += 1) {
      const item = contentData.packages[i];
      await sql`
        INSERT INTO packages (name, price, duration, features, ideal_for, popular, display_order)
        VALUES (${item.name}, ${Number(item.price)}, ${item.duration}, ${JSON.stringify(item.features)}::jsonb, ${item.ideal}, ${Boolean(item.popular)}, ${i})
      `;
    }
  }

  const faqsCount = await sql<{
    count: string;
  }>`SELECT COUNT(*)::text AS count FROM faqs`;
  if (faqsCount.rows[0]?.count === "0") {
    for (let i = 0; i < contentData.faqs.length; i += 1) {
      const item = contentData.faqs[i];
      await sql`
        INSERT INTO faqs (question, answer, display_order)
        VALUES (${item.question}, ${item.answer}, ${i})
      `;
    }
  }

  const portfolioCount = await sql<{
    count: string;
  }>`SELECT COUNT(*)::text AS count FROM portfolio_items`;
  if (portfolioCount.rows[0]?.count === "0") {
    for (let i = 0; i < contentData.portfolio.length; i += 1) {
      const item = contentData.portfolio[i];
      await sql`
        INSERT INTO portfolio_items (title, image_url, category, display_order)
        VALUES (${item.title}, ${item.image}, ${item.category}, ${i})
      `;
    }
  }

  const teamCount = await sql<{
    count: string;
  }>`SELECT COUNT(*)::text AS count FROM team_members`;
  if (teamCount.rows[0]?.count === "0") {
    const team = contentData.business.team || [];
    for (let i = 0; i < team.length; i += 1) {
      const member = team[i];
      const defaultImage =
        typeof (member as { image?: string }).image === "string"
          ? ((member as { image?: string }).image ?? "")
          : "";
      await sql`
        INSERT INTO team_members (name, role, description, image_url, display_order)
        VALUES (${member.name}, ${member.role}, ${member.description}, ${defaultImage}, ${i})
      `;
    }
  }

  await sql`
    INSERT INTO settings (key, value)
    VALUES
      ('hero_title', ${contentData.business.tagline}),
      ('hero_subtitle', ${contentData.business.description}),
      ('hero_desktop_variant', 'desktop_v1'),
      ('hero_mobile_variant', 'mobile_v1'),
      ('hero_image_desktop_v1', ''),
      ('hero_image_desktop_v2', ''),
      ('hero_image_desktop_v3', ''),
      ('hero_image_mobile_v1', ''),
      ('hero_image_mobile_v2', ''),
      ('portfolio_mode', 'visible'),
      ('about_text', ${contentData.business.about || ""}),
      ('whatsapp_martina', ${contentData.business.whatsapp || ""}),
      ('whatsapp_luz', ${contentData.business.whatsapp_luz || contentData.business.whatsapp || ""}),
      ('footer_description', ${contentData.business.description || ""}),
      ('footer_email', ${contentData.business.email || ""}),
      ('footer_phone', ${contentData.business.phone || ""}),
      ('footer_location', ${contentData.business.location || ""}),
      ('footer_instagram', ${contentData.business.instagram || ""}),
      ('footer_facebook', ${contentData.business.facebook || ""}),
      ('contact_phone', ${contentData.business.phone || ""}),
      ('contact_instagram', ${contentData.business.instagram || ""}),
      ('contact_location', ${contentData.business.location || ""}),
      ('contact_delivery', ${contentData.business.delivery || ""}),
      ('contact_working_hours', ${contentData.business.workingHours || ""}),
      ('contact_advance_booking', ${contentData.business.advanceBooking || ""})
    ON CONFLICT (key) DO NOTHING
  `;
}

export async function ensureDatabase() {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        duration TEXT NOT NULL,
        icon TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        duration TEXT NOT NULL,
        features JSONB NOT NULL DEFAULT '[]'::jsonb,
        ideal_for TEXT NOT NULL,
        popular BOOLEAN NOT NULL DEFAULT false,
        display_order INTEGER NOT NULL DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_items (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        category TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS media_assets (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        content BYTEA NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await seedIfEmpty();
    initialized = true;
  })();

  return initPromise;
}

export async function getSettingsMap() {
  await ensureDatabase();
  const result = await sql<{
    key: string;
    value: string;
  }>`SELECT key, value FROM settings`;
  const map: Record<string, string> = {};
  result.rows.forEach((row) => {
    map[row.key] = row.value;
  });
  return map;
}

export async function getServices(): Promise<ServiceRow[]> {
  await ensureDatabase();
  const result = await sql<ServiceRow>`
    SELECT id, title, description, image_url, duration, icon, display_order
    FROM services
    ORDER BY display_order ASC, id ASC
  `;
  return result.rows;
}

export async function getPackages(): Promise<PackageRow[]> {
  await ensureDatabase();
  const result = await sql<PackageRow>`
    SELECT id, name, price, duration, features, ideal_for, popular, display_order
    FROM packages
    ORDER BY display_order ASC, id ASC
  `;
  return result.rows;
}

export async function getFaqs(): Promise<FaqRow[]> {
  await ensureDatabase();
  const result = await sql<FaqRow>`
    SELECT id, question, answer, display_order
    FROM faqs
    ORDER BY display_order ASC, id ASC
  `;
  return result.rows;
}

export async function getPortfolioItems(): Promise<PortfolioRow[]> {
  await ensureDatabase();
  const result = await sql<PortfolioRow>`
    SELECT id, title, image_url, category, display_order
    FROM portfolio_items
    ORDER BY display_order ASC, id ASC
  `;
  return result.rows;
}

export async function getTeamMembers(): Promise<TeamRow[]> {
  await ensureDatabase();
  const result = await sql<TeamRow>`
    SELECT id, name, role, description, image_url, display_order
    FROM team_members
    ORDER BY display_order ASC, id ASC
  `;
  return result.rows;
}
