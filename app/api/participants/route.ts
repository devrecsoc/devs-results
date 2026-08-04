import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Papa from "papaparse";

type ParticipantRow = {
  email?: string;
  name?: string;
};

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "data", "participants.csv");
    const csv = await fs.readFile(csvPath, "utf8");

    const parsed = Papa.parse<ParticipantRow>(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const participants = (parsed.data || [])
      .filter((row) => row.email && row.name)
      .map((row) => ({
        email: String(row.email).trim().toLowerCase(),
        name: String(row.name).trim(),
      }));

    return NextResponse.json({ participants });
  } catch (error) {
    console.error("Failed to load participants CSV", error);
    return NextResponse.json(
      { error: "Unable to load participant data" },
      { status: 500 }
    );
  }
}
