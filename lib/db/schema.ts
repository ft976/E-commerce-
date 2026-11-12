import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  price: integer('price').notNull(),
  originalPrice: integer('original_price').notNull(),
  discountPercent: integer('discount_percent').notNull(),
  rating: real('rating').notNull(),
  reviewCount: integer('review_count').notNull(),
  description: text('description').notNull(),
  imagesJson: text('images_json').notNull(), // JSON string array of images
  colorsJson: text('colors_json').notNull(), // JSON string array of color objects
  sizesJson: text('sizes_json').notNull(), // JSON string array of sizes
  stock: integer('stock').notNull().default(50), // number of clothes have or left
  isBestSeller: integer('is_bestseller', { mode: 'boolean' }).notNull().default(false),
  isNew: integer('is_new', { mode: 'boolean' }).notNull().default(false),
});

export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  image: text('image').notNull(),
  linkCategory: text('link_category').notNull(),
});

export const banners = sqliteTable('banners', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  image: text('image').notNull(),
  ctaText: text('cta_text').notNull(),
  ctaLink: text('cta_link').notNull(),
});

