import { promises as fs } from "fs";
import path from "path";
import Papa from "papaparse";

export type Participant = {
  email: string;
  name: string;
  team: string;
  regno: string;
  role?: string;
};

type ParticipantRow = {
  email?: string;
  name?: string;
  team?: string;
  roll_number?: string;
  role?: string;
};

export async function getParticipants(): Promise<Participant[]> {
  const csvPath = path.join(process.cwd(), "data", "participants.csv");
  const csv = await fs.readFile(csvPath, "utf8");

  const parsed = Papa.parse<ParticipantRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data
    .filter((row) => row.email && row.name && row.roll_number && row.team)
    .map((row) => ({
      email: row.email!.trim().toLowerCase(),
      name: row.name!.trim(),
      team: row.team!.trim(),
      regno: row.roll_number!.trim(),
      role: row.role?.trim() || undefined,
    }));
}

export type CoreMember = {
  email: string;
  name: string;
  regno: string;
  team: string;
  role: string;
};

type CoreRow = {
  email?: string;
  name?: string;
  roll_number?: string;
  team?: string;
  role?: string;
};

export async function getCoreMembers(): Promise<CoreMember[]> {
  const csvPath = path.join(process.cwd(), "data", "core.csv");
  const csv = await fs.readFile(csvPath, "utf8");

  const parsed = Papa.parse<CoreRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data
    .filter((row) => row.email && row.name)
    .map((row) => ({
      email: row.email!.trim().toLowerCase(),
      name: row.name!.trim(),
      regno: row.roll_number?.trim() || "",
      team: row.team?.trim() || "",
      role: row.role?.trim() || "",
    }));
}
