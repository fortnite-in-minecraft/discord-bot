const net = require("net");
const fs = require("fs");
const readline = require("readline");
const unixServer = net.createServer(function(client) {
    client.write(`["hello", {"A":0}]`);
});
unixServer.listen("socket");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on("line", function(line){
    client.write(line);
});

try{
    fs.unlinkSync("socket");
}catch(e){}
