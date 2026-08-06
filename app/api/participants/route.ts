import { NextRequest, NextResponse } from "next/server";
import { getParticipants } from "@/lib/participants";

export async function GET(request: NextRequest) {
    try {
        const participants = await getParticipants();

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

        // Listing mode is used to render public rosters (team lobby,
        // results board) — strip email so it never leaves the server for
        // every participant, only for the one a caller explicitly asks for.
        const publicParticipants = participants.map((p) => ({
            name: p.name,
            team: p.team,
            regno: p.regno,
            role: p.role,
        }));
        return NextResponse.json(publicParticipants);
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { error: "Unable to read CSV" },
            { status: 500 }
        );
    }
}
