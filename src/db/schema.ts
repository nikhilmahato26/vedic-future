import { 
  pgTable, 
  serial, 
  text, 
  integer, 
  boolean, 
  timestamp, 
  jsonb, 
  numeric, 
  date, 
  pgEnum, 
  unique 
} from 'drizzle-orm/pg-core';


// --- ENUMS ---
export const serviceKindEnum = pgEnum('service_kind', ['kundali', 'horoscope', 'vastu', 'matching', 'muhurta', 'panchang', 'dhan_yoga']);
export const statusEnum = pgEnum('status', ['new', 'contacted', 'confirmed', 'completed', 'lost']);
export const sourceEnum = pgEnum('source', ['hero', 'card', 'detail', 'floating', 'contact']);
export const closureScopeEnum = pgEnum('closure_scope', ['global', 'service', 'entity']);
export const closureIconEnum = pgEnum('closure_icon', ['rain', 'wrench', 'calendar', 'alert']);

// --- SPINE TABLES ---

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  brandName: text('brand_name').notNull().default('Vedic Future'),
  tagline: text('tagline'),
  whatsappNumber: text('whatsapp_number'),
  phoneNumber: text('phone_number'),
  email: text('email'),
  address: text('address'),
  mapUrl: text('map_url'),
  socials: jsonb('socials').default('{}'),
  heroHeading: text('hero_heading'),
  heroSub: text('hero_sub'),
  heroMediaId: integer('hero_media_id'),
  announcement: text('announcement'),
  announcementActive: boolean('announcement_active').default(false),
  logoMediaId: integer('logo_media_id'),
});

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  cloudinaryPublicId: text('cloudinary_public_id').notNull().unique(),
  secureUrl: text('secure_url').notNull(),
  width: integer('width'),
  height: integer('height'),
  format: text('format'),
  bytes: integer('bytes'),
  placeholder: text('placeholder'),
  altText: text('alt_text'),
  folder: text('folder'),
});

export const mediaLinks = pgTable('media_links', {
  id: serial('id').primaryKey(),
  mediaId: integer('media_id').references(() => media.id, { onDelete: 'cascade' }).notNull(),
  entityType: text('entity_type').notNull(),
  entityId: integer('entity_id').notNull(),
  sortOrder: integer('sort_order').notNull(),
}, (t) => ({
  unq: unique().on(t.entityType, t.entityId, t.mediaId)
}));

export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  mediaId: integer('media_id').references(() => media.id, { onDelete: 'cascade' }).notNull(),
  caption: text('caption'),
  album: text('album'),
  sortOrder: integer('sort_order').notNull(),
  isPublished: boolean('is_published').default(false),
});

export const contentBlocks = pgTable('content_blocks', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  title: text('title'),
  subtitle: text('subtitle'),
  body: text('body'),
  items: jsonb('items').default('[]'),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').notNull(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  author: text('author').notNull(),
  rating: numeric('rating', { precision: 2, scale: 1 }),
  body: text('body').notNull(),
  avatarMediaId: integer('avatar_media_id').references(() => media.id, { onDelete: 'set null' }),
  isPublished: boolean('is_published').default(false),
  sortOrder: integer('sort_order').notNull(),
});

export const promotions = pgTable('promotions', {
  id: serial('id').primaryKey(),
  label: text('label'),
  body: text('body').notNull(),
  mediaId: integer('media_id').references(() => media.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').default(false),
  sortOrder: integer('sort_order').notNull(),
});

export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  adminUserId: integer('admin_user_id').references(() => adminUsers.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: integer('entity_id').notNull(),
  diff: jsonb('diff'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const closures = pgTable('closures', {
  id: serial('id').primaryKey(),
  scope: closureScopeEnum('scope').notNull(),
  serviceKey: serviceKindEnum('service_key'),
  entityType: text('entity_type'),
  entityId: integer('entity_id'),
  isActive: boolean('is_active').default(false),
  icon: closureIconEnum('icon'),
  title: text('title'),
  body: text('body'),
  footnote: text('footnote'),
  ctaLabel: text('cta_label'),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  version: integer('version').default(1).notNull(),
});

// --- CATALOG TABLE ---

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  kind: serviceKindEnum('kind').notNull(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  summary: text('summary'),
  description: text('description'),
  priceInr: integer('price_inr'),
  compareAtPriceInr: integer('compare_at_price_inr'),
  quoteOnly: boolean('quote_only').default(false),
  rating: numeric('rating', { precision: 2, scale: 1 }),
  reviewCount: integer('review_count'),
  badge: text('badge'),
  inclusions: jsonb('inclusions').default('[]'),
  exclusions: jsonb('exclusions').default('[]'),
  terms: jsonb('terms').default('[]'),
  faqs: jsonb('faqs').default('[]'),
  coverMediaId: integer('cover_media_id').references(() => media.id, { onDelete: 'set null' }),
  sortOrder: integer('sort_order').notNull(),
  isPublished: boolean('is_published').default(false),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// --- ENQUIRIES / ORDERS ---

export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  refCode: text('ref_code').notNull().unique(),
  kind: serviceKindEnum('kind'),
  serviceId: integer('service_id').references(() => services.id, { onDelete: 'set null' }),
  productNameSnapshot: text('product_name_snapshot'),
  productPriceSnapshotInr: integer('product_price_snapshot_inr'),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  consultationDate: date('consultation_date'),
  message: text('message'),
  source: sourceEnum('source'),
  status: statusEnum('status').default('new'),
  
  // Razorpay Additions
  paymentStatus: text('payment_status').default('pending'), // pending, paid, failed
  razorpayOrderId: text('razorpay_order_id'),
  razorpayPaymentId: text('razorpay_payment_id'),

  adminNote: text('admin_note'),
  utm: jsonb('utm').default('{}'),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  contactedAt: timestamp('contacted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
