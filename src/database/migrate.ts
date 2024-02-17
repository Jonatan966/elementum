import "dotenv/config";

import { sql } from "@vercel/postgres";
import { readdir, readFile } from "fs/promises";
import path from "path";

async function migrate() {
  const queryFilenames = await readdir(path.join(__dirname, "migrations"));

  for (const queryFilename of queryFilenames) {
    if (!queryFilename.includes(".sql")) {
      continue;
    }

    console.log("[migrate] executing migration", queryFilename);

    const query = String(
      await readFile(path.join(__dirname, "migrations", queryFilename))
    );

    await sql.query(query);

    console.log("[migrate] migration", queryFilename, "executed!");
  }
}

migrate();
