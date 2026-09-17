CREATE TYPE "public"."closure_icon" AS ENUM('rain', 'wrench', 'calendar', 'alert');--> statement-breakpoint
CREATE TYPE "public"."closure_scope" AS ENUM('global', 'service', 'entity');--> statement-breakpoint
CREATE TYPE "public"."service_kind" AS ENUM('kundali', 'horoscope', 'vastu', 'matching', 'muhurta');--> statement-breakpoint
CREATE TYPE "public"."source" AS ENUM('hero', 'card', 'detail', 'floating', 'contact');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('new', 'contacted', 'confirmed', 'completed', 'lost');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"last_login_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_user_id" integer,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" integer NOT NULL,
	"diff" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "closures" (
	"id" serial PRIMARY KEY NOT NULL,
	"scope" "closure_scope" NOT NULL,
	"service_key" "service_kind",
	"entity_type" text,
	"entity_id" integer,
	"is_active" boolean DEFAULT false,
	"icon" "closure_icon",
	"title" text,
	"body" text,
	"footnote" text,
	"cta_label" text,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"title" text,
	"subtitle" text,
	"body" text,
	"items" jsonb DEFAULT '[]',
	"is_active" boolean DEFAULT true,
	"sort_order" integer NOT NULL,
	CONSTRAINT "content_blocks_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"ref_code" text NOT NULL,
	"kind" "service_kind",
	"service_id" integer,
	"product_name_snapshot" text,
	"product_price_snapshot_inr" integer,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"consultation_date" date,
	"message" text,
	"source" "source",
	"status" "status" DEFAULT 'new',
	"payment_status" text DEFAULT 'pending',
	"razorpay_order_id" text,
	"razorpay_payment_id" text,
	"admin_note" text,
	"utm" jsonb DEFAULT '{}',
	"ip_hash" text,
	"user_agent" text,
	"contacted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "enquiries_ref_code_unique" UNIQUE("ref_code")
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_id" integer NOT NULL,
	"caption" text,
	"album" text,
	"sort_order" integer NOT NULL,
	"is_published" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"secure_url" text NOT NULL,
	"width" integer,
	"height" integer,
	"format" text,
	"bytes" integer,
	"placeholder" text,
	"alt_text" text,
	"folder" text,
	CONSTRAINT "media_cloudinary_public_id_unique" UNIQUE("cloudinary_public_id")
);
--> statement-breakpoint
CREATE TABLE "media_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_id" integer NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" integer NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "media_links_entity_type_entity_id_media_id_unique" UNIQUE("entity_type","entity_id","media_id")
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text,
	"body" text NOT NULL,
	"media_id" integer,
	"is_active" boolean DEFAULT false,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"author" text NOT NULL,
	"rating" numeric(2, 1),
	"body" text NOT NULL,
	"avatar_media_id" integer,
	"is_published" boolean DEFAULT false,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "service_kind" NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"summary" text,
	"description" text,
	"price_inr" integer,
	"compare_at_price_inr" integer,
	"quote_only" boolean DEFAULT false,
	"rating" numeric(2, 1),
	"review_count" integer,
	"badge" text,
	"inclusions" jsonb DEFAULT '[]',
	"exclusions" jsonb DEFAULT '[]',
	"terms" jsonb DEFAULT '[]',
	"faqs" jsonb DEFAULT '[]',
	"cover_media_id" integer,
	"sort_order" integer NOT NULL,
	"is_published" boolean DEFAULT false,
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand_name" text DEFAULT 'Vedic Future' NOT NULL,
	"tagline" text,
	"whatsapp_number" text,
	"phone_number" text,
	"email" text,
	"address" text,
	"map_url" text,
	"socials" jsonb DEFAULT '{}',
	"hero_heading" text,
	"hero_sub" text,
	"hero_media_id" integer,
	"announcement" text,
	"announcement_active" boolean DEFAULT false,
	"logo_media_id" integer
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_admin_user_id_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_links" ADD CONSTRAINT "media_links_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_avatar_media_id_media_id_fk" FOREIGN KEY ("avatar_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_cover_media_id_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;