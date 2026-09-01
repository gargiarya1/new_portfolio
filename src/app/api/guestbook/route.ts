import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// NOTE: this stores entries in a JSON file on disk, which works great on a
// persistent Node server (e.g. Hostinger Node hosting, a VPS, `next start`
// on a long-running process). On serverless hosts with an ephemeral/
// read-only filesystem (Vercel, most edge platforms) writes won't persist
// across deployments or cold starts — swap this for a real database
// (Supabase, Turso, etc.) if you deploy there.

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "guestbook.json");
const MAX_ENTRIES = 200;
const NAME_MAX = 40;
const MESSAGE_MAX = 220;

type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

async function readEntries(): Promise<Entry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeEntries(entries: Entry[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function GET() {
  const entries = await readEntries();
  return NextResponse.json({ entries: entries.slice(0, MAX_ENTRIES) });
}

export async function POST(request: Request) {
  let body: { name?: string; message?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot — real visitors never fill this hidden field.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim().replace(/\s+/g, " ");
  const message = body.message?.trim().replace(/\s+/g, " ");

  if (!name || !message) {
    return NextResponse.json({ error: "Name and message are both required." }, { status: 400 });
  }
  if (name.length > NAME_MAX) {
    return NextResponse.json({ error: `Keep your name under ${NAME_MAX} characters.` }, { status: 400 });
  }
  if (message.length > MESSAGE_MAX) {
    return NextResponse.json({ error: `Keep your note under ${MESSAGE_MAX} characters.` }, { status: 400 });
  }

  const entry: Entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    message,
    createdAt: new Date().toISOString(),
  };

  const entries = await readEntries();
  entries.unshift(entry);
  await writeEntries(entries.slice(0, MAX_ENTRIES));

  return NextResponse.json({ ok: true, entry });
}
