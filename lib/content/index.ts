import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

import {
  type ContentCollection,
  type ContentEntry,
  type ContentPage,
  type ContentSummary,
  type TagCount,
  PAGE_SIZE,
  frontmatterSchema,
} from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function collectionDir(collection: ContentCollection): string {
  return path.join(CONTENT_ROOT, collection);
}

function readSlugs(collection: ContentCollection): string[] {
  const dir = collectionDir(collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readEntry(collection: ContentCollection, slug: string): ContentEntry {
  const filePath = path.join(collectionDir(collection), `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = frontmatterSchema.parse(data);
  return {
    collection,
    slug,
    frontmatter,
    readingTimeMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    source: content,
  };
}

function isPublished(entry: ContentEntry): boolean {
  return process.env.NODE_ENV !== "production" || !entry.frontmatter.draft;
}

const cache: Partial<Record<ContentCollection, ContentEntry[]>> = {};

/** All non-draft entries in a collection, newest first. Cached per process. */
function getAllEntries(collection: ContentCollection): ContentEntry[] {
  const cached = cache[collection];
  if (cached) return cached;

  const entries = readSlugs(collection)
    .map((slug) => readEntry(collection, slug))
    .filter(isPublished)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));

  cache[collection] = entries;
  return entries;
}

function toSummary(entry: ContentEntry): ContentSummary {
  return {
    collection: entry.collection,
    slug: entry.slug,
    frontmatter: entry.frontmatter,
    readingTimeMinutes: entry.readingTimeMinutes,
  };
}

export function getAllSlugs(collection: ContentCollection): string[] {
  return getAllEntries(collection).map((entry) => entry.slug);
}

export function getEntryBySlug(
  collection: ContentCollection,
  slug: string,
): ContentEntry | null {
  return getAllEntries(collection).find((entry) => entry.slug === slug) ?? null;
}

export function getAllTags(collection: ContentCollection): TagCount[] {
  const counts = new Map<string, number>();
  for (const entry of getAllEntries(collection)) {
    for (const tag of entry.frontmatter.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([tag, count]) => ({ tag, count })).sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
}

export interface GetContentPageOptions {
  collection: ContentCollection;
  /** 1-indexed page number */
  page?: number;
  pageSize?: number;
  tag?: string | null;
}

/**
 * Paginated, optionally tag-filtered listing.
 * This is the single source of truth for list pages (server-rendered page 1
 * and no-JS `?page=n` links) and for the JSON API the client-side infinite
 * scroll hook (owned by the PWA workstream) fetches subsequent pages from.
 */
export function getContentPage({
  collection,
  page = 1,
  pageSize = PAGE_SIZE,
  tag = null,
}: GetContentPageOptions): ContentPage {
  const safePage = Math.max(1, Math.floor(page));
  const all = getAllEntries(collection).filter(
    (entry) => !tag || entry.frontmatter.tags.includes(tag),
  );

  const totalItems = all.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (safePage - 1) * pageSize;
  const items = all.slice(start, start + pageSize).map(toSummary);

  return {
    items,
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: safePage < totalPages,
    tag,
  };
}

export * from "./types";
