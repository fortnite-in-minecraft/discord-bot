const fs = require("fs");
const net = require("net");
const path = require("path");
const config = require("./config.json");
const channelData = require("./data.json")
const token = config.token;
const Discord = require("discord.js");
const readline = require("readline");

let sockClient, guild, adminLog, pointLog, playerLog, rl;

const client = new Discord.Client();

client.on("ready", () => {
    guild = client.guilds.get(config.guildId);
    adminLog = guild.channels.get(config.channels.adminLog);
    pointLog = guild.channels.get(config.channels.pointLog);
    playerLog = guild.channels.get(config.channels.playerLog);

    rl && rl.close();
    sockClient && sockClient.close();

    sockClient = net.createConnection("socket");
    rl = readline.createInterface({
        input: sockClient,
        terminal: false
    });

    rl.on("line", function(line){
        try{
            line = line.toString();
            const json = JSON.parse(line);
            console.log("parsed json", json);
            const event = json[0];
            const data = json[1];

            let channel;
            switch(channelData.mappings[event].logChannel){
                case "adminLog":
                    channel = adminLog;
                    break;
                case "pointLog":
                    channel = pointLog;
                    break;
                case "playerLog":
                    channel = playerLog;
                    break;
                default:
                    throw new Error("Unrecognized type " + event);
            }

            let message;
            switch(event){
                case "logLine":
                    message = data.line;
                    break;
                case "playerDeath":
                    message = `${data.player.user} ${data.cause}`;
                    break;
                case "playerKill":
                    message = `${data.player.user} eliminated ${data.killer.user} ${data.cause}`;
                    break;
                case "playerDeathDueToOtherPlayer":
                    message = `${data.player.user} eliminated ${data.killer.user} ${data.cause}`;
                    break;
                case "pointChange":
                    message = "";
                    break;
                case "anticheatOffense":
                    message = `${data.player.user} ${data.desc}`;
                    break;
            }

            channel.send({
                "embed": {
                    "title": channelData.mappings[event].desc,
                    "description": message,
                    "url": "https://discordapp.com",
                    "color": 16777215,
                    "timestamp": "2019-06-03T23:57:02.367Z",
                    "footer": {
                        "text": "Raw json payload: " + JSON.stringify(data)
                    },
                    "author": {
                        "name": event
                    }
                }
            });
        }catch (e) {
            console.error(e, line);
        }
    });

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    if (msg.content === "ping") {
        msg.reply("Pong!");
    }
});

client.login(token);
