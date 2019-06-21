const fs = require("fs");
const Tail = require("tail").Tail;
const config = require("./config.json");
const channelData = require("./data.json")
const token = config.token;
const Discord = require("discord.js");

let guild, adminLog, pointLog, playerLog, tail;

const client = new Discord.Client();


client.on("ready", () => {

    fs.writeFileSync(config.filePath || process.argv[2] || "socket", "");
    guild = client.guilds.get(config.guildId);
    adminLog = guild.channels.get(config.channels.adminLog);
    pointLog = guild.channels.get(config.channels.pointLog);
    playerLog = guild.channels.get(config.channels.playerLog);

    tail && tail.unwatch();
    tail = new Tail(config.filePath || process.argv[2] || "socket");

    tail.on("line", function(line){
        try{
            console.log("got line " + line);
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
            let fields;
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
                case "pointChange":
                    message = `${data.player.user} went from ${data.oldPointValue} points to ${data.newPointValue} points due to ${data.cause}`;
                    break;
                case "roundInfo":
                    message = `Round #${data.roundNumber}${data.event}`;
                    break;
                case "startGame":
                    message = ``;
                    break;
                case "endGame":
                    message = `Final scoreboard`;
                    fields = data.scoreData.reduce((acc, arr) => {
                        acc.push({
                            name: arr[0],
                            value: arr[1].toString(),
                            inline: true
                        });
                        return acc;
                    }, []);
            }

            channel.send({
                "embed": {
                    "title": channelData.mappings[event].desc,
                    "description": message,
                    "url": "https://discordapp.com",
                    "color": channelData.mappings[event].color,
                    "timestamp": "2019-06-03T23:57:02.367Z",
                    "footer": {
                        "text": "Raw json payload: " + JSON.stringify(data)
                    },
                    "author": {
                        "name": event
                    },
                    "fields": fields
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
