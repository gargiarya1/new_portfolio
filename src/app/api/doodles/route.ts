import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// See src/app/api/guestbook/route.ts for the same file-storage caveat:
// fine on a persistent Node host, not on ephemeral serverless filesystems.

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "doodles.json");
const MAX_ENTRIES = 60;
const NAME_MAX = 40;
const MAX_DATA_URL_LENGTH = 400_000; // ~300KB decoded, plenty for a small doodle

type Doodle = {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: string;
};

async function readEntries(): Promise<Doodle[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeEntries(entries: Doodle[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function GET() {
  const entries = await readEntries();
  return NextResponse.json({ entries: entries.slice(0, MAX_ENTRIES) });
}

export async function POST(request: Request) {
  let body: { name?: string; dataUrl?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name?.trim() || "Anonymous").slice(0, NAME_MAX);
  const dataUrl = body.dataUrl;

  if (!dataUrl || !dataUrl.startsWith("data:image/png;base64,")) {
    return NextResponse.json({ error: "That doesn't look like a valid drawing." }, { status: 400 });
  }
  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    return NextResponse.json({ error: "That drawing is too large — try something simpler." }, { status: 400 });
  }

  const entry: Doodle = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    dataUrl,
    createdAt: new Date().toISOString(),
  };

  const entries = await readEntries();
  entries.unshift(entry);
  await writeEntries(entries.slice(0, MAX_ENTRIES));

  return NextResponse.json({ ok: true, entry });
}
