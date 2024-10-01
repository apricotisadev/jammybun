import { Client, EmbedBuilder, Events, GatewayIntentBits, GuildMember, Partials, SlashCommandBuilder } from "discord.js";
import { updateSlashCommands } from "./utils/commandRegister";
import { getLogChannel } from "./utils/db/getFuncs";

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
        this.onMemberJoin();
    }

    private onReady() {
        this.client.on(Events.ClientReady, () => {
            console.log(`Logged in as ${this.client.user.username}`);
        })
    }

    private onMemberJoin(){
        this.client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
            let channelId: string = await getLogChannel(member.guild.id);
            if (channelId){
                const logEmbed = new EmbedBuilder()
                        .setTitle("New Member Joined")
                        .setThumbnail(member.user.avatarURL())
                        .setColor(0x7289da)
                        .setFields([
                            {name: "User", value: `<@${member.user.id}>`},
                            {name: "Created At", value: `<t:${Math.floor(member.user.createdTimestamp/1000)}:D>`},
                            {name: "Joined At", value: `<t:${Math.floor(member.joinedTimestamp/1000)}:D>`}
                        ])

                const channel: any = await member.guild.channels.fetch(channelId);
                channel.send({ 
                    embeds: [logEmbed]               
                })
            }
        })
    }

    private onMemberLeave() {

        
    }

    public getClient() {
        return this.client;
    }
    
    public start (token: string){
        this.client.login(token);
    }
}
