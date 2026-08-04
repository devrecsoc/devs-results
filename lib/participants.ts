import { promises as fs } from "fs";
import path from "path";
import Papa from "papaparse";

export type Participant = {
  email: string;
  name: string;
  team: string;
  regno: string;
};

type ParticipantRow = {
  email?: string;
  name?: string;
  team?: string;
  regno?: string;
};

export async function getParticipants(): Promise<Participant[]> {
  const csvPath = path.join(process.cwd(), "data", "participants.csv");
  const csv = await fs.readFile(csvPath, "utf8");

  const parsed = Papa.parse<ParticipantRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data
    .filter((row) => row.email && row.name && row.regno && row.team)
    .map((row) => ({
      email: row.email!.trim().toLowerCase(),
      name: row.name!.trim(),
      team: row.team!.trim(),
      regno: row.regno!.trim(),
    }));
}
