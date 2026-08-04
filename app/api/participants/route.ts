import { promises as fs } from "fs";
import path from "path";
import Papa from "papaparse";
import { NextRequest, NextResponse } from "next/server";

type ParticipantRow = {
    email?: string;
    name?: string;
    team?: string;
    regno?: string;
};

export async function GET(request: NextRequest) {
    try {
        const csvPath = path.join(
            process.cwd(),
            "data",
            "participants.csv"
        );

        const csv = await fs.readFile(csvPath, "utf8");

        const parsed = Papa.parse<ParticipantRow>(csv, {
            header: true,
            skipEmptyLines: true,
        });

        const participants = parsed.data
        .filter((row) => row.email && row.name && row.regno && row.team)
        .map((row) => ({
            email: row.email!.trim().toLowerCase(),
            name: row.name!.trim(),
            team: row.team!.trim(),
            regno: row.regno!.trim(),
        }));

        const email = request.nextUrl.searchParams
        .get("email")
        ?.trim()
        .toLowerCase();

        if (email) {
            const participant = participants.find(
                (p) => p.email === email
            );

            if (!participant) {
                return NextResponse.json(
                    { error: "Participant not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(participant);
        }

        return NextResponse.json(participants);
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { error: "Unable to read CSV" },
            { status: 500 }
        );
    }
}
