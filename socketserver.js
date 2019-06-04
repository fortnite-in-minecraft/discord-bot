const net = require("net");
const fs = require("fs");
const readline = require("readline");
let rl;


try{
    fs.unlinkSync("socket");
}catch(e){}

const unixServer = net.createServer(function(client) {
    rl && rl.close();
    [["logLine",{"line":"Can’t keep up! Did the system time change, or is the server overloaded?"}],["playerDeath",{"player":{"user":"User1234","uid":"f8cadb8eb73b8a7ecb8f3a87..."},"cause":"hit the ground too hard"}],["playerKill",{"player":{"user":"User1234","uid":"f8cadb8eb73b8a7ecb8f3a87..."},"killer":{"user":"User4321","uid":"ae8f76c5f4ea874..."},"cause":"using [THE PUNISHER]"}],["playerDeathDueToOtherPlayer",{"player":{"user":"User1234","uid":"f8cadb8eb73b8a7ecb8f3a87..."},"killer":{"user":"User4321","uid":"ae8f76c5f4ea874..."},"cause":"burnt to a crisp"}],["pointChange",{"player":{"user":"User1234","uid":"f8cadb8eb73b8a7ecb8f3a87..."},"oldPointValue":10,"newPointValue":20,"cause":{"type":"kill","bonuses":[],"target":{"user":"User4321","uid":"ae8f76c5f4ea874..."}}}],["pointChange",{"player":{"user":"User1234","uid":"f8cadb8eb73b8a7ecb8f3a87..."},"oldPointValue":20,"newPointValue":40,"cause":{"type":"kill","bonuses":[{"desc":"last24h","value":5},{"desc":"topPlayerKill","value":5}],"target":{"user":"User4321","uid":"ae8f76c5f4ea874..."}}}],["anticheatOffense",{"player":{"user":"User1234","uid":"f8cadb8eb73b8a7ecb8f3a87..."},"desc":"moved too quickly"}]].forEach(x => {
        client.write(JSON.stringify(x) + "\n");
    });
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
