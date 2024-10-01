import { Client, Events, GatewayIntentBits, Partials, SlashCommandBuilder } from "discord.js";
import { setCommands, updateSlashCommands } from "./utils/commandRegister";

export class Bot {
    public commands: Array<string> = [];
    public commandExec: Array<SlashCommandBuilder> = [];

    private client: Client;

    constructor(){
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages
            ], 
            partials: [
                Partials.Reaction,
                Partials.Message,
                Partials.GuildMember,
                Partials.User,
            ],       
        });
        updateSlashCommands(this)
        this.onReady();
    }

    private onReady() {
        this.client.on(Events.ClientReady, () => {
            console.log(`Logged in as ${this.client.user.username}`);
        })
    }

    public getClient() {
        return this.client;
    }
    
    public start (token: string){
        this.client.login(token);
    }
}
