import './settings.js';
import fs from 'fs';
import os from 'os';
import dns from 'dns';
import pino from 'pino';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import cron from 'node-cron';
import readline from 'readline';
import { toBuffer } from 'qrcode';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import NodeCache from 'node-cache';
import { createRequire } from 'module';
import moment from 'moment-timezone';
import { parsePhoneNumber } from 'awesome-phonenumber';
import WAConnection, { useMultiFileAuthState, Browsers, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestWaWebVersion, jidNormalizedUser } from 'baileys';

import { app, server, PORT } from './src/server.js';
import { dataBase, cmdDel, checkStatus } from './src/database.js';
import { assertInstalled, customHttpsAgent } from './lib/function.js';
import { GroupParticipantsUpdate, MessagesUpsert, Solving } from './src/message.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const print = () => {};
const pairingCode = process.argv.includes('--qr') ? false : process.argv.includes('--pairing-code') || global.pairing_code;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const tempDir = path.join(__dirname, 'database/temp');
const time_now = new Date();
const time_end = 60000 - (time_now.getSeconds() * 1000 + time_now.getMilliseconds());
let pairingStarted = false;
let phoneNumber;

try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

global.fetchApi = async (endpoint = '/', data = {}, options = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const apiList = Object.keys(global.APIs);
            if (options.api !== undefined) {
                if (typeof options.api !== 'number' || options.api < 1 || options.api > apiList.length) {
                    return reject(new Error(`[Fetch Error] Parameter { api: ${options.api} } tidak terdaftar. Harap gunakan angka 1 hingga ${apiList.length}.`));
                }
            }
            const apiName = typeof options.api === 'number' ? apiList[options.api - 1] : options.name
            const base = apiName ? (global.APIs[apiName] || apiName) : global.APIs.axly
            const apikey = global.APIKeys[base] || '';
            let method = (options.method || 'GET').toUpperCase()
            let url = base + endpoint 
            let payload = null
            let headers = options.headers || { 'user-agent': 'Mozilla/5.0 (Linux; Android 15)' }
            const isForm = options.form || data instanceof FormData || (data && typeof data.getHeaders === 'function');
            if (isForm) {
                payload = data
                method = 'POST'
                headers = { ...(options.headers?.['Authorization'] ? {} : { apikey }), ...headers, ...data.getHeaders() }
            } else if (method !== 'GET') {
                payload = { ...data, ...(options.headers?.['Authorization'] ? {} : { apikey }) }
                headers['content-type'] = 'application/json'
            } else {
                url += '?' + new URLSearchParams({ ...data, apikey }).toString()
            }
            const res = await axios({
                method, url, data: payload,
                headers, httpsAgent: customHttpsAgent,
                responseType: options.stream ? 'stream' : (options.buffer ? 'arraybuffer' : options.responseType || options.type || 'json'),
            });
            if (options.stream) {
                let ext = options.ext
                if (typeof options.stream !== 'string' && !ext) {
                    const contentDisp = res.headers['content-disposition']
                    const contentType = res.headers['content-type']
                    if (contentDisp && contentDisp.includes('filename=')) {
                        const match = contentDisp.match(/filename="?([^"]+)"?/)
                        if (match && match[1]) {
                            ext = match[1].split('.').pop()
                        }
                    }
                    if (!ext && contentType) {
                        ext = contentType.split('/')[1]?.split(';')[0]
                        if (ext === 'jpeg') ext = 'jpg'
                    }
                    ext = ext || 'tmp'
                }
                let streamPath = typeof options.stream === 'string' ? options.stream : path.join(process.cwd(), 'database/temp', 'temp-' + Date.now() + '.' + ext)
                const writeStream = fs.createWriteStream(streamPath)
                res.data.pipe(writeStream)
                writeStream.on('finish', () => resolve(streamPath))
                writeStream.on('error', reject)
            } else {
                resolve(options.buffer ? Buffer.from(res.data) : res.data)
            }
        } catch (e) {
            reject(e)
        }
    })
}

const storeDB = dataBase(global.tempatStore);
const database = dataBase(global.tempatDB);
const msgRetryCounterCache = new NodeCache();

if (fs.existsSync(tempDir)) {
    fs.readdirSync(tempDir).forEach(file => {
        fs.unlinkSync(path.join(tempDir, file));
    });
} else {
    fs.mkdirSync(tempDir, { recursive: true });
}

assertInstalled(process.platform === 'win32' ? 'where ffmpeg' : 'command -v ffmpeg', 'FFmpeg', 0);
server.listen(PORT, () => {});

async function startaxlyBot() {
    try {
        const loadData = await database.read()
        const storeLoadData = await storeDB.read()
        if (!loadData || Object.keys(loadData).length === 0) {
            global.db = {
                hit: {},
                set: {},
                cmd: {},
                store: {},
                users: {},
                game: {},
                groups: {},
                database: {},
                premium: [],
                sewa: [],
                ...(loadData || {}),
            }
            await database.write(global.db)
        } else {
            global.db = loadData
        }
        if (!storeLoadData || Object.keys(storeLoadData).length === 0) {
            global.store = {
                contacts: {},
                presences: {},
                messages: {},
                groupMetadata: {},
                ...(storeLoadData || {}),
            }
            await storeDB.write(global.store)
        } else {
            global.store = storeLoadData
        }
        
        global.loadMessage = function (remoteJid, id) {
            const messages = store.messages?.[remoteJid]?.array;
            if (!messages) return null;
            return messages.find(msg => msg?.key?.id === id) || null;
        }
        
        if (!global._dbInterval) {
            global._dbInterval = setInterval(async () => {
                if (global.db) await database.write(global.db)
                if (global.store) await storeDB.write(global.store)
            }, 30 * 1000)
        }
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
    
    const level = pino({ level: 'silent' });
    const { version } = await fetchLatestWaWebVersion();
    const { state, saveCreds } = await useMultiFileAuthState('axlydev');
    const getMessage = async (key) => {
        if (global.store) {
            const msg = await global.loadMessage(key.remoteJid, key.id);
            return msg?.message || ''
        }
        return {
            conversation: 'Halo Saya axly Bot'
        }
    }
    
    const axly = WAConnection({
        version,
        logger: level,
        getMessage,
        syncFullHistory: false,
        maxMsgRetryCount: 15,
        msgRetryCounterCache,
        retryRequestDelayMs: 10,
        defaultQueryTimeoutMs: 0,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 15000,
        browser: Browsers.ubuntu('Chrome'),
        generateHighQualityLinkPreview: false,
        markOnlineOnConnect: true,
        shouldSyncHistoryMessage: () => false,
        transactionOpts: {
            maxCommitRetries: 10,
            delayBetweenTriesMs: 10,
        },
        appStateMacVerification: {
            patch: true,
            snapshot: true,
        },
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, level),
        },
    })
    
    if (pairingCode && !phoneNumber && !axly.authState.creds.registered) {
        async function getPhoneNumber() {
            phoneNumber = global.number_bot ? global.number_bot : process.env.BOT_NUMBER || await question('Please type your WhatsApp number : ');
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            if (!parsePhoneNumber('+' + phoneNumber).valid && phoneNumber.length < 6) {
                console.error(chalk.redBright('Start with your Country WhatsApp code, Example : 62xxx'));
                await getPhoneNumber()
            }
        }
        (async () => {
            await getPhoneNumber();
            exec('rm -rf ./axlydev/*');
            console.log(chalk.blue('Phone number captured. Waiting for connection...'));
        })()
    }
    
    await Solving(axly, global.store)
    
    axly.ev.on('creds.update', saveCreds)
    
    axly.ev.on('connection.update', async (update) => {
        const { qr, connection, lastDisconnect, isNewLogin, receivedPendingNotifications } = update;
        
        if ((connection === 'connecting' || !!qr) && pairingCode && phoneNumber && !axly.authState.creds.registered && !pairingStarted) {
            setTimeout(async () => {
                pairingStarted = true;
                let code = await axly.requestPairingCode(phoneNumber);
                console.log(chalk.blue('Your Pairing Code :'), chalk.green(code), chalk.yellow('(expires in 15 sec)'));
            }, 3000)
        }
        
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            const errorMessage = lastDisconnect?.error?.message || '';
            
            // Deteksi session error
            if (errorMessage.includes('session') || errorMessage.includes('entry') || errorMessage.includes('old session')) {
                console.log(chalk.yellow('[SESSION] Session error detected, cleaning and reconnecting...'));
                if (global._aggressiveKeepAlive) clearInterval(global._aggressiveKeepAlive);
                if (global._wsPing) clearInterval(global._wsPing);
                setTimeout(() => { startaxlyBot(); }, 3000);
                return;
            }
            
            if (reason === DisconnectReason.connectionLost ||
                reason === DisconnectReason.connectionClosed ||
                reason === DisconnectReason.restartRequired ||
                reason === DisconnectReason.timedOut ||
                reason === DisconnectReason.badSession) {
                console.log(chalk.yellow('Connection lost, restarting...'));
                startaxlyBot()
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.red('Logged out, delete session and scan again.'));
                exec('rm -rf ./axlydev/*')
                process.exit(0)
            } else if (reason === DisconnectReason.forbidden) {
                console.log(chalk.red('Connection Failure, scan again.'));
                exec('rm -rf ./axlydev/*')
                process.exit(1)
            } else if (reason === DisconnectReason.multideviceMismatch) {
                console.log(chalk.red('Scan again.'));
                exec('rm -rf ./axlydev/*')
                process.exit(0)
            } else if (reason !== DisconnectReason.connectionReplaced) {
                axly.end(`Unknown DisconnectReason : ${reason}|${connection}`)
            }
        }
        
        if (connection == 'open') {
            console.clear();
            console.log(chalk.green('[SUCCESS] Bot successfully connected!'));
            let botNumber = await axly.decodeJid(axly.user.id);
            
            // ========== KEEPALIVE AGRESIF ==========
            if (global._aggressiveKeepAlive) clearInterval(global._aggressiveKeepAlive);
            if (global._wsPing) clearInterval(global._wsPing);
            
            global._aggressiveKeepAlive = setInterval(async () => {
                try {
                    if (axly?.ws?.readyState === 1) {
                        await axly.sendPresenceUpdate('available', botNumber);
                        await axly.query({
                            tag: 'iq',
                            attrs: { to: 's.whatsapp.net', type: 'get', xmlns: 'w:sync:app:state' }
                        }).catch(() => {});
                    }
                } catch (e) {}
            }, 25000);
            
            global._wsPing = setInterval(() => {
                try {
                    if (axly?.ws?.readyState === 1) axly?.ws?.ping();
                } catch (e) {}
            }, 40000);
            // ========== END KEEPALIVE ==========
            
            if (global.db?.set[botNumber] && !global.db?.set[botNumber]?.join) {
                if (my.ch && my.ch.length > 0 && my.ch.includes('@newsletter')) {
                    if (my.ch) await axly.newsletterMsg(my.ch, { type: 'follow' }).catch(e => {})
                    db.set[botNumber].join = true
                }
            }
        }
        
        if (qr && !pairingCode) {
            qrcode.generate(qr, { small: true })
            app.use('/qr', async (req, res) => {
                res.setHeader('content-type', 'image/png')
                res.end(await toBuffer(qr))
            });
        }
        
        if (isNewLogin) console.log(chalk.green('[INFO] New device login detected...'))
        if (receivedPendingNotifications == 'true') {
            console.log(chalk.green('[INFO] Please wait about 1 minute...'))
            axly.ev.flush()
        }
    });
    
    axly.ev.on('call', async (call) => {
        let botNumber = await axly.decodeJid(axly.user.id);
        if (global.db?.set[botNumber]?.anticall) {
            for (let id of call) {
                if (id.status === 'offer') {
                    let msg = await axly.sendMessage(id.from, { text: `Saat Ini, Kami Tidak Dapat Menerima Panggilan ${id.isVideo ? 'Video' : 'Suara'}.\nJika @${id.from.split('@')[0]} Memerlukan Bantuan, Silakan Hubungi Owner :)`, mentions: [id.from]});
                    await axly.sendContact(id.from, global.owner, msg);
                    await axly.rejectCall(id.id, id.from)
                }
            }
        }
    });
    
    axly.ev.on('messages.upsert', async (message) => {
        await MessagesUpsert(axly, message, global.store);
    });
    
    axly.ev.on('group-participants.update', async (update) => {
        await GroupParticipantsUpdate(axly, update, global.store);
    });
    
    axly.ev.on('groups.update', (update) => {
        for (const n of update) {
            if (global.store.groupMetadata[n.id]) {
                Object.assign(global.store.groupMetadata[n.id], n);
            } else global.store.groupMetadata[n.id] = n;
        }
    });
    
    axly.ev.on('presence.update', (update) => {
        const { id, presences } = update;
        store.presences[id] = global.store.presences?.[id] || {};
        Object.assign(global.store.presences[id], presences);
    });
    
    cron.schedule('00 00 * * *', async () => {
        cmdDel(global.db.hit);
        let user = Object.keys(global.db.users)
        let botNumber = await axly.decodeJid(axly.user.id);
        for (let jid of user) {
            const limitUser = global.db.users[jid].vip ? global.limit.vip : checkStatus(jid, global.db.premium) ? global.limit.premium : global.limit.free
            if (global.db.users[jid].limit < limitUser) global.db.users[jid].limit = limitUser
        }
        if (global.db?.set[botNumber].autobackup) {
            let datanya = './database/' + global.tempatDB;
            if (global.tempatDB.startsWith('mongodb')) {
                datanya = './database/backup_database.json';
                fs.writeFileSync(datanya, JSON.stringify(global.db, null, 2), 'utf-8');
            }
            for (let o of ownerNumber) {
                try {
                    await axly.sendMessage(o, { document: fs.readFileSync(datanya), mimetype: 'application/json', fileName: new Date().toISOString().replace(/[:.]/g, '-') + '_database.json' })
                } catch (e) {}
            }
        }
    }, {
        scheduled: true,
        timezone: global.timezone
    });
    
    if (!global.intervalSholat) global.intervalSholat = null;
    if (!global.waktusholat) global.waktusholat = {};
    if (global.intervalSholat) clearInterval(global.intervalSholat); 
    setTimeout(() => {
        global.intervalSholat = setInterval(async() => {
            const sekarang = moment.tz(global.timezone);
            const jamSholat = sekarang.format('HH:mm');
            const hariIni = sekarang.format('YYYY-MM-DD');
            const detik = sekarang.format('ss');
            if (detik !== '00') return;
            for (const [sholat, waktu] of Object.entries(global.jadwalSholat)) {
                if (jamSholat === waktu && global.waktusholat[sholat] !== hariIni) {
                    global.waktusholat[sholat] = hariIni
                    for (const [idnya, settings] of Object.entries(global.db.groups)) {
                        if (settings.waktusholat) {
                            await axly.sendMessage(idnya, { text: `Waktu *${sholat}* telah tiba, ambilah air wudhu dan segeralah shalat🙂.\n\n*${waktu.slice(0, 5)}*\n_untuk wilayah ${global.timezone} dan sekitarnya._` }, { ephemeralExpiration: store?.messages[idnya]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 }).catch(e => {})
                        }
                    }
                }
            }
        }, 60000)
    }, time_end);
    
    if (!global._dbPresence) {
        global._dbPresence = setInterval(async () => {
            if (axly?.user?.id) await axly.sendPresenceUpdate('available', axly.decodeJid(axly.user.id)).catch(e => {})
        }, 10 * 60 * 1000);
    }

    return axly
}

startaxlyBot()

const cleanup = async (signal) => {
    if (global._aggressiveKeepAlive) clearInterval(global._aggressiveKeepAlive);
    if (global._wsPing) clearInterval(global._wsPing);
    if (global._dbInterval) clearInterval(global._dbInterval);
    if (global._dbPresence) clearInterval(global._dbPresence);
    if (global.db) await database.write(global.db);
    if (global.store) await storeDB.write(global.store);
    server.close(() => {
        process.exit(0);
    })
}

process.on('SIGINT', () => cleanup('SIGINT'))
process.on('SIGTERM', () => cleanup('SIGTERM'))
process.on('exit', () => cleanup('exit'))

server.on('error', (error) => {
    if (error.code !== 'EADDRINUSE') console.error(chalk.redBright(`[ERROR] ${error}`));
});

setInterval(() => {}, 1000 * 60 * 10);