import { Snowflake } from "discord.js";
import { Pool } from "pg";
import dotenv from "dotenv"

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

export async function getLogChannel(guild_id: string|Snowflake) {
    const client = await pool.connect();
    let result = null; 
    try{
        client.query("BEGIN");
        const queryText = "SELECT channel_id from logchannel where guild_id = $1";
        result = await client.query(queryText, [guild_id]);
    } catch(error) {
        console.log("Error in DB while getting LogChannel");
        console.log(error);
        return;
    } finally {
        client.release();
        return result["rows"][0]["channel_id"];
    }
}
