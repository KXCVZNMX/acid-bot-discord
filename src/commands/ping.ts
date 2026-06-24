import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with bot latency.')
    .addStringOption((option) =>
        option
            .setName('message')
            .setDescription('Optional text to include in the reply.')
            .setMaxLength(120)
            .setRequired(false),
    )
    .addIntegerOption((option) =>
        option
            .setName('repeat')
            .setDescription('How many pong lines to send.')
            .setMinValue(1)
            .setMaxValue(5)
            .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const message = interaction.options.getString('message') ?? 'Pong';
    const repeat = interaction.options.getInteger('repeat') ?? 1;
    const latency = interaction.client.ws.ping;
    const lines = Array.from({ length: repeat }, () => `${message}: ${latency}ms`);

    await interaction.reply({
        content: lines.join('\n'),
    });
}
