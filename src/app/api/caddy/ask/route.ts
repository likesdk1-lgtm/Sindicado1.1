import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain") || searchParams.get("host") || "";
  const host = raw.toLowerCase().trim();

  if (!host) return new NextResponse("missing domain", { status: 400 });

  if (host === "vps66230.publiccloud.com.br") {
    return new NextResponse("ok", { status: 200 });
  }

  if (host.endsWith(".vps66230.publiccloud.com.br")) {
    const subdomain = host.slice(0, -".vps66230.publiccloud.com.br".length);
    if (!/^[a-z0-9-]{2,63}$/.test(subdomain)) {
      return new NextResponse("forbidden", { status: 403 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      select: { id: true },
    });

    if (tenant) {
      return new NextResponse("ok", { status: 200 });
    }
  }

  return new NextResponse("forbidden", { status: 403 });
}
