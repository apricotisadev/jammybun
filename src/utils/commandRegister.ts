import { BaseInteraction, Client, CommandInteraction, Events, REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import {Bot} from "../index"

interface ApplicationCommandDesc {
  name: string;
  description: string;
}

export const setCommands = (bot: Bot) => {
  bot.commands = [];
  bot.commandExec = [];
  const commandsPath = path.join(__dirname, "../commands");

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: any) => file.endsWith((__filename.endsWith(".js"))?".js":".ts")); // Typescript build or Javascript
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      bot.commands.push(command.data.toJSON());
      bot.commandExec.push(command.execute);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
  registerCommands(bot.commands);
};

const registerCommands = (commands: Array<any>) => {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
  (async () => {
    try {
      // The put method is used to fully refresh all commands globally with the current set
      const data: any = await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
        body: commands,
      });
      console.log(
        `Successfully reloaded ${data.length!} application (/) commands.`,
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
};

export function updateSlashCommands(bot: Bot) {
        setCommands(bot);
        bot.getClient().on(
            Events.InteractionCreate,
            async (interaction: CommandInteraction | BaseInteraction) => {
                if (!interaction.isCommand()) return;
                let command: any = null;
                (bot).commands.forEach(
                    (obj: any, index: number) => {
                        if (obj.name === interaction.commandName && !command) {
                            command = obj;
                            command.execute = (
                                bot
                            ).commandExec[index];
                            return;
                        }
                    },
                );

                if (!command) {
                    console.error(
                        `No command matching ${interaction.commandName} was found.`,
                    );
                    return;
                }

                try {
                    await command.execute(interaction);
                } catch (error) {
                    console.error(error);
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({
                            content: "There was an error while executing bot command!",
                                ephemeral: true,
                        });
                    } else {
                        await interaction.reply({
                            content: "There was an error while executing bot command!",
                                ephemeral: true,
                        });
                    }
                }
            },
        );
    }


