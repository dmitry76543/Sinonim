import { NextResponse } from "next/server";
import { isYooKassaConfigured } from "@/lib/yookassa/config";

export async function GET() {
  return NextResponse.json({
    enabled: isYooKassaConfigured(),
  });
}
