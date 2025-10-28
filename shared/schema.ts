import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Breakpoint type
export const breakpointSchema = z.enum(['mobile', 'tablet', 'desktop']);
export type Breakpoint = z.infer<typeof breakpointSchema>;

// Style object schema for each breakpoint
export const styleObjectSchema = z.record(z.string(), z.any());
export type StyleObject = z.infer<typeof styleObjectSchema>;

// Breakpoint styles schema
export const breakpointStylesSchema = z.object({
  mobile: styleObjectSchema.optional(),
  tablet: styleObjectSchema.optional(),
  desktop: styleObjectSchema.optional(),
});
export type BreakpointStyles = z.infer<typeof breakpointStylesSchema>;

// Block types
export const blockTypeSchema = z.enum([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'paragraph', 'caption', 'quote',
  'list', 'numbered-list',
  'code',
  'divider',
  'image', 'video', 'pdf', 'file',
  'section', 'flex'
]);
export type BlockType = z.infer<typeof blockTypeSchema>;

// Content types for different blocks
export const codeContentSchema = z.object({
  code: z.string(),
  language: z.string(),
});

export const listContentSchema = z.array(z.string());

// Generic block content
export const blockContentSchema = z.union([
  z.string(),
  z.array(z.string()),
  codeContentSchema,
  z.null(),
]);

// Block schema (recursive for nested blocks)
export const blockSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: blockTypeSchema,
    content: blockContentSchema,
    styles: breakpointStylesSchema,
    children: z.array(blockSchema).optional(),
  })
);

export type Block = {
  id: string;
  type: BlockType;
  content: string | string[] | { code: string; language: string } | null;
  styles: BreakpointStyles;
  children?: Block[];
};

// Article schema
export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  blocks: z.array(blockSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Article = z.infer<typeof articleSchema>;

// Database tables
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull().default('Untitled Article'),
  blocks: jsonb("blocks").notNull().default('[]'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
}).partial();

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;
export type SelectArticle = typeof articles.$inferSelect;

// Users (keeping existing schema)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
