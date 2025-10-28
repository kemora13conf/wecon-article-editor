import { type User, type InsertUser, type SelectArticle, type InsertArticle, type UpdateArticle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article methods
  getAllArticles(): Promise<SelectArticle[]>;
  getArticle(id: string): Promise<SelectArticle | undefined>;
  createArticle(article: InsertArticle): Promise<SelectArticle>;
  updateArticle(id: string, article: UpdateArticle): Promise<SelectArticle | undefined>;
  deleteArticle(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, SelectArticle>;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Article methods
  async getAllArticles(): Promise<SelectArticle[]> {
    return Array.from(this.articles.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getArticle(id: string): Promise<SelectArticle | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<SelectArticle> {
    const id = randomUUID();
    const now = new Date();
    const article: SelectArticle = {
      id,
      title: insertArticle.title || 'Untitled Article',
      blocks: insertArticle.blocks || [],
      createdAt: now,
      updatedAt: now,
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updateArticle: UpdateArticle): Promise<SelectArticle | undefined> {
    const existing = this.articles.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: SelectArticle = {
      ...existing,
      ...updateArticle,
      updatedAt: new Date(),
    };
    this.articles.set(id, updated);
    return updated;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }
}

export const storage = new MemStorage();
