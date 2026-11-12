import { NextResponse } from 'next/server';
import { client } from '@/lib/db';
import { PRODUCTS } from '@/lib/data';

const DEFAULT_COLLECTIONS = [
  {
    id: 'col-1',
    title: 'Royal Velvet Kurtis',
    subtitle: 'Handcrafted zardozi & gota patti',
    image: '/images/hero_maroon_kurta.jpg',
    linkCategory: 'Kurtis',
  },
  {
    id: 'col-2',
    title: 'Floral Maxi Dresses',
    subtitle: 'Breezy georgette & tiered frills',
    image: '/images/dress_floral_maxi.jpg',
    linkCategory: 'Dresses',
  },
  {
    id: 'col-3',
    title: 'Festive Anarkalis',
    subtitle: 'Pristine ivory & pastel embroidery',
    image: '/images/ethnic_kurti_cream.jpg',
    linkCategory: 'Ethnic Wear',
  },
  {
    id: 'col-4',
    title: 'Chanderi Silk Sarees',
    subtitle: 'Jaipur handwoven gold zari',
    image: '/images/dress_solid_midi.jpg',
    linkCategory: 'Sarees',
  },
];

const DEFAULT_BANNERS = [
  {
    id: 'banner-1',
    title: 'The Royal Heritage Edit',
    subtitle: 'Discover timeless Indian ethnic & modern western wear crafted for the modern feminine grace.',
    image: '/images/hero_maroon_kurta.jpg',
    ctaText: 'Explore Collection',
    ctaLink: 'shop',
  },
];

export async function GET() {
  try {
    // Ensure catalog tables exist
    await client.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT,
        price INTEGER NOT NULL,
        original_price INTEGER NOT NULL,
        discount_percent INTEGER NOT NULL,
        rating REAL NOT NULL,
        review_count INTEGER NOT NULL,
        description TEXT NOT NULL,
        images_json TEXT NOT NULL,
        colors_json TEXT NOT NULL,
        sizes_json TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 50,
        is_bestseller INTEGER NOT NULL DEFAULT 0,
        is_new INTEGER NOT NULL DEFAULT 0
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        image TEXT NOT NULL,
        link_category TEXT NOT NULL
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS banners (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        image TEXT NOT NULL,
        cta_text TEXT NOT NULL,
        cta_link TEXT NOT NULL
      );
    `);

    // Check if products table is empty, if so seed it
    const prodRes = await client.execute(`SELECT COUNT(*) as cnt FROM products`);
    const count = Number(prodRes.rows[0]?.cnt || 0);

    if (count === 0) {
      for (const p of PRODUCTS) {
        await client.execute({
          sql: `INSERT INTO products (id, name, category, subcategory, price, original_price, discount_percent, rating, review_count, description, images_json, colors_json, sizes_json, stock, is_bestseller, is_new) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            String(p.id),
            String(p.name),
            String(p.category),
            String(p.subcategory || ''),
            Number(p.price),
            Number(p.originalPrice),
            Number(p.discountPercent || 0),
            Number(p.rating || 4.5),
            Number(p.reviewCount || 100),
            String(p.description),
            JSON.stringify(p.images),
            JSON.stringify(p.colors),
            JSON.stringify(p.sizes),
            45,
            p.isBestSeller ? 1 : 0,
            p.isNew ? 1 : 0,
          ] as (string | number)[],
        });
      }

      for (const c of DEFAULT_COLLECTIONS) {
        await client.execute({
          sql: `INSERT INTO collections (id, title, subtitle, image, link_category) VALUES (?, ?, ?, ?, ?)`,
          args: [c.id, c.title, c.subtitle, c.image, c.linkCategory],
        });
      }

      for (const b of DEFAULT_BANNERS) {
        await client.execute({
          sql: `INSERT INTO banners (id, title, subtitle, image, cta_text, cta_link) VALUES (?, ?, ?, ?, ?, ?)`,
          args: [b.id, b.title, b.subtitle, b.image, b.ctaText, b.ctaLink],
        });
      }
    }

    // Fetch all catalog items from Turso
    const dbProducts = await client.execute(`SELECT * FROM products`);
    const dbCollections = await client.execute(`SELECT * FROM collections`);
    const dbBanners = await client.execute(`SELECT * FROM banners`);

    const products = dbProducts.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      category: String(row.category),
      subcategory: String(row.subcategory || ''),
      price: Number(row.price),
      originalPrice: Number(row.original_price),
      discountPercent: Number(row.discount_percent),
      rating: Number(row.rating),
      reviewCount: Number(row.review_count),
      description: String(row.description),
      images: JSON.parse(String(row.images_json || '[]')),
      colors: JSON.parse(String(row.colors_json || '[]')),
      sizes: JSON.parse(String(row.sizes_json || '[]')),
      stock: Number(row.stock || 0), // number of clothes have or left
      isBestSeller: Boolean(row.is_bestseller),
      isNew: Boolean(row.is_new),
    }));

    const collections = dbCollections.rows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      subtitle: String(row.subtitle),
      image: String(row.image),
      linkCategory: String(row.link_category),
    }));

    const banners = dbBanners.rows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      subtitle: String(row.subtitle),
      image: String(row.image),
      ctaText: String(row.cta_text),
      ctaLink: String(row.cta_link),
    }));

    return NextResponse.json({ success: true, products, collections, banners });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Catalog fetch failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
