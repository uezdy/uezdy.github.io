import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";

export default async function GET(req: NextRequest) {
    const path = "./src/app/api/json/result.json";
    const fileBuffer = await fs.readFile(path);
    const json = JSON.parse(fileBuffer.toString());
    return NextResponse.json(json);
}
