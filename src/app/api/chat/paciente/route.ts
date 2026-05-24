import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  const res = await fetch(`${apiUrl}/chat-ia/paciente`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  const data = await res.json();
  return NextResponse.json({
    reply: data.mensaje ?? data.reply ?? "",
    imagenes: data.imagenes ?? [],
    videos: data.videos ?? [],
  });
}
