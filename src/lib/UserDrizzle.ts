// drizzle/schema.ts
import { pgTable, varchar, integer, serial, timestamp } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

// Define your users table
export const userr = pgTable('userr', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define your orders table
export const orderss = pgTable('orderss', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => userr.id),
  product: varchar('product', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define your cart table
export const cartTable = pgTable("cart", {
  id: serial("id").primaryKey(),
  user_id: varchar('user_id', { length: 225 }).notNull(),
  product_id: varchar('product_id', { length: 225 }).notNull(),
  quantity: integer("quantity").notNull()
});

// Initialize the drizzle instance
export const db = drizzle(sql);
