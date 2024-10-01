import { Interaction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Testing...")

export async function execute(interaction: Interaction){
    if (!interaction.isChatInputCommand()) return;
    await interaction.reply({content: "Pong!"});
}
