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

        return NextResponse.json(members);
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { error: "Unable to read CSV" },
            { status: 500 }
        );
    }
}
