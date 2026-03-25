const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const rootDir = path.join(__dirname, "..");
const envPath = path.join(rootDir, ".env");
const sqlPath = path.join(rootDir, "prisma", "postgres-init.sql");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) {
      continue;
    }

    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    const rawValue = line.slice(equalsIndex + 1).trim();
    const value = rawValue.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvFile(envPath);

  const connectionStrings = [
    process.env.DIRECT_URL,
    process.env.DATABASE_URL
  ].filter(Boolean);

  if (connectionStrings.length === 0) {
    throw new Error("DIRECT_URL o DATABASE_URL mancante.");
  }

  if (!fs.existsSync(sqlPath)) {
    throw new Error(`File SQL non trovato: ${sqlPath}`);
  }

  const sql = fs.readFileSync(sqlPath, "utf8");
  let lastError = null;

  for (const connectionString of connectionStrings) {
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      await client.query(sql);
      console.log("Schema Postgres applicato con successo.");
      await client.end();
      return;
    } catch (error) {
      lastError = error;
      console.error(`Connessione fallita per ${new URL(connectionString).host}: ${error.message}`);
      try {
        await client.end();
      } catch {
        // Ignore close failures after failed connect/query.
      }
    }
  }

  throw lastError;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
