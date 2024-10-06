import { Bot } from "./src/index";
import dotenv from "dotenv"
import express, { NextFunction, Request } from "express"
import reportShutdown from "./src/utils/reportShutdown.ts";

dotenv.config();

const app = express();
const port = process.env.PORT;


app.get("/", (req: express.Request, res: express.Response) => {
    res.send("<html><body><h1>A Discord Bot</h1></body></html>");
})

let bot: Bot = null;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    bot = new Bot();
    bot.start(process.env.DISCORD_TOKEN);
});

process.on('uncaughtException', (err) => {
    console.error("Uncaught Exception in the Process");
    console.error('Error Name:', err.name);   // Log the name of the error
    console.error('Error Message:', err.message); // Log the error message
    if (bot && bot.hasClient() ) bot.stop();
    reportShutdown(err);
});
