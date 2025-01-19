import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import {NextApiResponse} from "next";
import * as path from 'path';

export async function GET(req: NextRequest, res: NextApiResponse<any>) {
    const pathJSON = path.join('public/result.json');
    const fileBuffer = await fs.readFile(pathJSON);
    const json = JSON.parse(fileBuffer.toString());
    return NextResponse.json(json);
}
