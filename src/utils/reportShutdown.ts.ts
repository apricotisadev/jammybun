import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { WebhookClient } from "discord.js";

export default async function reportShutdown(err: Error){
    const webhc: WebhookClient = new WebhookClient({url: process.env.WEBHOOK_URL});
    webhc.send({
        content: `The Bot has been shut down due to errors.\n### Error Log\n\`\`\`${err.name}\n${err.message}\n\nStack:\n${err.stack}\`\`\``
    })


    const snsClient = new SNSClient({region: "ap-south-1",});
    const subject = "Jammybun is Down"
    const message = "Jammybun bot has crashed due to errors in runtime. Please review the discord for more details."
    
    try{
        const command = new PublishCommand({
            Message: message,
            Subject: subject,
            PhoneNumber: process.env.SMSNUMBER,
            MessageAttributes: {
                "AWS.SNS.SMS.SMSType": {
                    DataType: "String",
                    StringValue: "Transactional"
                },
                "AWS.SNS.SMS.SenderID": {
                    DataType: "String",
                    StringValue: "Jammy-Bun"

                },
                "Priority": {
                    DataType: "Number",
                    StringValue: "1"
                }
            }
        })
        await snsClient.send(command);
    } catch (err){
        console.error("Error sending message",err);
    }

}
