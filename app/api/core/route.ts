import { NextRequest, NextResponse } from "next/server";
import { getCoreMembers } from "@/lib/participants";

export async function GET(request: NextRequest) {
    try {
        const members = await getCoreMembers();

        const email = request.nextUrl.searchParams
        .get("email")
        ?.trim()
        .toLowerCase();

        if (email) {
            const member = members.find(
                (m) => m.email === email
            );

            if (!member) {
                return NextResponse.json(
                    { error: "Core member not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(member);
        }

        // Listing mode is used to render public rosters (team lobby,
        // results board) — strip email so it never leaves the server for
        // every core member, only for the one a caller explicitly asks for.
        const publicMembers = members.map((m) => ({
            name: m.name,
            regno: m.regno,
            team: m.team,
            role: m.role,
        }));
        return NextResponse.json(publicMembers);
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { error: "Unable to read CSV" },
            { status: 500 }
        );
    }
}
