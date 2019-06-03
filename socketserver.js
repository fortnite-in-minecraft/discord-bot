const net = require("net");
const fs = require("fs");
const readline = require("readline");
let rl;
const unixServer = net.createServer(function(client) {
    rl && rl.close();
    client.write(`["hello", {"A":0}]`);
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on("line", function(line){
        client.write(line);
    });
});
unixServer.listen("socket");

try{
    fs.unlinkSync("socket");
}catch(e){}
