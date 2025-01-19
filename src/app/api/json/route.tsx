import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import * as path from 'path';

export const dynamic = "force-static";

export async function GET(req: any, res: any) {
    const pathJSON = path.join('public/result.json');
    const fileBuffer = await fs.readFile(pathJSON);
    const json = JSON.parse(fileBuffer.toString());
    return NextResponse.json(json) as any;
}
