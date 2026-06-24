import Database from 'better-sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { Database as BetterSqliteDatabase } from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db: BetterSqliteDatabase = new Database(join(__dirname, '../', 'db/userBindings.sqlite'));

// Initialise the database table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS userBindings (
        dcUserId TEXT PRIMARY KEY,
        abUserId TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

export function bindUser(dcUserId: string, abUserId: string): void {
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO userBindings (dcUserId, abUserId)
        VALUES (?, ?)
    `);
    stmt.run(dcUserId, abUserId);
}

export function getBindingByDiscordId(dcUserId: string): string | null {
    const stmt = db.prepare('SELECT abUserId FROM userBindings WHERE dcUserId = ?');
    const result = stmt.get(dcUserId) as { abUserId: string } | undefined;
    return result?.abUserId ?? null;
}

export function getBindingByAcidBotId(abUserId: string): string | null {
    const stmt = db.prepare('SELECT dcUserId FROM userBindings WHERE abUserId = ?');
    const result = stmt.get(abUserId) as { dcUserId: string } | undefined;
    return result?.dcUserId ?? null;
}

export default db;


