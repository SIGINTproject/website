import { z } from "zod";

export const CONTENT_COLLECTIONS = ["activities", "blog"] as const;
export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];

export const PAGE_SIZE = 9;

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  author: z.string().default("TODO(sigint): 執筆者名"),
  draft: z.boolean().default(false),
  coverImage: z.string().optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export interface ContentEntry {
  collection: ContentCollection;
  slug: string;
  frontmatter: Frontmatter;
  readingTimeMinutes: number;
  /** raw MDX source (without frontmatter), compiled by the page component */
  source: string;
}

export interface ContentSummary {
  collection: ContentCollection;
  slug: string;
  frontmatter: Frontmatter;
  readingTimeMinutes: number;
}

export interface ContentPage {
  items: ContentSummary[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  /** tag actually applied to this result set, or null when unfiltered */
  tag: string | null;
}

export interface TagCount {
  tag: string;
  count: number;
}
