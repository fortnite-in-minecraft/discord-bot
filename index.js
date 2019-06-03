const fs = require("fs");
const net = require("net");
const path = require("path");
const config = require("./config.json");
const token = config.token;
const Discord = require("discord.js");

let sockClient, guild, adminLog, pointLog, playerLog;

const client = new Discord.Client();

client.on("ready", () => {
    guild = client.guilds.get(config.guildId);
    adminLog = guild.channels.get(config.channels.adminLog);
    pointLog = guild.channels.get(config.channels.pointLog);
    playerLog = guild.channels.get(config.channels.playerLog);

    sockClient && sockClient.close();
    sockClient = net.createConnection("socket");


    sockClient.on("data", function(line){
        try{
            const json = JSON.parse(line);
            console.log("parsed json", json);
            const event = eventList[0];
            const data = eventList[1];
            switch(event){
                case "logLine":
                    playerLog.send(data.line);
            }
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
