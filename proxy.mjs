import fetch from "node-fetch";
import { HttpProxyAgent } from 'http-proxy-agent';
import fs from "fs";
import chalk from "chalk";

class Proxy {
    async proxyList() {
        return new Promise((resolve, reject) => {
            fetch(`https://fecoretech.com/proxy.php`, {
                method: "GET"
            }).then(result => {
                resolve(result.text());
            }).catch(error => {
                reject(error);
            });
        });
    }

    async checkProxy(agent) {
        let agentProxy = new HttpProxyAgent(agent);
        const controller = new AbortController();
        return new Promise((resolve, reject) => {
            fetch(`https://api.myip.com`, {
                method: "GET",
                agent: agentProxy,
                signal: AbortSignal.timeout(2000),
            }).then(result => {
                if (result.status != 200) {
                    return {
                        status: "DIE"
                    };
                } else {
                    return result.json();
                }
            }).then(json => {
                resolve(json);
            }).catch(error => {
                if (error.name === 'AbortError') {
                    resolve({
                        status: "DIE",
                        message: "Request timed out"
                    });
                } else {
                    resolve({
                        status: "DIE",
                        message: error.message
                    });
                }
            });
        });
    }
}

(async () => {
    console.log(`
░░░░░░░░░░░░░░░███████████████░░░░░░░░░░
░░░░░░░░░░░█████░░░░░░░░░░░░░████░░░░░░░
░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░█░░░░░░
░░░░░░███░░░░░░░░░░░░░░░░░░░░░░░░░█░░░░░
░░░░░██░░░░▄██░░░░░░░░░░░░░░░░░░░░█░░░░░
░░░░██░░░▄█████░░░░░░░░░█████░░░░░█░░░░░
░░░░█░░░░██▀░▀█▌░░░░░░████▀██▌░░░░█░░░░░
░░░░█░░░░█▌░░░█▌░░▄░░░██▀░░▐█▌░░░░█░░░░░
░░░░█░░░░██████░░░█▌░░██▄░▄██░░░░░█░░░░░
░░░░█░░░░▀▀▀▀▀▀░░░█▌░░███████░░░░░█░░░░░
░░░░█░░░░░░░░░░░░░█▌░░░░▀▀▀░░░░░░█░░░░░░
░░░░██░░░░░░░▄░░░░▀░░░░░░░░░░░░░░█░░░░░░
░░░░░█░░░░░░▐██▄▄░░░▄▄██░░░░░░░██░░░░░░░
░░░░░░██░░░░░███████████░░░░░░██░░░░░░░░
░░░░░░░███░░░░░░░▀▀▀▀░░░░░░░███░░░░░░░░░
░░░░░░░░░████░░░░░░░░░░░█████░░░░░░░░░░░
░░░░░░░░░░░░████████████░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`);

console.log(`#######  ######    #####   ##   ##  ### ###  
###  ##  ### ###  ### ###  ##   ##  ### ###  
###      ### ###  ### ###  ### ###  ### ###  
#####    ######   ### ###   #####    #####   
###      ### ##   ### ###  ### ###    ###    
###      ### ###  ### ###  ##   ##    ###    
###      ### ###   #####   ##   ##    ###    
                                             
`);
    const proxy = new Proxy();    
    let listIpPort = await proxy.proxyList();
    let splitData = listIpPort.split("\n");
    for (let index = 0; index < splitData.length; index++) {
        const element = splitData[index];
        try {
            let check = await proxy.checkProxy(element);
                if(!check.hasOwnProperty("status")){
                    console.log(`[${chalk.greenBright("LIVE")}] [${chalk.cyanBright(check.cc)}] ${element}`);
                    fs.appendFileSync("live.txt", element+"\n", {flag: "a+"});
                }else{
                    console.log(`[${chalk.redBright("DIE")}] ${element}`);
                }
        } catch (e) {
            continue;
        }
    }
})();
