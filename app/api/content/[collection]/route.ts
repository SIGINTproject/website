import { NextRequest, NextResponse } from "next/server";

import {
  CONTENT_COLLECTIONS,
  PAGE_SIZE,
  getContentPage,
  type ContentCollection,
} from "@/lib/content";

function isCollection(value: string): value is ContentCollection {
  return (CONTENT_COLLECTIONS as readonly string[]).includes(value);
}

/**
 * GET /api/content/:collection?tag=&page=
 *
 * JSON pagination endpoint for the client-side infinite scroll hook
 * (see hooks/, owned by the PWA workstream). Mirrors the server-rendered
 * list pages so the no-JS `?page=n` links and the enhanced client fetch
 * stay in sync with the same data source (lib/content).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;

  if (!isCollection(collection)) {
    return NextResponse.json({ error: "unknown collection" }, { status: 404 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10) || 1;
  const tag = searchParams.get("tag");

  const result = getContentPage({
    collection,
    page,
    pageSize: PAGE_SIZE,
    tag: tag || null,
  });

  return NextResponse.json(result);
}
