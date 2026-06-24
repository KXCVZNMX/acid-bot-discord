import type { Interaction } from 'discord.js';

export async function handleInteractionCreate(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing /${interaction.commandName}`, error);

        const reply = {
            content: 'There was an error executing this command!',
            ephemeral: true,
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(reply);
        } else {
            await interaction.reply(reply);
        }
    }
}
