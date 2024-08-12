'use server'

import { db } from "@/lib/db"
import { channel } from "diagnostics_channel"

export const onDiscordConnect = async(
    channel_id : string,
    webhook_id : string,
    webhook_name : string,
    webhook_url : string,
    id : string,
    guild_name : string,
    guild_id : string,
) =>{
    if(webhook_id){
        const webhook = await db.discordWebhook.findFirst({
            where : {
                userId : id,
            },
            include : {
                connections : {
                    select : {
                        type  : true
                    },
                },
            },

        })
        if(!webhook){
            await db.discordWebhook.create({
                data : {
                    userId : id,
                    webhookId : webhook_id,
                    channelId : channel_id!,
                    guildId : guild_id!,
                    name : webhook_name!,
                    url : webhook_url!,
                    guildName : guild_name!,
                    connections : {
                        create :{
                            userId : id,
                            type : 'Discord',
                        },
                    },
                },
            })
        }
    }
}