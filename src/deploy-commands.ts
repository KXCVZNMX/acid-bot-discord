// src/deploy-commands.ts
import { REST, Routes } from 'discord.js';
import { readdir } from 'fs/promises';
import { join } from 'path';
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";
import dotenv from 'dotenv';

dotenv.config({path: "./.env"});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];
const commandFiles = await readdir(join(__dirname, 'commands'));

for (const file of commandFiles) {
    if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
    const command = await import(join(__dirname, 'commands', file));
    commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

// Deploy to a specific guild (instant, for development)
await rest.put(
    Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID!,
        process.env.DISCORD_GUILD_ID!
    ),
    { body: commands }
);

console.log(`Deployed ${commands.length} commands`);