// src/index.ts
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdir } from 'fs/promises';
import { join } from 'path';
import dotenv from "dotenv";
import {fileURLToPath} from "node:url";
import {dirname} from "node:path";
import { handleClientReady } from './events/clientReady.ts';
import { handleInteractionCreate } from './events/interactionCreate.ts';

dotenv.config({path: "./.env"});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

// Load commands
client.commands = new Collection();

async function loadCommands() {
    const commandFiles = await readdir(join(__dirname, 'commands'));
    for (const file of commandFiles) {
        if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
        const command = await import(join(__dirname, 'commands', file));
        client.commands.set(command.data.name, command);
    }
}

client.on('interactionCreate', handleInteractionCreate);
client.once('ready', handleClientReady);

loadCommands().then(() => {
    client.login(process.env.DISCORD_TOKEN);
});
