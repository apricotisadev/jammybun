import { Bot } from "./src/index";
import dotenv from "dotenv"
import express from "express"

dotenv.config();

const app = express();
const port = process.env.PORT;


app.get("/", (req: express.Request, res: express.Response) => {
    res.send("<html><body><h1>A Discord Bot</h1></body></html>");
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    const bot = new Bot();
    bot.start(process.env.DISCORD_TOKEN);
})

