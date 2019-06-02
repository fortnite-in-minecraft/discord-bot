const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const token = config.token;
const Discord = require("discord.js");
const readline = require("readline");

let rl, guild, adminLog, pointLog, playerLog;

const client = new Discord.Client();

client.on("ready", () => {
    guild = client.guilds.get(config.guildId);
    adminLog = guild.channels.get(config.channels.adminLog);
    pointLog = guild.channels.get(config.channels.pointLog);
    playerLog = guild.channels.get(config.channels.playerLog);

    rl && rl.close();

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on("line", function(line){
        try{
            const json = JSON.parse(line);
            json.forEach(eventList => {
                const event = eventList[0];
                const data = eventList[1];
                switch(event){
                    case "logLine":
                        playerLog.send(data.line);
                }
            });
        }catch (e) {
            console.error(e);
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