const fs = require("fs");
const readline = require("readline");

[["logLine",{"line":"Can’t keep up! Did the system time change, or is the server overloaded?"}],["playerDeath",{"player":{"user":"User1234","uid":"f8cadb8eb73b8a7ecb8f3a87..."},"cause":"hit the ground too hard"}],["playerKill",{"player":{"user":"User1234","uid":"f8cadb8eb73b8a7ecb8f3a87..."},"killer":{"user":"User4321","uid":"ae8f76c5f4ea874..."},"cause":"using [THE PUNISHER]"}],["pointChange", {player: {user: "User1234", uid: "f8cadb8eb73b8a7ecb8f3a87..."}, oldPointValue: 10, newPointValue: 20, cause: "a kill"}],["anticheatOffense",{"player":{"user":"User1234","uid":"f8cadb8eb73b8a7ecb8f3a87..."},"desc":"moved too quickly"}]].forEach(x => {
    fs.appendFileSync(process.argv[2] || "socket", JSON.stringify(x) + "\n");
});