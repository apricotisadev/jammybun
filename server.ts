import { Bot } from "./src/index";
import dotenv from "dotenv"

dotenv.config();

const bot = new Bot();
bot.start(process.env.DISCORD_TOKEN);
