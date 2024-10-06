import { Interaction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("throw")
    .setDescription("Trigger an error")

export async function execute(interaction: Interaction){
    if (!interaction.isChatInputCommand()) return;
    await interaction.reply({content: "An exception has been dispatched."});
    setTimeout( ()=>{throw new Error("ThrowCommandException");},5000);
}
