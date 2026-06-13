process.once('uncaughtException', console.error)
process.once('unhandledRejection', console.error)

import webpToVideo from './lib/webpToVideo.js'
import './settings.js';
import fs from 'fs';
import { ytmp4 as ytmp4Scraper } from './lib/ytdl.js';
import os from 'os';
import sharp from 'sharp'
import util from 'util';
import path from 'path';
import axios from 'axios';
import { Button, ButtonV2, Carousel, AIRich } from './lib/nixcode.js';
import chalk from 'chalk';
import yts from 'yt-search';
import fetch from 'node-fetch';
import FileType from 'file-type';
import { Chess } from 'chess.js';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import webp from 'node-webpmux';
import { createRequire } from 'module';
import speed from 'performance-now';
import moment from 'moment-timezone';
import { performance } from 'perf_hooks';
import PhoneNum from 'awesome-phonenumber';
import { exec, spawn, execSync } from 'child_process';
import { generateWAMessageContent, jidNormalizedUser, getContentType } from 'baileys';
import 'moment/min/locales.js';
import { UguuSe } from './lib/uploader.js';
import TicTacToe from './lib/tictactoe.js';
import { antiSpam } from './src/antispam.js';
import templateMenu from './lib/template_menu.js';
import { toAudio, toPTT, toVideo } from './lib/converter.js';
import { GroupUpdate, LoadDataBase } from './src/message.js';
import { JadiBot, StopJadiBot, ListJadiBot } from './src/jadibot.js';
import { cmdAdd, cmdAddHit, addExpired, getPosition, getExpired, getStatus, checkStatus, getAllExpired, checkExpired } from './src/database.js';
import { rdGame, iGame, tGame, gameSlot, gameCasinoSolo, gameSamgongSolo, gameMerampok, gameBegal, daily, buy, setLimit, addLimit, addMoney, setMoney, transfer, Blackjack, SnakeLadder } from './lib/game.js';
import { getRandom, getBuffer, fetchJson, runtime, clockString, sleep, isUrl, formatDate, formatp, generateProfilePicture, errorCache, normalize, runUpdate, updateSettings, parseMention, fixBytes, similarity, pickRandom, encodeToLetters, tarBackup } from './lib/function.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locales = moment.locales();
const timez = moment.tz.names();
const menfesTimeouts = new Map();
const settingsPath = path.join(__dirname, 'settings.js');

const fileContent = fs.readFileSync(__filename, 'utf-8');
const casesArray = [...fileContent.matchAll(/case\s+['"]([^'"]+)['"]/g)].map(match => match[1]);

/**
 * Download worker CDN URL (worker03.com, iamworker.com, dst.)
 *
 * Worker URL TIDAK langsung berisi file - dia return JSON dulu:
 *   { status: "completed", fileUrl: "https://dl.iamworker.com/...", fileSizeBytes: ... }
 * Baru dari fileUrl itulah kita download file aslinya.
 *
 * Return: Buffer | null
 */
 // Fungsi untuk handle reply angka episode

async function _dlWorker(url, timeoutMs = 120000) {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    try {
        // Langkah 1: GET worker URL -> dapat JSON { fileUrl, viewUrl, ... }
        const meta = await axios.get(url, {
            timeout: 30000,
            headers: { 'User-Agent': ua, 'Accept': 'application/json, */*' }
        });
        const json = meta.data;
        // Ambil fileUrl dari JSON
        const fileUrl = json?.fileUrl || json?.viewUrl || null;
        if (!fileUrl) return null;
        // Langkah 2: Download dari fileUrl -> file asli (video/audio)
        const resp = await axios.get(fileUrl, {
            responseType: 'arraybuffer',
            timeout: timeoutMs,
            maxRedirects: 10,
            headers: { 'User-Agent': ua, 'Accept': '*/*' }
        });
        const buf = Buffer.from(resp.data);
        return buf.length > 1024 ? buf : null;
    } catch (_) {
        return null;
    }
}

async function axly(axly, m, msg, store) {
	if (!global.db) global.db = {};
	global.db.cases = global.db.cases || casesArray;
	const cases = global.db.cases;

	await LoadDataBase(axly, m);

	const botNumber = axly.decodeJid(axly.user.id);

	// Read Database
	const sewa = db.sewa;
	const premium = db.premium;
	const set = db.set[botNumber];

	// Database Game
	let suit = db.game.suit;
	let chess = db.game.chess;
	let chat_ai = db.game.chat_ai;
	let menfes = db.game.menfes;
	let tekateki = db.game.tekateki;
	let tictactoe = db.game.tictactoe;
	let tebaklirik = db.game.tebaklirik;
	let kuismath = db.game.kuismath;
	let blackjack = db.game.blackjack;
	let tebaklagu = db.game.tebaklagu;
	let tebakkata = db.game.tebakkata;
	let family100 = db.game.family100;
	let susunkata = db.game.susunkata;
	let tebakbom = db.game.tebakbom;
	let ulartangga = db.game.ulartangga;
	let tebakkimia = db.game.tebakkimia;
	let caklontong = db.game.caklontong;
	let tebakangka = db.game.tebakangka;
	let tebaknegara = db.game.tebaknegara;
	let tebakgambar = db.game.tebakgambar;
	let tebakbendera = db.game.tebakbendera;

	const ownerNumber = set.owner = [...new Set([...global.owner, botNumber.split('@')[0], ...set?.owner || []])];

	try {
		await GroupUpdate(axly, m, store);

		const body = ((m.type === 'conversation') ? m.message.conversation :
			(m.type == 'imageMessage') ? m.message.imageMessage.caption :
				(m.type == 'videoMessage') ? m.message.videoMessage.caption :
					(m.type == 'extendedTextMessage') ? m.message.extendedTextMessage.text :
						(m.type == 'reactionMessage') ? m.message.reactionMessage.text :
							(m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
								(m.type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
									(m.type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :
										(m.type == 'interactiveResponseMessage' && m.quoted) ? (m.message.interactiveResponseMessage?.nativeFlowResponseMessage ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : '') :
											(m.type == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || '') :
												(m.type == 'editedMessage') ? (m.message.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.editedMessage?.message?.protocolMessage?.editedMessage?.conversation || '') :
													(m.type == 'protocolMessage') ? (m.message.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.protocolMessage?.editedMessage?.conversation || m.message.protocolMessage?.editedMessage?.imageMessage?.caption || m.message.protocolMessage?.editedMessage?.videoMessage?.caption || '') : '') || '';

		const budy = (typeof m.text == 'string' ? m.text : '');
		const isCreator = global.isOwner = ownerNumber.some(owner => {
			const ownerJid = owner.includes('@') ? owner : owner + '@s.whatsapp.net';
			const findJid = axly.findJidByLid(jidNormalizedUser(ownerJid), store, true);
			if (!findJid) return false;
			return findJid === m.sender;
		});
		const symbolMatch = body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi);
		const emojiMatch = body.match(/^[\uD800-\uDBFF][\uDC00-\uDFFF]/gi);
		const listMatch = global.listprefix.find(a => body?.startsWith(a));
		const detectedPrefix = symbolMatch ? symbolMatch[0] : (emojiMatch ? emojiMatch[0] : listMatch);
		const prefix = isCreator ? (detectedPrefix || set.authorPrefix) : set.multiprefix ? (detectedPrefix || '¿') : (listMatch || '¿');
		const isCmd = body.startsWith(prefix);
		const args = body.trim().split(/ +/).slice(1);
		const quoted = m.quoted ? m.quoted : m;
		const command = isCmd ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : '';
		const text = global.q = args.join(' ');
		const mime = (quoted.msg || quoted).mimetype || '';
		const qmsg = (quoted.msg || quoted);
		const author = set.author = global.author || 'Axlydev';
		const packname = set.packname = global.packname || 'Bot WhatsApp';
		const botname = set.botname = global.botname || 'axly Bot';
		const badWordsLower = global.badWords.map(v => v.toLowerCase());
		const locale_day = moment.tz(global.timezone).locale(global.locale).format('dddd');
		const date = moment.tz(global.timezone).locale(global.locale).format('DD/MM/YYYY');
		const date_time = moment.tz(global.timezone).locale(global.locale).format('HH:mm:ss');
		const ucapanWaktu = date_time < '05:00:00' ? 'Selamat Pagi 🌉' : date_time < '11:00:00' ? 'Selamat Pagi 🌄' : date_time < '15:00:00' ? 'Selamat Siang 🏙' : date_time < '18:00:00' ? 'Selamat Sore 🌅' : date_time < '19:00:00' ? 'Selamat Sore 🌃' : date_time < '23:59:00' ? 'Selamat Malam 🌌' : 'Selamat Malam 🌌';
		const almost = 0.66;
		const time = Date.now();
		const time_now = new Date();
		const time_end = 60000 - (time_now.getSeconds() * 1000 + time_now.getMilliseconds());
		const readmore = String.fromCharCode(8206).repeat(999);
		const setv = pickRandom(global.listv);

		const isVip = isCreator || (db.users[m.sender] ? db.users[m.sender].vip : false);
		const isBan = isCreator || (db.users[m.sender] ? db.users[m.sender].ban : false);
		const isLimit = isCreator || (db.users[m.sender] ? (db.users[m.sender].limit > 0) : false);
		const isPremium = isCreator || checkStatus(m.sender, premium) || false;
		const isNsfw = m.isGroup ? db.groups[m.chat].nsfw : false;

		// Fake
		const fkontak = {
			key: {
				remoteJid: '0@s.whatsapp.net',
				participant: '0@s.whatsapp.net',
				fromMe: false,
				id: 'Axly'
			},
			message: {
				contactMessage: {
					displayName: (m.pushName || author),
					vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${m.pushName || author},;;;\nFN:${m.pushName || author}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
					sendEphemeral: true
				}
			}
		};

		// Auto Set Bio
		if (set.autobio) {
			if (new Date() * 1 - set.status > 60000) {
				await axly.updateProfileStatus(`${axly.user.name} | 🎯 Runtime : ${runtime(process.uptime())}`).catch(e => { });
				set.status = new Date() * 1;
			}
		}

		// Set Mode
		if (!isCreator) {
			if ((set.grouponly === set.privateonly)) {
				if (!axly.public && !m.key.fromMe) return;
			} else if (set.grouponly) {
				if (!m.isGroup) return;
			} else if (set.privateonly) {
				if (m.isGroup) return;
			}
		}

		// Group Settings
		if (m.isGroup) {
			// Mute
			if (db.groups[m.chat].mute && !isCreator) {
				return;
			}

			// Anti Hidetag
			if (!m.key.fromMe && m.mentionedJid?.length === m.metadata.participants?.length && db.groups[m.chat].antihidetag && !isCreator && m.isBotAdmin && !m.isAdmin) {
				await axly.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender } });
				await m.reply('*Anti Hidetag Sedang Aktif*');
			}

			// Anti Tag Sw
			if (!m.key.fromMe && db.groups[m.chat].antitagsw && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (m.type === 'groupStatusMentionMessage' || m.message?.groupStatusMentionMessage || m.message?.protocolMessage?.type === 25 || Object.keys(m.message).length === 1 && Object.keys(m.message)[0] === 'messageContextInfo') {
					if (!db.groups[m.chat].tagsw[m.sender]) {
						db.groups[m.chat].tagsw[m.sender] = 1;
						await m.reply(`Grup ini terdeteksi ditandai dalam Status WhatsApp\n@${m.sender.split('@')[0]}, mohon untuk tidak menandai grup dalam status WhatsApp\nPeringatan ${db.groups[m.chat].tagsw[m.sender]}/5, akan dikick sewaktu waktu❗`);
					} else if (db.groups[m.chat].tagsw[m.sender] >= 5) {
						await axly.groupParticipantsUpdate(m.chat, [m.sender], 'remove').catch((err) => m.reply(global.mess.fail));
						await m.reply(`@${m.sender.split("@")[0]} telah dikeluarkan dari grup\nKarena menandai grup dalam status WhatsApp sebanyak 5x`);
						delete db.groups[m.chat].tagsw[m.sender];
					} else {
						db.groups[m.chat].tagsw[m.sender] += 1;
						await m.reply(`Grup ini terdeteksi ditandai dalam Status WhatsApp\n@${m.sender.split('@')[0]}, mohon untuk tidak menandai grup dalam status WhatsApp\nPeringatan ${db.groups[m.chat].tagsw[m.sender]}/5, akan dikick sewaktu waktu❗`);
					}
				}
			}

			// Anti Toxic
			if (!m.key.fromMe && db.groups[m.chat].antitoxic && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (budy.toLowerCase().split(/\s+/).some(word => badWordsLower.includes(word))) {
					await axly.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender } });
					await axly.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split('@')[0]} Berkata Toxic\nMohon gunakan bahasa yang sopan.`, contextInfo: { mentionedJid: [m.key.participantAlt || m.sender], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Toxic❗*' }, ...m.key } } }, {});
				}
			}

			// Anti Delete
			if (m.type === 'protocolMessage' && m.msg?.type === 0 && db.groups[m.chat].antidelete && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (store?.messages?.[m.chat]?.array) {
					const chats = store.messages[m.chat].array.find(a => a.key.id === m.msg.key.id);
					if (!chats?.message) return;
					const msgType = Object.keys(chats.message)[0];
					const msgContent = chats.message[msgType];
					if (msgContent.fileSha256 && msgContent.mediaKey) {
						msgContent.mediaKey = fixBytes(msgContent.mediaKey);
						msgContent.fileSha256 = fixBytes(msgContent.fileSha256);
						msgContent.fileEncSha256 = fixBytes(msgContent.fileEncSha256);
					}
					msgContent.contextInfo = { mentionedJid: [chats.key.participantAlt], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Delete❗*' }, ...chats.key };
					const pesan = msgType === 'conversation' ? { extendedTextMessage: { text: msgContent, contextInfo: { mentionedJid: [chats.key.participantAlt], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Delete❗*' }, ...chats.key } } } : { [msgType]: msgContent };
					await axly.relayMessage(m.chat, pesan, {});
				}
			}

			// Anti Link Group
			if (db.groups[m.chat].antilink && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (budy.match('chat.whatsapp.com/')) {
					await axly.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender } });
					await axly.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split('@')[0]} Mengirim Link Group\nMaaf Link Harus Di Hapus..`, contextInfo: { mentionedJid: [m.key.participantAlt || m.sender], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Link❗*' }, ...m.key } } }, {});
				}
			}

			// Anti Virtex Group
			if (db.groups[m.chat].antivirtex && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (budy.length > 4500) {
					await axly.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender } });
					await axly.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split('@')[0]} Mengirim Virtex..`, contextInfo: { mentionedJid: [m.key.participantAlt || m.sender], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Virtex❗*' }, ...m.key } } }, {});
					await axly.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
				}
				if (m.msg?.nativeFlowMessage?.messageParamsJson?.length > 3500) {
					await axly.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender } });
					await axly.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split('@')[0]} Mengirim Bug..`, contextInfo: { mentionedJid: [m.key.participantAlt || m.sender], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Bug❗*' }, ...m.key } } }, {});
					await axly.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
				}
			}

		}

		// Auto Read
		if (m.message && m.key.remoteJid !== 'status@broadcast') {
			if ((set.autoread && axly.public) || isCreator) {
				axly.readMessages([m.key]);
			} // <-- tutup if inner
		} // <-- tutup if outer


		// Filter Bot & Ban
		if (m.isBot) return;
		if (db.users[m.sender]?.ban && !isCreator) return;

		// Mengetik & Anti Spam & Hit
		if (axly.public && isCmd) {
			if (set.autotyping) {
				await axly.sendPresenceUpdate('composing', m.chat);
			}
			if (cases.includes(command)) {
				cmdAdd(db.hit);
				cmdAddHit(db.hit, command);
			}
			if (set.antispam && antiSpam.isFiltered(m.sender)) {
				console.log(chalk.bgRed('[ SPAM ] : '), chalk.black(chalk.bgHex('#1CFFF7')(`From -> ${m.sender}`), chalk.bgHex('#E015FF')(` In ${m.isGroup ? m.chat : 'Private Chat'}`)));
				return m.reply('「 ❗ 」Beri Jeda 5 Detik Per Command Kak');
			}

			if (command && set.didyoumean) {
				let _b = '';
				let _s = 0;
				for (const c of cases) {
					let sim = similarity(command.toLowerCase(), c.toLowerCase());
					let lengthDiff = Math.abs(command.length - c.length);
					if (sim > _s && lengthDiff <= 1) {
						_s = sim;
						_b = c;
					}
				}
				let s_percentage = parseInt(_s * 100);
				if (_s >= almost && command.toLowerCase() !== _b.toLowerCase()) {
					return m.reply(`Command Tidak Ditemukan!\nMungkin yang kamu maksud:\n- ${prefix + _b}\n- Similarity: ${s_percentage}%`);
				}
			}
		}

		if (isCmd && !isCreator) antiSpam.addFilter(m.sender);

		// Cmd Media
		let fileSha256;
		if (m.isMedia && m.msg.fileSha256 && db.cmd && (m.msg.fileSha256.toString('base64') in db.cmd)) {
			let hash = db.cmd[m.msg.fileSha256.toString('base64')];
			fileSha256 = hash.text;
		}

		// Salam
		if (/^a(s|ss)alamu('|)alaikum(| )(wr|)( |)(wb|)$/.test(budy?.toLowerCase())) {
			const jwb_salam = ['Wa\'alaikumusalam', 'Wa\'alaikumusalam wr wb', 'Wa\'alaikumusalam Warohmatulahi Wabarokatuh'];
			m.reply(pickRandom(jwb_salam));
		}

		// Cek Expired
		checkExpired(premium);
		checkExpired(sewa, axly);

		// TicTacToe
		let room = Object.values(tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING');
		if (room) {
			let now = Date.now();
			if (now - (room.lastMove || now) > 5 * 60 * 1000) {
				m.reply('Game Tic-Tac-Toe dibatalkan karena tidak ada aktivitas selama 5 menit.');
				delete tictactoe[room.id];
				return;
			}
			room.lastMove = now;
			let ok, isWin = false, isTie = false, isSurrender = false;
			if (!/^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i.test(m.text)) return;
			isSurrender = !/^[1-9]$/.test(m.text);
			if (m.sender !== room.game.currentTurn) {
				if (!isSurrender) return true;
			}
			if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
				m.reply({ '-3': 'Game telah berakhir', '-2': 'Invalid', '-1': 'Posisi Invalid', 0: 'Posisi Invalid' }[ok]);
				return true;
			}
			if (m.sender === room.game.winner) isWin = true;
			else if (room.game.board === 511) isTie = true;
			if (!(room.game instanceof TicTacToe)) {
				room.game = Object.assign(new TicTacToe(room.game.playerX, room.game.playerO), room.game);
			}
			let arr = room.game.render().map(v => ({ X: '❌', O: '⭕', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣' }[v]));
			if (isSurrender) {
				room.game._currentTurn = m.sender === room.game.playerX;
				isWin = true;
			}
			let winner = isSurrender ? room.game.currentTurn : room.game.winner;
			if (isWin) {
				db.users[m.sender].limit += 3;
				db.users[m.sender].money += 3000;
			}
			let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n\n${isWin ? `@${winner.split('@')[0]} Menang!` : isTie ? `Game berakhir` : `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}\n❌: @${room.game.playerX.split('@')[0]}\n⭕: @${room.game.playerO.split('@')[0]}\n\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`;
			if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
				room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat;
			if (room.x !== room.o) await axly.sendMessage(room.x, { text: str, mentions: parseMention(str) }, { quoted: m });
			await axly.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m });
			if (isTie || isWin) delete tictactoe[room.id];
		}

		// Suit PvP
		let roof = Object.values(suit).find(roof => roof.id && roof.status && [roof.p, roof.p2].includes(m.sender));
		if (roof) {
			let now = Date.now();
			let win = '', tie = false;
			if (now - (roof.lastMove || now) > 3 * 60 * 1000) {
				m.reply('Game Suit dibatalkan karena tidak ada aktivitas selama 3 menit.');
				delete suit[roof.id];
				return;
			}
			roof.lastMove = now;
			if (m.sender == roof.p2 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa|y)/i.test(m.text) && m.isGroup && roof.status == 'wait') {
				if (/^(tolak|gamau|nanti|n|ga(k.)?bisa)/i.test(m.text)) {
					m.reply(`@${roof.p2.split('@')[0]} menolak suit,\nsuit dibatalkan`);
					delete suit[roof.id];
					return !0;
				}
				roof.status = 'play';
				roof.asal = m.chat;
				m.reply(`Suit telah dikirimkan ke chat\n\n@${roof.p.split('@')[0]} dan @${roof.p2.split('@')[0]}\n\nSilahkan pilih suit di chat masing-masing klik https://wa.me/${botNumber.split('@')[0]}`);
				if (!roof.pilih) axly.sendMessage(roof.p, { text: `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️` }, { quoted: m });
				if (!roof.pilih2) axly.sendMessage(roof.p2, { text: `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️` }, { quoted: m });
			}
			let jwb = m.sender == roof.p, jwb2 = m.sender == roof.p2;
			let g = /gunting/i, b = /batu/i, k = /kertas/i, reg = /^(gunting|batu|kertas)/i;

			if (jwb && reg.test(m.text) && !roof.pilih && !m.isGroup) {
				roof.pilih = reg.exec(m.text.toLowerCase())[0];
				roof.text = m.text;
				m.reply(`Kamu telah memilih ${m.text} ${!roof.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`);
				if (!roof.pilih2) axly.sendMessage(roof.p2, { text: '_Lawan sudah memilih_\nSekarang giliran kamu' });
			}
			if (jwb2 && reg.test(m.text) && !roof.pilih2 && !m.isGroup) {
				roof.pilih2 = reg.exec(m.text.toLowerCase())[0];
				roof.text2 = m.text;
				m.reply(`Kamu telah memilih ${m.text} ${!roof.pilih ? `\n\nMenunggu lawan memilih` : ''}`);
				if (!roof.pilih) axly.sendMessage(roof.p, { text: '_Lawan sudah memilih_\nSekarang giliran kamu' });
			}
			let stage = roof.pilih;
			let stage2 = roof.pilih2;
			if (roof.pilih && roof.pilih2) {
				if (b.test(stage) && g.test(stage2)) win = roof.p;
				else if (b.test(stage) && k.test(stage2)) win = roof.p2;
				else if (g.test(stage) && k.test(stage2)) win = roof.p;
				else if (g.test(stage) && b.test(stage2)) win = roof.p2;
				else if (k.test(stage) && b.test(stage2)) win = roof.p;
				else if (k.test(stage) && g.test(stage2)) win = roof.p2;
				else if (stage == stage2) tie = true;
				db.users[roof.p == win ? roof.p : roof.p2].limit += tie ? 0 : 3;
				db.users[roof.p == win ? roof.p : roof.p2].money += tie ? 0 : 3000;
				axly.sendMessage(roof.asal, { text: `_*Hasil Suit*_${tie ? '\nSERI' : ''}\n\n@${roof.p.split('@')[0]} (${roof.text}) ${tie ? '' : roof.p == win ? ` Menang \n` : ` Kalah \n`}\n@${roof.p2.split('@')[0]} (${roof.text2}) ${tie ? '' : roof.p2 == win ? ` Menang \n` : ` Kalah \n`}\n\nPemenang Mendapatkan\n*Hadiah :* Uang(3000) & Limit(3)`.trim(), mentions: [roof.p, roof.p2] }, { quoted: m });
				delete suit[roof.id];
			}
		}

		// Tebak Bomb
		let pilih = '🌀', bomb = '💣';
		if (m.sender in tebakbom) {
			if (!/^[1-9]|10$/i.test(body) && !isCmd && !isCreator) return !0;
			let index = parseInt(body) - 1;
			if (tebakbom[m.sender].petak[index] === 1 || tebakbom[m.sender].petak[index] === 3) return !0;
			if (tebakbom[m.sender].petak[index] === 2) {
				tebakbom[m.sender].petak[index] = 3;
				tebakbom[m.sender].board[index] = bomb;
				tebakbom[m.sender].pick++;
				m.react('❌');
				tebakbom[m.sender].bomb--;
				tebakbom[m.sender].nyawa.pop();
				let brd = tebakbom[m.sender].board;
				if (tebakbom[m.sender].nyawa.length < 1) {
					await m.reply(`*GAME TELAH BERAKHIR*\nKamu terkena bomb\n\n ${brd.join('')}\n\n*Terpilih :* ${tebakbom[m.sender].pick}\n_Pengurangan Limit : 1_`);
					m.react('😂');
					delete tebakbom[m.sender];
				} else m.reply(`*PILIH ANGKA*\n\nKamu terkena bomb\n ${brd.join('')}\n\nTerpilih: ${tebakbom[m.sender].pick}\nSisa nyawa: ${tebakbom[m.sender].nyawa.join('')}`);
				return !0;
			}
			if (tebakbom[m.sender].petak[index] === 0) {
				tebakbom[m.sender].petak[index] = 1;
				tebakbom[m.sender].board[index] = pilih;
				tebakbom[m.sender].pick++;
				tebakbom[m.sender].lolos--;
				let brd = tebakbom[m.sender].board;
				if (tebakbom[m.sender].lolos < 1) {
					db.users[m.sender].money += 6000;
					await m.reply(`*KAMU HEBAT ಠ⁠ᴥ⁠ಠ*\n\n${brd.join('')}\n\n*Terpilih :* ${tebakbom[m.sender].pick}\n*Sisa nyawa :* ${tebakbom[m.sender].nyawa.join('')}\n*Bomb :* ${tebakbom[m.sender].bomb}\nBonus Money 💰 *+6000*`);
					delete tebakbom[m.sender];
				} else m.reply(`*PILIH ANGKA*\n\n${brd.join('')}\n\nTerpilih : ${tebakbom[m.sender].pick}\nSisa nyawa : ${tebakbom[m.sender].nyawa.join('')}\nBomb : ${tebakbom[m.sender].bomb}`);
			}
		}

		// Game
		const games = { tebaklirik, tekateki, tebaklagu, tebakkata, kuismath, susunkata, tebakkimia, caklontong, tebakangka, tebaknegara, tebakgambar, tebakbendera };
		for (let gameName in games) {
			let game = games[gameName];
			let id = iGame(game, m.chat);
			if ((!isCmd || isCreator) && m.quoted && id == m.quoted.id) {
				if (game[m.chat + id]?.jawaban) {
					if (gameName == 'kuismath') {
						let jawaban = game[m.chat + id].jawaban;
						const difficultyMap = { 'noob': 1, 'easy': 1.5, 'medium': 2.5, 'hard': 4, 'extreme': 5, 'impossible': 6, 'impossible2': 7 };
						let randMoney = difficultyMap[kuismath[m.chat + id].mode];
						if (!isNaN(budy)) {
							if (budy.toLowerCase() == jawaban) {
								db.users[m.sender].money += randMoney * 1000;
								await m.reply(`Jawaban Benar 🎉\nBonus Money 💰 *+${randMoney * 1000}*`);
								delete kuismath[m.chat + id];
							} else m.reply('*Jawaban Salah!*');
						}
					} else {
						let jawaban = game[m.chat + id].jawaban;
						let jawabBenar = /tekateki|tebaklirik|tebaklagu|tebakkata|tebaknegara|tebakbendera/.test(gameName) ? (similarity(budy.toLowerCase(), jawaban) >= almost) : (budy.toLowerCase() == jawaban);
						let bonus = gameName == 'caklontong' ? 9999 : gameName == 'tebaklirik' ? 4299 : gameName == 'susunkata' ? 2989 : 3499;
						if (jawabBenar) {
							db.users[m.sender].money += bonus * 1;
							await m.reply(`Jawaban Benar 🎉\nBonus Money 💰 *+${bonus}*`);
							delete game[m.chat + id];
						} else m.reply('*Jawaban Salah!*');
					}
				}
			}
		}

		// Family 100
		if (m.chat in family100) {
			if (m.quoted && m.quoted.id == family100[m.chat].id && !isCmd) {
				let room = family100[m.chat];
				let teks = budy.toLowerCase().replace(/[^\w\s\-]+/, '');
				let isSurender = /^((me)?nyerah|surr?ender)$/i.test(teks);
				if (!isSurender) {
					let index = room.jawaban.findIndex(v => v.toLowerCase().replace(/[^\w\s\-]+/, '') === teks);
					if (room.terjawab[index]) return !0;
					room.terjawab[index] = m.sender;
				}
				let isWin = room.terjawab.length === room.terjawab.filter(v => v).length;
				let caption = `Jawablah Pertanyaan Berikut :\n${room.soal}\n\n\nTerdapat ${room.jawaban.length} Jawaban ${room.jawaban.find(v => v.includes(' ')) ? `(beberapa Jawaban Terdapat Spasi)` : ''}\n${isWin ? `Semua Jawaban Terjawab` : isSurender ? 'Menyerah!' : ''}\n${Array.from(room.jawaban, (jawaban, index) => { return isSurender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false; }).filter(v => v).join('\n')}\n${isSurender ? '' : `Perfect Player`}`.trim();
				m.reply(caption);
				if (isWin || isSurender) delete family100[m.chat];
			}
		}

		// Chess
		const validPromotions = { 'q': 'q', 'queen': 'q', 'menteri': 'q', 'r': 'r', 'rook': 'r', 'benteng': 'r', 'b': 'b', 'bishop': 'b', 'gajah': 'b', 'mentri': 'b', 'n': 'n', 'knight': 'n', 'kuda': 'n' };
		if ((!isCmd || isCreator) && (m.sender in chess)) {
			if (m.quoted && chess[m.sender].id == m.quoted.id && chess[m.sender].turn == m.sender && chess[m.sender].botMode) {
				if (!(chess[m.sender] instanceof Chess)) {
					const savedData = chess[m.sender];
					chess[m.sender] = new Chess(savedData._fen);
					Object.assign(chess[m.sender], {
						id: savedData.id,
						turn: savedData.turn,
						botMode: savedData.botMode,
						time: savedData.time,
						_fen: savedData._fen
					});
				}
				if (chess[m.sender].isCheckmate() || chess[m.sender].isDraw() || chess[m.sender].isGameOver()) {
					const status = chess[m.sender].isCheckmate() ? 'Checkmate' : chess[m.sender].isDraw() ? 'Draw' : 'Game Over';
					delete chess[m.sender];
					return m.reply(`♟Game ${status}\nPermainan dihentikan`);
				}
				const [from, to, promotion] = budy.toLowerCase().split(' ');
				if (!from || !to || from.length !== 2 || to.length !== 2) return m.reply('Format salah! Gunakan: e2 e4\nAtau: c7 c8 q (untuk promosi)');
				const promo = validPromotions[promotion] || 'q';
				try {
					chess[m.sender].move({ from, to, promotion: promo });
				} catch (e) {
					if (chess[m.sender].isCheck()) {
						return m.reply(`⚠️ Langkah Tidak Valid @${m.sender.split('@')[0]}!\n\nRaja tim kamu sedang di-SKAK! Fokus selamatkan raja dulu.`);
					}
					return m.reply('Langkah Tidak Valid!');
				}

				if (chess[m.sender].isGameOver()) {
					delete chess[m.sender];
					return m.reply(`♟Permainan Selesai\nPemenang: @${m.sender.split('@')[0]}`);
				}
				const moves = chess[m.sender].moves({ verbose: true });
				const botMove = moves[Math.floor(Math.random() * moves.length)];
				chess[m.sender].move(botMove);
				chess[m.sender]._fen = chess[m.sender].fen();
				chess[m.sender].time = Date.now();

				if (chess[m.sender].isGameOver()) {
					delete chess[m.sender];
					return m.reply(`♟Permainan Selesai\nPemenang: BOT`);
				}
				const encodedFen = encodeURI(chess[m.sender]._fen);
				const boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside`, `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside`, `https://chessboardimage.com/${encodedFen}.png`, `https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}&coordinates=true&size=765`, `https://fen2image.chessvision.ai/${encodedFen}/`];
				for (let url of boardUrls) {
					try {
						const { data } = await axios.get(url, { responseType: 'arraybuffer' });
						let { key } = await m.reply({ image: data, caption: `♟️CHESS GAME (vs BOT)\n\nLangkahmu: ${from} → ${to}\nLangkah bot: ${botMove.from} → ${botMove.to}\n\nGiliranmu berikutnya!\nExample: e2 e4`, mentions: [m.sender] });
						chess[m.sender].id = key.id;
						break;
					} catch (e) { }
				}
			} else if (chess[m.sender].time && (Date.now() - chess[m.sender].time >= 3600000)) {
				delete chess[m.sender];
				return m.reply(`♟Waktu Habis!\nPermainan dihentikan`);
			}
		}
		if (m.isGroup && (!isCmd || isCreator) && (m.chat in chess)) {
			if (m.quoted && chess[m.chat].id == m.quoted.id && [chess[m.chat].player1, chess[m.chat].player2].includes(m.sender)) {
				if (!(chess[m.chat] instanceof Chess)) {
					const savedData = chess[m.sender];
					chess[m.chat] = new Chess(savedData._fen);
					Object.assign(chess[m.chat], {
						id: savedData.id,
						turn: savedData.turn,
						player1: savedData.player1,
						player2: savedData.player2,
						start: savedData.start,
						acc: savedData.acc,
						time: savedData.time,
						_fen: savedData._fen
					});
				}
				if (chess[m.chat].isCheckmate() || chess[m.chat].isDraw() || chess[m.chat].isGameOver()) {
					const status = chess[m.chat].isCheckmate() ? 'Checkmate' : chess[m.chat].isDraw() ? 'Draw' : 'Game Over';
					delete chess[m.chat];
					return m.reply(`♟Game ${status}\nPermainan dihentikan`);
				}
				const [from, to, promotion] = budy.toLowerCase().split(' ');
				if (!from || !to || from.length !== 2 || to.length !== 2) return m.reply('Format salah! Gunakan: e2 e4\nAtau: c7 c8 q (untuk promosi)');
				if ([chess[m.chat].player1, chess[m.chat].player2].includes(m.sender) && chess[m.chat].turn === m.sender) {
					const promo = validPromotions[promotion] || 'q';
					try {
						chess[m.chat].move({ from, to, promotion: promo });
					} catch (e) {
						if (chess[m.chat].isCheck()) {
							return m.reply(`⚠️ Langkah Tidak Valid @${m.sender.split('@')[0]}!\n\nRaja tim kamu sedang di-SKAK! Fokus selamatkan raja dulu.`);
						}
						return m.reply('Langkah Tidak Valid!');
					}
					chess[m.chat].time = Date.now();
					chess[m.chat]._fen = chess[m.chat].fen();
					const isPlayer2 = chess[m.chat].player2 === m.sender;
					const nextPlayer = isPlayer2 ? chess[m.chat].player1 : chess[m.chat].player2;
					const encodedFen = encodeURI(chess[m.chat]._fen);
					const boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside${!isPlayer2 ? '&flip=true' : ''}`, `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${!isPlayer2 ? '&flip=true' : ''}`, `https://chessboardimage.com/${encodedFen}${!isPlayer2 ? '-flip' : ''}.png`, `https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}&coordinates=true&size=765${!isPlayer2 ? '&orientation=black' : ''}`, `https://fen2image.chessvision.ai/${encodedFen}/${!isPlayer2 ? '?pov=black' : ''}`];
					for (let url of boardUrls) {
						try {
							const { data } = await axios.get(url, { responseType: 'arraybuffer' });
							let { key } = await m.reply({ image: data, caption: `♟️CHESS GAME\n\nGiliran: @${nextPlayer.split('@')[0]}\n\nReply Pesan Ini untuk lanjut bermain!\nExample: from to -> b1 c3`, mentions: [nextPlayer] });
							chess[m.chat].turn = nextPlayer;
							chess[m.chat].id = key.id;
							break;
						} catch (e) { }
					}
				}
			} else if (chess[m.chat].time && (Date.now() - chess[m.chat].time >= 3600000)) {
				delete chess[m.chat];
				return m.reply(`♟Waktu Habis!\nPermainan dihentikan`);
			}
		}

		// Ular Tangga
		if (m.isGroup && (!isCmd || isCreator) && (m.chat in ulartangga)) {
			if (m.quoted && ulartangga[m.chat].id == m.quoted.id) {
				if (!(ulartangga[m.chat] instanceof SnakeLadder)) {
					ulartangga[m.chat] = Object.assign(new SnakeLadder(ulartangga[m.chat]), ulartangga[m.chat]);
				}
				if (/^(roll|kocok)/i.test(budy.toLowerCase())) {
					const player = ulartangga[m.chat].players.findIndex(a => a.id == m.sender);
					if (ulartangga[m.chat].turn !== player) return m.reply('Bukan Giliranmu!');
					const roll = ulartangga[m.chat].rollDice();
					await m.reply(`https://raw.githubusercontent.com/axlydev/database/master/games/images/dice/roll-${roll}.webp`);
					ulartangga[m.chat].nextTurn();
					ulartangga[m.chat].players[player].move += roll;
					if (ulartangga[m.chat].players[player].move > 100) ulartangga[m.chat].players[player].move = 100 - (ulartangga[m.chat].players[player].move - 100);
					let teks = `🐍🪜Warna: ${['Merah', 'Biru Muda', 'Kuning', 'Hijau', 'Ungu', 'Jingga', 'Biru Tua', 'Putih'][player]} -> ${ulartangga[m.chat].players[player].move}\n`;
					if (Object.keys(ulartangga[m.chat].map.move).includes(ulartangga[m.chat].players[player].move.toString())) {
						teks += ulartangga[m.chat].players[player].move > ulartangga[m.chat].map.move[ulartangga[m.chat].players[player].move] ? 'Kamu Termakan Ular!\n' : 'Kamu Naik Tangga\n';
						ulartangga[m.chat].players[player].move = ulartangga[m.chat].map.move[ulartangga[m.chat].players[player].move];
					}
					const newMap = await ulartangga[m.chat].drawBoard(ulartangga[m.chat].map.url, ulartangga[m.chat].players);
					if (ulartangga[m.chat].players[player].move === 100) {
						teks += `@${m.sender.split('@')[0]} Menang\nHadiah:\n- Limit + 50\n- Money + 100.000`;
						addLimit(50, m.sender, db);
						addMoney(100000, m.sender, db);
						delete ulartangga[m.chat];
						return m.reply({ image: newMap, caption: teks, mentions: [m.sender] });
					}
					let { key } = await m.reply({ image: newMap, caption: teks + `Giliran: @${ulartangga[m.chat].players[ulartangga[m.chat].turn].id.split('@')[0]}`, mentions: [m.sender, ulartangga[m.chat].players[ulartangga[m.chat].turn].id] });
					ulartangga[m.chat].id = key.id;
				} else m.reply('Example: roll/kocok');
			} else if (ulartangga[m.chat].time && (Date.now() - ulartangga[m.chat].time >= 7200000)) {
				delete ulartangga[m.chat];
				return m.reply(`🐍🪜Waktu Habis!\nPermainan dihentikan`);
			}
		}

		// Menfes & Room Ai
		if (!m.isGroup && (!isCmd || isCreator)) {
			// Menfess (tanpa API)
			if (menfes[m.sender] && m.key.remoteJid !== 'status@broadcast' && m.msg) {
				m.react('✈');
				if (m.type !== 'conversation') m.msg.contextInfo = { isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: `*Pesan Dari ${menfes[m.sender].nama ? menfes[m.sender].nama : 'Seseorang'}*` }, key: { remoteJid: '0@s.whatsapp.net', fromMe: false, participant: '0@s.whatsapp.net' } };
				const pesan = m.type === 'conversation' ? { extendedTextMessage: { text: m.msg, contextInfo: { isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: `*Pesan Dari ${menfes[m.sender].nama ? menfes[m.sender].nama : 'Seseorang'}*` }, key: { remoteJid: '0@s.whatsapp.net', fromMe: false, participant: '0@s.whatsapp.net' } } } } : { [m.type]: m.msg };
				await axly.relayMessage(menfes[m.sender].tujuan, pesan, {});
			}
			// Bagian chat_ai (dihapus)
		}

		// Afk
		let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
		for (let jid of mentionUser) {
			let user = db.users[jid];
			if (!user) continue;
			let afkTime = user.afkTime;
			if (!afkTime || afkTime < 0) continue;
			let reason = user.afkReason || '';
			m.reply(`Jangan tag dia!\nDia sedang AFK ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'}\nSelama ${clockString(new Date - afkTime)}`.trim());
		}
		if (db.users[m.sender].afkTime > -1) {
			let user = db.users[m.sender];
			m.reply(`@${m.sender.split('@')[0]} berhenti AFK${user.afkReason ? ' setelah ' + user.afkReason : ''}\nSelama ${clockString(new Date - user.afkTime)}`);
			user.afkTime = -1;
			user.afkReason = '';
		}

		switch (fileSha256 || command) {
			// Tempat Add Case
			case '19rujxl1e': {
				console.log('.');
			}
				break;

			// Owner Menu
			case 'shutdown': case 'off': {
				if (!isCreator) return m.reply(global.mess.owner);
				m.reply(`*[BOT] Process Shutdown...*`).then(() => {
					process.exit(0);
				});
			}
				break;
				case 'fbdownload': case 'fb': case 'fbdl': case 'facebook': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`📱 *Facebook Downloader*\n\nContoh: ${prefix + command} https://www.facebook.com/...`);
    if (!text.includes('facebook.com') && !text.includes('fb.com')) {
        return m.reply('❌ URL tidak valid! Masukkan URL Facebook yang benar.');
    }

    await m.react('⏳');

    try {
        const apiUrl = `https://axlyapi.qzz.io/download/facebook?url=${encodeURIComponent(text.trim())}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        if (!data.status || !data.result) {
            throw new Error(data?.message || 'Gagal mengambil data');
        }

        const result = data.result;
        const type = result.type;

        if (type === 'photo') {
            const images = result.images || [];
            if (!images.length) throw new Error('Tidak ada gambar ditemukan');

            for (let i = 0; i < Math.min(images.length, 5); i++) {
                const img = images[i];
                await axly.sendMessage(m.chat, {
                    image: { url: img.url },
                    caption: i === 0 ? `📸 *Facebook Photo*\n\n📦 Ukuran: ${img.size || '?'}\n🔗 Tipe: ${img.type || 'jpg'}` : ''
                }, { quoted: m });
                await new Promise(r => setTimeout(r, 1000));
            }
            
            setLimit(m, db);
            await m.react('✅');

        } else if (type === 'video') {
            const videos = result.videos || [];
            if (!videos.length) throw new Error('Tidak ada video ditemukan');

            let video = videos.find(v => v.quality === 'HD') || videos[0];
            let quality = video.quality || 'Unknown';
            let size = video.size || '?';

            await axly.sendMessage(m.chat, {
                video: { url: video.url },
                caption: `🎬 *Facebook Video*\n\n✅ *Download Sukses*\n🎞️ Quality: ${quality}\n📦 Size: ${size}`,
                mimetype: 'video/mp4'
            }, { quoted: m });

            setLimit(m, db);
            await m.react('✅');
        } else {
            throw new Error('Tipe konten tidak dikenal');
        }

    } catch (err) {
        console.error('Facebook Error:', err.message);
        await m.react('❌');
        m.reply(`❌ Gagal mendownload!\n\n${err.message}`);
    }
}
break;
				case 'dehaze': case 'colorize': case 'colorfull': {
    if (!isLimit) return m.reply(global.mess.limit)
    if (/image/.test(mime)) {
        m.react('⏳')
        let media = await axly.downloadAndSaveMediaMessage(qmsg);
        let outputFile = `./database/temp/${getRandom('.jpg')}`;
        try {
            // Mencoba pakai sharp untuk meningkatkan saturasi & kecerahan
            const sharp = require('sharp');
            await sharp(media)
                .modulate({
                    saturation: 1.5,   // tingkatkan saturasi 50%
                    brightness: 1.1    // sedikit lebih terang
                })
                .toFile(outputFile);
            await m.reply({ image: { url: outputFile }, caption: '✨ Efek Colorfull (saturasi+)' });
            setLimit(m, db);
        } catch (e) {
            console.log(e);
            m.reply('⚠️ Fitur colorize/dehaze dengan AI tidak tersedia gratis. Gunakan *.hd* untuk memperbesar gambar, atau kirim ulang gambar dengan pencahayaan cukup.');
        } finally {
            if (outputFile && fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
            if (media && fs.existsSync(media)) fs.unlinkSync(media);
        }
    } else m.reply(`Kirim/Reply Gambar dengan format\nExample: ${prefix + command}`)
}
			break
			case 'update': case 'upgrade': {
				if (!isCreator) return m.reply(global.mess.owner);
				m.reply(`*[BOT] Process Update And Upgrade...*`).then(() => {
					try {
						runUpdate();
					} catch (e) {
						process.exit(0);
					}
				});
			}
				break;
			case 'byq': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!m.quoted) return m.reply(global.mess.quoted);
				delete m.quoted.chat;
				let anya = Object.values(m.quoted.fakeObj())[1];
				m.reply(`const byt = ${JSON.stringify(anya.message, null, 2)}\naxly.relayMessage(m.chat, byt, {})`);
			}
				break;
			case 'setbio': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(global.mess.text);
				axly.setStatus(q);
				m.reply(`*Bio telah di ganti menjadi ${q}*`);
			}
				break;
			case 'setppbot': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!/image/.test(quoted.type)) return m.reply(`Reply Image With Caption ${prefix + command}`);
				let media = await quoted.download();
				let { img } = await generateProfilePicture(media, text.length > 0 ? null : 512);
				await axly.query({
					tag: 'iq',
					attrs: {
						to: '@s.whatsapp.net',
						type: 'set',
						xmlns: 'w:profile:picture'
					},
					content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
				});
				m.reply(global.mess.done);
			}
				break;
			case 'delppbot': {
				if (!isCreator) return m.reply(global.mess.owner);
				await axly.removeProfilePicture(axly.user.id);
				m.reply(global.mess.done);
			}
				break;
			case 'version': case 'versi': case 'v': {
				const pkg = require('./package.json');
				m.reply(`Version : ${pkg.version}`);
			}
				break;
			case 'join': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply('Masukkan Link Group!');
				if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return m.reply('Link Invalid!');
				const result = args[0].match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
				if (!result) return m.reply('Link Invalid❗');
				m.reply(global.mess.wait);
				await axly.groupAcceptInvite(result[1]).catch((res) => {
					if (res.data == 400) return m.reply('Grup Tidak Di Temukan❗');
					if (res.data == 401) return m.reply('Bot Di Kick Dari Grup Tersebut❗');
					if (res.data == 409) return m.reply('Bot Sudah Join Di Grup Tersebut❗');
					if (res.data == 410) return m.reply('Url Grup Telah Di Setel Ulang❗');
					if (res.data == 500) return m.reply('Grup Penuh❗');
				});
			}
				break;
			case 'leave': {
				if (!isCreator) return m.reply(global.mess.owner);
				await axly.groupLeave(m.chat).then(() => axly.sendFromOwner(ownerNumber, 'Sukses Keluar Dari Grup', m, { contextInfo: { isForwarded: true } })).catch(e => { });
			}
				break;
			case 'clearchat': {
				if (!isCreator) return m.reply(global.mess.owner);
				await axly.chatModify({ delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.timestamp }] }, m.chat).catch((e) => m.reply('Gagal Menghapus Chat!'));
				m.reply(global.mess.done);
			}
				break;
			case 'getmsgstore': case 'storemsg': {
				if (!isCreator) return m.reply(global.mess.owner);
				let [teks1, teks2] = text.split`|`;
				if (teks1 && teks2) {
					const msgnya = await global.loadMessage(teks1, teks2);
					if (msgnya?.message) await axly.relayMessage(m.chat, msgnya.message, {});
					else m.reply('Pesan Tidak Ditemukan!');
				} else m.reply(`Example: ${prefix + command} 123xxx@g.us|3EB0xxx`);
			}
				break;
			case 'blokir': case 'block': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const numbersOnly = m.isGroup ? (text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender) : m.chat;
					await axly.updateBlockStatus(numbersOnly, 'block').then((a) => m.reply(global.mess.done)).catch((err) => m.reply(global.mess.fail));
				} else m.reply(`Example: ${prefix + command} 62xxx`);
			}
				break;
			case 'listblock': {
				let anu = await axly.fetchBlocklist();
				m.reply(`Total Block : ${anu.length}\n` + anu.map(v => '• ' + v.replace(/@.+/, '')).join`\n`);
			}
				break;
			case 'openblokir': case 'unblokir': case 'openblock': case 'unblock': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const numbersOnly = m.isGroup ? (text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender) : m.chat;
					await axly.updateBlockStatus(numbersOnly, 'unblock').then((a) => m.reply(global.mess.done)).catch((err) => m.reply(global.mess.fail));
				} else m.reply(`Example: ${prefix + command} 62xxx`);
			}
				break;
			case 'ban': case 'banned': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx`);
				const findJid = axly.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
				const nmrnya = axly.findJidByLid(klss, store, true);
				if (db.users[nmrnya] && !db.users[nmrnya].ban) {
					db.users[nmrnya].ban = true;
					m.reply(global.mess.done);
				} else m.reply('User tidak terdaftar di database!');
			}
				break;
			case 'unban': case 'unbanned': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx`);
				const findJid = axly.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
				const nmrnya = axly.findJidByLid(klss, store, true);
				if (db.users[nmrnya] && db.users[nmrnya].ban) {
					db.users[nmrnya].ban = false;
					m.reply(global.mess.done);
				} else m.reply('User tidak terdaftar di database!');
			}
				break;
			case 'mute': case 'unmute': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!m.isGroup) return m.reply(global.mess.group);
				if (command == 'mute') {
					db.groups[m.chat].mute = true;
					m.reply('Bot Telah Di Mute Di Grup Ini!');
				} else if (command == 'unmute') {
					db.groups[m.chat].mute = false;
					m.reply(global.mess.done + ' Unmute');
				}
			}
				break;
			case 'addowner': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx`);
				const nmrnya = axly.findJidByLid(text.replace(/[^0-9]/g, ''), store, true);
				const onWa = await axly.onWhatsApp(nmrnya);
				if (!onWa.length > 0) return m.reply(global.mess.onWa);
				if (set?.owner) {
					if (set.owner.find(a => nmrnya.includes(a))) return m.reply('Nomer Tersebut Sudah Ada Di Owner!');
					set.owner.push(nmrnya.split('@')[0]);
					await updateSettings({
						filePath: settingsPath,
						owner: set.owner
					});
				}
				m.reply(global.mess.done);
			}
				break;
			case 'delowner': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx`);
				const nmrnya = axly.findJidByLid(text.replace(/[^0-9]/g, ''), store, true);
				const onWa = await axly.onWhatsApp(nmrnya);
				if (!onWa.length > 0) return m.reply(global.mess.onWa);
				if (botNumber === nmrnya) return m.reply('Nomer Bot Tidak Boleh dihapus dari owner!');
				let list = set.owner;
				const index = list.findIndex(o => o === nmrnya.split('@')[0]);
				if (index === -1) return m.reply('Owner tidak ditemukan di daftar!');
				list.splice(index, 1);
				await updateSettings({
					filePath: settingsPath,
					owner: set.owner
				});
				m.reply(global.mess.done);
			}
				break;
			case 'adduang': case 'addmoney': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!args[0] || !args[1] || isNaN(args[1])) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx 1000`);
				if (args[1].length > 15) return m.reply('Jumlah Money Maksimal 15 digit angka!');
				const findJid = axly.findJidByLid(args[0].replace(/[^0-9]/g, '') + '@lid', store);
				const klss = args[0].replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
				const nmrnya = axly.findJidByLid(klss, store, true);
				const onWa = await axly.onWhatsApp(nmrnya);
				if (!onWa.length > 0) return m.reply(global.mess.onWa);
				if (db.users[nmrnya] && db.users[nmrnya].money >= 0) {
					addMoney(args[1], nmrnya, db);
					m.reply(global.mess.done);
				} else m.reply('User tidak terdaftar di database!');
			}
				break;
			case 'addlimit': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!args[0] || !args[1] || isNaN(args[1])) return m.reply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx 10`);
				if (args[1].length > 10) return m.reply('Jumlah Limit Maksimal 10 digit angka!');
				const findJid = axly.findJidByLid(args[0].replace(/[^0-9]/g, '') + '@lid', store);
				const klss = args[0].replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
				const nmrnya = axly.findJidByLid(klss, store, true);
				const onWa = await axly.onWhatsApp(nmrnya);
				if (!onWa.length > 0) return m.reply(global.mess.onWa);
				if (db.users[nmrnya] && db.users[nmrnya].limit >= 0) {
					addLimit(args[1], nmrnya, db);
					m.reply(global.mess.done);
				} else m.reply('User tidak terdaftar di database!');
			}
				break;
			case 'listpc': {
				if (!isCreator) return m.reply(global.mess.owner);
				let anu = Object.keys(store.messages).filter(a => a.endsWith('.net') || a.endsWith('lid'));
				let teks = `● *LIST PERSONAL CHAT*\n\nTotal Chat : ${anu.length} Chat\n\n`;
				if (anu.length === 0) return m.reply(teks);
				for (let i of anu) {
					if (store.messages?.[i]?.array?.length) {
						let nama = await axly.getName(i);
						teks += `${setv} *Nama :* ${nama}\n${setv} *User :* @${i.split('@')[0]}\n${setv} *Chat :* https://wa.me/${i.split('@')[0]}\n\n=====================\n\n`;
					}
				}
				await m.reply(teks);
			}
				break;
			case 'listgc': {
				if (!isCreator) return m.reply(global.mess.owner);
				let anu = Object.keys(store.messages).filter(a => a.endsWith('@g.us'));
				let teks = `● *LIST GROUP CHAT*\n\nTotal Group : ${anu.length} Group\n\n`;
				if (anu.length === 0) return m.reply(teks);
				for (let i of anu) {
					let metadata;
					try {
						metadata = store.groupMetadata[i];
					} catch (e) {
						metadata = (store.groupMetadata[i] = await axly.groupMetadata(i).catch(e => ({})));
					}
					teks += metadata?.subject ? `${setv} *Nama :* ${metadata.subject}\n${setv} *Admin :* ${metadata.ownerPn ? `@${metadata.ownerPn.split('@')[0]}` : '-'}\n${setv} *ID :* ${metadata.id}\n${setv} *Dibuat :* ${moment(metadata.creation * 1000).tz(global.timezone).format('DD/MM/YYYY HH:mm:ss')}\n${setv} *Member :* ${metadata.participants.length}\n\n=====================\n\n` : '';
				}
				await m.reply(teks);
			}
				break;
			case 'creategc': case 'buatgc': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`Example:\n${prefix + command} *Nama Gc*`);
				let group = await axly.groupCreate(q, [m.sender]);
				let res = await axly.groupInviteCode(group.id);
				await m.reply(`*Link Group :* *https://chat.whatsapp.com/${res}*\n\n*Nama Group :* *${group.subject}*\nSegera Masuk dalam 30 detik\nAgar menjadi Admin`, { detectLink: true });
				await sleep(30000);
				await axly.groupParticipantsUpdate(group.id, [m.sender], 'promote').catch(e => { });
				await axly.sendMessage(group.id, { text: global.mess.done });
			}
				break;
			case 'addsewa': case 'sewa': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`Example:\n${prefix + command} https://chat.whatsapp.com/xxx | waktu\n${prefix + command} https://chat.whatsapp.com/xxx | 30 hari`);
				let [teks1, teks2] = text.split('|')?.map(x => x.trim()) || [];
				if (!isUrl(teks1) && !teks1.includes('chat.whatsapp.com/')) return m.reply('Link Invalid!');
				const urlny = teks1.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
				if (!urlny) return m.reply('Link Invalid❗');
				try {
					await axly.groupAcceptInvite(urlny[1]);
				} catch (e) {
					if (e.data == 400) return m.reply('Grup Tidak Di Temukan❗');
					if (e.data == 401) return m.reply('Bot Di Kick Dari Grup Tersebut❗');
					if (e.data == 410) return m.reply('Url Grup Telah Di Setel Ulang❗');
					if (e.data == 500) return m.reply('Grup Penuh❗');
				}
				await axly.groupGetInviteInfo(urlny[1]).then(a => {
					addExpired({ url: urlny[1], expired: (teks2?.replace(/[^0-9]/g, '') || 30) + 'd', id: a.id }, sewa);
					m.reply('Sukses Menambahkan Sewa Selama ' + (teks2?.replace(/[^0-9]/g, '') || 30) + ' hari\nOtomatis Keluar Saat Waktu Habis!');
				}).catch(e => m.reply('Gagal Menambahkan Sewa!'));
			}
				break;
			case 'delsewa': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`Example:\n${prefix + command} https://chat.whatsapp.com/xxxx\n Or \n${prefix + command} id_group@g.us`);
				let urlny;
				if (text.includes('chat.whatsapp.com/')) {
					urlny = text.match(/chat\.whatsapp\.com\/([0-9A-Za-z]+)/)[1];
				} else if (/@g\.us$/.test(text)) {
					urlny = text.trim();
				} else {
					return m.reply('Format tidak valid❗');
				}
				if (checkStatus(urlny, sewa)) {
					await m.reply(global.mess.done);
					await axly.groupLeave(getStatus(urlny, sewa).id).catch(e => { });
					sewa.splice(getPosition(urlny, sewa), 1);
				} else m.reply(`${text} Tidak Terdaftar Di Database\nExample:\n${prefix + command} https://chat.whatsapp.com/xxxx\n Or \n${prefix + command} id_group@g.us`);
			}
				break;
			case 'listsewa': {
				if (!isCreator) return m.reply(global.mess.owner);
				let txt = `*------「 LIST SEWA 」------*\n\n`;
				for (let s of sewa) {
					txt += `➸ *ID*: ${s.id}\n➸ *Url*: https://chat.whatsapp.com/${s.url}\n➸ *Expired*: ${formatDate(s.expired)}\n\n`;
				}
				m.reply(txt);
			}
				break;
			case 'addpr': case 'addprem': case 'addpremium': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`Example:\n${prefix + command} @tag|waktu\n${prefix + command} @${m.sender.split('@')[0]}|30 hari`);
				let [teks1, teks2] = text.split('|').map(x => x.trim());
				const findJid = axly.findJidByLid(teks1.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = teks1.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
				const nmrnya = axly.findJidByLid(klss, store, true);
				const onWa = await axly.onWhatsApp(nmrnya);
				if (!onWa.length > 0) return m.reply(global.mess.onWa);
				if (teks2) {
					if (db.users[nmrnya] && db.users[nmrnya].limit >= 0) {
						addExpired({ id: nmrnya, expired: teks2.replace(/[^0-9]/g, '') + 'd' }, premium);
						m.reply(`Sukses ${command} @${nmrnya.split('@')[0]} Selama ${teks2}`);
						db.users[nmrnya].limit += db.users[nmrnya].vip ? global.limit.vip : global.limit.premium;
						db.users[nmrnya].money += db.users[nmrnya].vip ? global.money.vip : global.money.premium;
					} else m.reply('Nomer tidak terdaftar di BOT !\nPastikan Nomer Pernah Menggunakan BOT!');
				} else m.reply(`Masukkan waktunya!\Example:\n${prefix + command} @tag|waktu\n${prefix + command} @${m.sender.split('@')[0]}|30d\n_d = day_`);
			}
				break;
			case 'delpr': case 'delprem': case 'delpremium': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply(`Example:\n${prefix + command} @tag`);
				const findJid = axly.findJidByLid(text.replace(/[^0-9]/g, '') + '@lid', store);
				const klss = text.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
				const nmrnya = axly.findJidByLid(klss, store, true);
				if (db.users[nmrnya] && db.users[nmrnya].limit >= 0) {
					if (checkStatus(nmrnya, premium)) {
						premium.splice(getPosition(nmrnya, premium), 1);
						m.reply(`Sukses ${command} @${nmrnya.split('@')[0]}`);
						db.users[nmrnya].limit += db.users[nmrnya].vip ? global.limit.vip : global.limit.free;
						db.users[nmrnya].money += db.users[nmrnya].vip ? global.money.vip : global.money.free;
					} else m.reply(`User @${nmrnya.split('@')[0]} Bukan Premium❗`);
				} else m.reply('Nomer tidak terdaftar di BOT !');
			}
				break;
			case 'listpr': case 'listprem': case 'listpremium': {
				if (!isCreator) return m.reply(global.mess.owner);
				let txt = `*------「 LIST PREMIUM 」------*\n\n`;
				for (let userprem of premium) {
					txt += `➸ *Nomer*: @${userprem.id.split('@')[0]}\n➸ *Limit*: ${db.users[userprem.id].limit}\n➸ *Money*: ${db.users[userprem.id].money.toLocaleString('id-ID')}\n➸ *Expired*: ${formatDate(userprem.expired)}\n\n`;
				}
				m.reply(txt);
			}
				break;
			case 'upsw': {
				if (!isCreator) return m.reply(global.mess.owner);
				const statusJidList = Object.keys(db.users);
				const backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
				try {
					if (quoted.isMedia) {
						let media = await axly.downloadAndSaveMediaMessage(qmsg);
						try {
							if (/image|video/.test(quoted.mime)) {
								await axly.sendMessage('status@broadcast', {
									[`${quoted.mime.split('/')[0]}`]: { url: media },
									caption: text || m.quoted?.body || ''
								}, { statusJidList, broadcast: true });
								m.react('✅');
							} else if (/audio/.test(quoted.mime)) {
								await axly.sendMessage('status@broadcast', {
									audio: { url: media },
									mimetype: 'audio/mp4',
									ptt: true
								}, { backgroundColor, statusJidList, broadcast: true });
								m.react('✅');
							} else m.reply('Only Support video/audio/image/text');
						} finally {
							if (fs.existsSync(media)) fs.unlinkSync(media);
						}
					} else if (quoted.text) {
						await axly.sendMessage('status@broadcast', { text: text || m.quoted?.body || '' }, {
							textArgb: 0xffffffff,
							font: Math.floor(Math.random() * 9),
							backgroundColor, statusJidList,
							broadcast: true
						});
						m.react('✅');
					} else m.reply('Only Support video/audio/image/text');
				} catch (e) {
					m.reply(global.mess.fail);
				}
			}
				break;
			case 'addcase': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text && !text.startsWith('case')) return m.reply('Masukkan Casenya!');
				fs.readFile(__filename, 'utf8', (err, data) => {
					if (err) {
						console.error('Terjadi kesalahan saat membaca file:', err);
						return;
					}
					const posisi = data.indexOf("case '19rujxl1e':");
					if (posisi !== -1) {
						const codeBaru = data.slice(0, posisi) + '\n' + `${text}` + '\n' + data.slice(posisi);
						fs.writeFile(__filename, codeBaru, 'utf8', (err) => {
							if (err) {
								m.reply('Terjadi kesalahan saat menulis file: ', err);
							} else m.reply(global.mess.done);
						});
					} else m.reply(global.mess.fail);
				});
			}
				break;
			case 'getcase': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply('Masukkan Nama Casenya!');
				try {
					const getCase = (cases) => {
						return "case" + `'${cases}'` + fs.readFileSync(__filename).toString().split('case \'' + cases + '\'')[1].split("break")[0] + "break";
					};
					m.reply(`${getCase(text)}`);
				} catch (e) {
					m.reply(`case ${text} tidak ditemukan!`);
				}
			}
				break;
			case 'delcase': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!text) return m.reply('Masukkan Nama Casenya!');
				fs.readFile(__filename, 'utf8', (err, data) => {
					if (err) {
						console.error('Terjadi kesalahan saat membaca file:', err);
						return;
					}
					const regex = new RegExp(`case\\s+'${text.toLowerCase()}':[\\s\\S]*?break`, 'g');
					const modifiedData = data.replace(regex, '');
					fs.writeFile(__filename, modifiedData, 'utf8', (err) => {
						if (err) {
							console.log(err);
							m.reply(global.mess.fail);
						} else m.reply(global.mess.done);
					});
				});
			}
				break;
			case 'backup': {
				if (!isCreator) return m.reply(global.mess.owner);
				switch (args[0]) {
					case 'all':
						let bekup = './database/backup_all.tar.gz';
						tarBackup('./', bekup).then(() => {
							return m.reply({
								document: fs.readFileSync(bekup),
								mimetype: 'application/gzip',
								fileName: 'backup_all.tar.gz'
							});
						}).catch(e => m.reply('Gagal backup: ', +e));
						break;
					case 'auto':
						if (set.autobackup) return m.reply('Sudah Aktif Sebelumnya!');
						set.autobackup = true;
						m.reply('Sukses Mengaktifkan Auto Backup');
						break;
					case 'session':
						await m.reply({
							document: fs.readFileSync('./axly/creds.json'),
							mimetype: 'application/json',
							fileName: 'creds.json'
						});
						break;
					case 'database':
						let tglnya = new Date().toISOString().replace(/[:.]/g, '-');
						let datanya = './database/' + global.tempatDB;
						if (global.tempatDB.startsWith('mongodb')) {
							datanya = './database/backup_database.json';
							fs.writeFileSync(datanya, JSON.stringify(global.db, null, 2), 'utf-8');
						}
						await m.reply({
							document: fs.readFileSync(datanya),
							mimetype: 'application/json',
							fileName: tglnya + '_database.json'
						});
						break;
					default:
						m.reply('Gunakan perintah:\n- backup all\n- backup auto\n- backup session\n- backup database');
				}
			}
				break;
			case 'getsession': {
				if (!isCreator) return m.reply(global.mess.owner);
				await m.reply({
					document: fs.readFileSync('./axly/creds.json'),
					mimetype: 'application/json',
					fileName: 'creds.json'
				});
			}
				break;
			case 'deletesession': case 'delsession': {
				if (!isCreator) return m.reply(global.mess.owner);
				fs.readdir('./axly', async function (err, files) {
					if (err) {
						console.error('Unable to scan directory: ' + err);
						return m.reply('Unable to scan directory: ' + err);
					}
					let filteredArray = await files.filter(item => ['session-', 'pre-key', 'sender-key', 'app-state'].some(ext => item.startsWith(ext)));
					let teks = `Terdeteksi ${filteredArray.length} Session file\n\n`;
					if (filteredArray.length == 0) return m.reply(teks);
					filteredArray.map(function (e, i) {
						teks += (i + 1) + `. ${e}\n`;
					});
					if (text && text == 'true') {
						let { key } = await m.reply('Menghapus Session File..');
						await filteredArray.forEach(function (file) {
							fs.unlinkSync('./axly/' + file);
						});
						sleep(2000);
						m.reply('Berhasil Menghapus Semua Sampah Session', { edit: key });
					} else m.reply(teks + `\nKetik _${prefix + command} true_\nUntuk Menghapus`);
				});
			}
				break;
			case 'deletesampah': case 'delsampah': case 'deletetemp': case 'deltemp': {
				if (!isCreator) return m.reply(global.mess.owner);
				fs.readdir('./database/temp', async function (err, files) {
					if (err) {
						console.error('Unable to scan directory: ' + err);
						return m.reply('Unable to scan directory: ' + err);
					}
					let filteredArray = await files.filter(item => ['gif', 'png', 'bin', 'mp3', 'mp4', 'jpg', 'webp', 'webm', 'opus', 'jpeg'].some(ext => item.endsWith(ext)));
					let teks = `Terdeteksi ${filteredArray.length} Sampah file\n\n`;
					if (filteredArray.length == 0) return m.reply(teks);
					filteredArray.map(function (e, i) {
						teks += (i + 1) + `. ${e}\n`;
					});
					if (text && text == 'true') {
						let { key } = await m.reply('Menghapus Sampah File..');
						await filteredArray.forEach(function (file) {
							fs.unlinkSync('./database/temp/' + file);
						});
						sleep(2000);
						m.reply('Berhasil Menghapus Semua Sampah', { edit: key });
					} else m.reply(teks + `\nKetik _${prefix + command} true_\nUntuk Menghapus`);
				});
			}
				break;
			case 'setmessbot': case 'setbotmessages': {
				if (!isCreator) return m.reply(global.mess.owner);
				const res = await fetchJson('https://raw.githubusercontent.com/axlydev/database/refs/heads/master/bot/lang.json');
				if (res.some(a => a.lang === text)) {
					const selectedLang = res.find(a => a.lang === text);
					await updateSettings({
						filePath: settingsPath,
						newMess: selectedLang.messages
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} en\n*List Lang :*\n${res.map(a => '- ' + a.lang).join('\n')}`);
			}
				break;
			case 'setlimitbot': case 'setbotlimit': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (['free', 'premium', 'vip'].includes(args[0]) && !isNaN(args[1])) {
					await updateSettings({
						filePath: settingsPath,
						setLimitRole: { role: args[0], value: Number(args[1]) }
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} premium 10000\n*List Membership :*\n- free ${global.limit.free}\n- premium ${global.limit.premium}\n- vip ${global.limit.vip}`);
			}
				break;
			case 'setmoneybot': case 'setbotmoney': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (['free', 'premium', 'vip'].includes(args[0]) && !isNaN(args[1])) {
					await updateSettings({
						filePath: settingsPath,
						setMoneyRole: { role: args[0], value: Number(args[1]) }
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} premium 10000\n*List Membership :*\n- free ${global.money.free}\n- premium ${global.money.premium}\n- vip ${global.money.vip}`);
			}
				break;
			case 'setnamebot': case 'setbotname': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					await updateSettings({
						filePath: settingsPath,
						botname: teksnya.trim()
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} Hitori bot`);
			}
				break;
			case 'setpacknamebot': case 'setbotpackname': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					await updateSettings({
						filePath: settingsPath,
						packname: teksnya.trim()
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} By Hitori bot`);
			}
				break;
			case 'setauthorbot': case 'setbotauthor': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					await updateSettings({
						filePath: settingsPath,
						author: teksnya.trim()
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} Axly`);
			}
				break;
			case 'setlocale': case 'setlocalebot': case 'setbotlocale': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					if (!locales.includes(teksnya)) return m.reply('Locale List:\n' + locales.map(a => '- ' + a).join('\n'));
					await updateSettings({
						filePath: settingsPath,
						locale: teksnya.trim()
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} en`);
			}
				break;
			case 'settimezone': case 'settimezonebot': case 'setbottimezone': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					if (!timez.includes(teksnya)) return m.reply('Timezone List:\n' + timez.map(a => '- ' + a).join('\n'));
					await updateSettings({
						filePath: settingsPath,
						timezone: teksnya.trim()
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} Asia/Jakarta`);
			}
				break;

			case 'addprefix': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					await updateSettings({
						filePath: settingsPath,
						addPrefix: teksnya.trim()
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} textnya`);
			}
				break;
			case 'delprefix': case 'removeprefix': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					await updateSettings({
						filePath: settingsPath,
						removePrefix: teksnya.trim()
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} textnya`);
			}
				break;
			case 'addtoxic': case 'addbadword': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					await updateSettings({
						filePath: settingsPath,
						addBadword: teksnya.trim()
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} textnya`);
			}
				break;
			case 'deltoxic': case 'delbadword': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					await updateSettings({
						filePath: settingsPath,
						removeBadword: teksnya.trim()
					});
					m.reply(global.mess.done);
				} else m.reply(`Example: ${prefix + command} textnya`);
			}
				break;
			case 'sc': case 'script': {
				await m.reply(`https://github.com/axlydev/hitori\n⬆️ Itu Sc nya cuy`, {
					contextInfo: {
						forwardingScore: 10,
						isForwarded: true,
						forwardedNewsletterMessageInfo: {
							newsletterJid: global.my.ch,
							serverMessageId: null,
							newsletterName: 'Join For More Info'
						},
						externalAdReply: {
							title: author,
							body: 'Subscribe My YouTube',
							thumbnail: global.fake.thumbnail,
							mediaType: 2,
							mediaUrl: global.my.yt,
							sourceUrl: global.my.yt,
						}
					}
				});
			}
				break;
			case 'donasi': case 'donate': {
				m.reply('Donasi ? gabutuh');
			}
				break;

			// Group Menu
			case 'add': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
					const findJid = axly.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
					const nmrnya = axly.findJidByLid(klss, store, true);
					try {
						await axly.groupParticipantsUpdate(m.chat, [nmrnya], 'add').then(async (res) => {
							for (let i of res) {
								let invv = await axly.groupInviteCode(m.chat);
								const statusMessages = {
									200: `Berhasil menambahkan @${nmrnya.split('@')[0]} ke grup!`,
									401: 'Dia Memblokir Bot!',
									409: 'Dia Sudah Join!',
									500: 'Grup Penuh!'
								};
								if (statusMessages[i.status]) {
									return m.reply(statusMessages[i.status]);
								} else if (i.status == 408) {
									await m.reply(`@${nmrnya.split('@')[0]} Baru-Baru Saja Keluar Dari Grub Ini!\n\nKarena Target Private\n\nUndangan Akan Dikirimkan Ke\n-> wa.me/${nmrnya.replace(/\D/g, '')}\nMelalui Jalur Pribadi`);
									await m.reply(`${'https://chat.whatsapp.com/' + invv}\n------------------------------------------------------\n\nAdmin: @${m.sender.split('@')[0]}\nMengundang anda ke group ini\nSilahkan masuk jika berkehendak🙇`, { detectLink: true, chat: nmrnya, quoted: fkontak }).catch((err) => m.reply('Gagal Mengirim Undangan!'));
								} else if (i.status == 403) {
									let a = i.content.content[0].attrs;
									await axly.sendGroupInviteV4(m.chat, nmrnya, a.code, a.expiration, m.metadata.subject, `Admin: @${m.sender.split('@')[0]}\nMengundang anda ke group ini\nSilahkan masuk jika berkehendak🙇`, null, { mentions: [m.sender] });
									await m.reply(`@${nmrnya.split('@')[0]} Tidak Dapat Ditambahkan\n\nKarena Target Private\n\nUndangan Akan Dikirimkan Ke\n-> wa.me/${nmrnya.replace(/\D/g, '')}\nMelalui Jalur Pribadi`);
								} else m.reply('Gagal Add User\nStatus : ' + i.status);
							}
						});
					} catch (e) {
						m.reply(global.mess.fail);
					}
				} else m.reply(`Example: ${prefix + command} 62xxx`);
			}
				break;
			case 'kick': case 'dor': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
					const findJid = axly.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
					const nmrnya = axly.findJidByLid(klss, store, true);
					await axly.groupParticipantsUpdate(m.chat, [nmrnya], 'remove').catch((err) => m.reply(global.mess.fail));
				} else m.reply(`Example: ${prefix + command} 62xxx`);
			}
				break;
			case 'promote': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
					const findJid = axly.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
					const nmrnya = axly.findJidByLid(klss, store, true);
					await axly.groupParticipantsUpdate(m.chat, [nmrnya], 'promote').catch((err) => m.reply(global.mess.fail));
				} else m.reply(`Example: ${prefix + command} 62xxx`);
			}
				break;
			case 'demote': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
					const findJid = axly.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
					const nmrnya = axly.findJidByLid(klss, store, true);
					await axly.groupParticipantsUpdate(m.chat, [nmrnya], 'demote').catch((err) => m.reply(global.mess.fail));
				} else m.reply(`Example: ${prefix + command} 62xxx`);
			}
				break;
			case 'warn': case 'warning': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
					const findJid = axly.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
					const nmrnya = axly.findJidByLid(klss, store, true);
					if (!db.groups[m.chat].warn[nmrnya]) {
						db.groups[m.chat].warn[nmrnya] = 1;
						m.reply('Warning 1/4, akan dikick sewaktu waktu❗');
					} else if (db.groups[m.chat].warn[nmrnya] >= 3) {
						await axly.groupParticipantsUpdate(m.chat, [nmrnya], 'remove').catch((err) => m.reply(global.mess.fail));
						delete db.groups[m.chat].warn[nmrnya];
					} else {
						db.groups[m.chat].warn[nmrnya] += 1;
						m.reply(`Warning ${db.groups[m.chat].warn[nmrnya]}/4, akan dikick sewaktu waktu❗`);
					}
				} else m.reply(`Example: ${prefix + command} 62xxx`);
			}
				break;
			case 'unwarn': case 'delwarn': case 'unwarning': case 'delwarning': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
					const findJid = axly.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' : '@s.whatsapp.net');
					const nmrnya = axly.findJidByLid(klss, store, true);
					if (db.groups[m.chat]?.warn?.[nmrnya]) {
						delete db.groups[m.chat].warn[nmrnya];
						m.reply('Berhasil Menghapus Warning!');
					}
				} else m.reply(`Example: ${prefix + command} 62xxx`);
			}
				break;
			case 'setname': case 'setnamegc': case 'setsubject': case 'setsubjectgc': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					await axly.groupUpdateSubject(m.chat, teksnya).catch((err) => m.reply(global.mess.fail));
				} else m.reply(`Example: ${prefix + command} textnya`);
			}
				break;
			case 'setdesc': case 'setdescgc': case 'setdesk': case 'setdeskgc': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (text || m.quoted) {
					const teksnya = text ? text : m.quoted.text;
					await axly.groupUpdateDescription(m.chat, teksnya).catch((err) => m.reply(global.mess.fail));
				} else m.reply(`Example: ${prefix + command} textnya`);
			}
				break;
			case 'setppgroups': case 'setppgrup': case 'setppgc': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (!m.quoted) return m.reply('Reply Gambar yang mau dipasang di Profile Bot');
				if (!/image/.test(quoted.type)) return m.reply(`Reply Image Dengan Caption ${prefix + command}`);
				let media = await quoted.download();
				let { img } = await generateProfilePicture(media, text.length > 0 ? null : 512);
				await axly.query({
					tag: 'iq',
					attrs: {
						target: m.chat,
						to: '@s.whatsapp.net',
						type: 'set',
						xmlns: 'w:profile:picture'
					},
					content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
				});
				m.reply(global.mess.done);
			}
				break;
			case 'delete': case 'del': case 'd': {
				if (!m.quoted) return m.reply(global.mess.quoted);
				await axly.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: m.isBotAdmin ? false : true, id: m.quoted.id, participant: m.quoted.sender } });
			}
				break;
			case 'sematkan': case 'unpin': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				await axly.sendMessage(m.chat, { pin: { type: command == 'pin' ? 1 : 0, time: 2592000, key: m.quoted ? m.quoted.key : m.key } });
			}
				break;
			case 'linkgroup': case 'linkgrup': case 'linkgc': case 'urlgroup': case 'urlgrup': case 'urlgc': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				let response = await axly.groupInviteCode(m.chat);
				await m.reply(`https://chat.whatsapp.com/${response}\n\nLink Group : ${(store.groupMetadata[m.chat] ? store.groupMetadata[m.chat] : (store.groupMetadata[m.chat] = await axly.groupMetadata(m.chat))).subject}`, { detectLink: true });
			}
				break;
			case 'revoke': case 'newlink': case 'newurl': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				await axly.groupRevokeInvite(m.chat).then((a) => {
					m.reply(`Sukses Menyetel Ulang, Tautan Undangan Grup ${m.metadata.subject}`);
				}).catch((err) => m.reply(global.mess.fail));
			}
				break;
			case 'group': case 'grup': case 'gc': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				let set = db.groups[m.chat];
				switch (args[0]?.toLowerCase()) {
					case 'close': case 'open':
						await axly.groupSettingUpdate(m.chat, args[0] == 'close' ? 'announcement' : 'not_announcement').then(a => m.reply(`*Sukses ${args[0] == 'open' ? 'Membuka' : 'Menutup'} Group*`));
						break;
					case 'join':
						const _list = await axly.groupRequestParticipantsList(m.chat).then(a => a.map(b => b.jid));
						if (/(a(p|pp|cc)|(ept|rove))|true|ok/i.test(args[1]) && _list.length > 0) {
							await axly.groupRequestParticipantsUpdate(m.chat, _list, 'approve').catch(e => m.react('❌'));
						} else if (/reject|false|no/i.test(args[1]) && _list.length > 0) {
							await axly.groupRequestParticipantsUpdate(m.chat, _list, 'reject').catch(e => m.react('❌'));
						} else m.reply(`List Request Join :\n${_list.length > 0 ? '- @' + _list.join('\n- @').split('@')[0] : '*Nothing*'}\nExample : ${prefix + command} join acc/reject`);
						break;
					case 'pesansementara': case 'disappearing':
						if (/90|7|1|24|on/i.test(args[1])) {
							axly.sendMessage(m.chat, { disappearingMessagesInChat: /90/i.test(args[1]) ? 7776000 : /7/i.test(args[1]) ? 604800 : 86400 });
						} else if (/0|off|false/i.test(args[1])) {
							axly.sendMessage(m.chat, { disappearingMessagesInChat: 0 });
						} else m.reply('Silahkan Pilih :\n90 hari, 7 hari, 1 hari, off');
						break;
					case 'antilink': case 'antivirtex': case 'antidelete': case 'welcome': case 'antitoxic': case 'waktusholat': case 'nsfw': case 'antihidetag': case 'setinfo': case 'antitagsw': case 'leave': case 'promote': case 'demote':
						if (/on|true/i.test(args[1])) {
							if (set[args[0]]) return m.reply('*Sudah Aktif Sebelumnya*');
							set[args[0]] = true;
							m.reply('*Sukses Change To On*');
						} else if (/off|false/i.test(args[1])) {
							set[args[0]] = false;
							m.reply('*Sukses Change To Off*');
						} else m.reply(`❗${args[0].charAt(0).toUpperCase() + args[0].slice(1)} on/off`);
						break;
					case 'setwelcome': case 'setleave': case 'setpromote': case 'setdemote':
						if (args[1]) {
							set.text[args[0]] = args.slice(1).join(' ');
							m.reply(`Sukses Mengubah ${args[0].split('set')[1]} Menjadi:\n${set.text[args[0]]}`);
						} else m.reply(`Example:\n${prefix + command} ${args[0]} Isi Pesannya\n\nMisal Dengan tag:\n${prefix + command} ${args[0]} Kepada @\nMaka akan Menjadi:\nKepada @0\n\nMisal dengan Tag admin:\n${prefix + command} ${args[0]} Dari @admin untuk @\nMaka akan Menjadi:\nDari @${m.sender.split('@')[0]} untuk @0\n\nMisal dengan Nama grup:\n${prefix + command} ${args[0]} Dari @admin untuk @ di @subject\nMaka akan Menjadi:\nDari @${m.sender.split('@')[0]} untuk @0 di ${m.metadata.subject}`, { mentions: ['0@s.whatsapp.net'] });
						break;
					default:
						m.reply(`Settings Group ${m.metadata.subject}\n- open\n- close\n- join acc/reject\n- disappearing 90/7/1/off\n- antilink on/off ${set.antilink ? '🟢' : '🔴'}\n- antivirtex on/off ${set.antivirtex ? '🟢' : '🔴'}\n- antidelete on/off ${set.antidelete ? '🟢' : '🔴'}\n- welcome on/off ${set.welcome ? '🟢' : '🔴'}\n- leave on/off ${set.leave ? '🟢' : '🔴'}\n- promote on/off ${set.promote ? '🟢' : '🔴'}\n- demote on/off ${set.demote ? '🟢' : '🔴'}\n- setinfo on/off ${set.setinfo ? '🟢' : '🔴'}\n- nsfw on/off ${set.nsfw ? '🟢' : '🔴'}\n- waktusholat on/off ${set.waktusholat ? '🟢' : '🔴'}\n- antihidetag on/off ${set.antihidetag ? '🟢' : '🔴'}\n- antitoxic on/off ${set.antitoxic ? '🟢' : '🔴'}\n- antitagsw on/off ${set.antitagsw ? '🟢' : '🔴'}\n\n- setwelcome _textnya_\n- setleave _textnya_\n- setpromote _textnya_\n- setdemote _textnya_\n\nExample:\n${prefix + command} antilink off`);
				}
			}
				break;
			case 'tagall': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				let setv = pickRandom(global.listv);
				let teks = `*Tag All*\n\n*Pesan :* ${q ? q : ''}\n\n`;
				for (let mem of m.metadata.participants) {
					teks += `${setv} @${mem.phoneNumber.split('@')[0]}\n`;
				}
				await m.reply(teks, { mentions: m.metadata.participants.map(a => a.phoneNumber) });
			}
				break;
			case 'hidetag': case 'h': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				await m.reply(q ? q : '', { mentions: m.metadata.participants.map(a => a.phoneNumber) });
			}
				break;
			case 'totag': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				if (!m.quoted) return m.reply(global.mess.quoted);
				delete m.quoted.chat;
				await axly.sendMessage(m.chat, { forward: m.quoted.fakeObj(), mentions: m.metadata.participants.map(a => a.phoneNumber) });
			}
				break;
			case 'listonline': case 'liston': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat;
				if (!store.presences || !store.presences[id]) return m.reply('Sedang Tidak ada yang online!');
				const groupPresences = store.presences[id];
				const metadata = store.groupMetadata[id];
				let list_online = [];
				if (metadata && metadata.participants) {
					for (const p of metadata.participants) {
						if (groupPresences[p.id]) {
							list_online.push(p.phoneNumber);
						}
					}
				}
				if (!list_online.includes(botNumber)) {
					list_online.push(botNumber);
				}
				if (list_online.length === 0) return m.reply('Sedang tidak ada yang online!');
				let textReply = '*List Online:*\n\n' + list_online.map(v => setv + ' @' + v.split('@')[0]).join('\n');
				await m.reply(textReply, { mentions: list_online }).catch(() => m.reply('Gagal menampilkan list online..'));
			}
				break;
			case 'totalpesan': case 'totalchat': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!m.isAdmin) return m.reply(global.mess.admin);
				if (!m.isBotAdmin) return m.reply(global.mess.botAdmin);
				let messageCount = {};
				let messages = store?.messages[m.chat]?.array || [];
				let participants = (m?.metadata?.participants?.map(p => p.phoneNumber) || store?.messages[m.chat]?.array?.map(p => p.key.participantAlt) || []).filter(p => p);
				messages.forEach(mes => {
					if (mes.key?.participantAlt && mes.message) {
						messageCount[mes.key.participantAlt] = (messageCount[mes.key.participantAlt] || 0) + 1;
					}
				});
				let totalMessages = Object.values(messageCount).reduce((a, b) => a + b, 0);
				let date = new Date().toLocaleDateString('id-ID');
				let zeroMessageUsers = participants.filter(user => !messageCount[user]).map(user => `- @${user.replace(/[^0-9]/g, '')}`);
				let messageList = Object.entries(messageCount).map(([sender, count], index) => `${index + 1}. @${sender.replace(/[^0-9]/g, '')}: ${count} Pesan`);
				let result = `Total Pesan ${totalMessages} dari ${participants.length} anggota\nPada tanggal ${date}:\n${messageList.join('\n')}\n\nNote: ${text.length > 0 ? `\n${zeroMessageUsers.length > 0 ? `Sisa Anggota yang tidak mengirim pesan (Sider):\n${zeroMessageUsers.join('\n')}` : 'Semua anggota sudah mengirim pesan!'}` : `\nCek Sider? ${prefix + command} --sider`}`;
				m.reply(result);
			}
				break;

			// Bot Menu
			case 'owner': case 'listowner': {
				await axly.sendContact(m.chat, ownerNumber, m);
			}
				break;
			case 'profile': case 'cek': {
				const user = Object.keys(db.users);
				const infoUser = db.users[m.sender];
				await m.reply(`*👤Profile @${m.sender.split('@')[0]}* :\n🐋User Bot : ${user.includes(m.sender) ? 'True' : 'False'}\n🔥User : ${isVip ? 'VIP' : isPremium ? 'PREMIUM' : 'FREE'}${isPremium ? `\n⏳Expired : ${checkStatus(m.sender, premium) ? formatDate(getExpired(m.sender, db.premium)) : '-'}` : ''}\n🎫Limit : ${infoUser.limit}\n💰Uang : ${infoUser ? infoUser.money.toLocaleString('id-ID') : '0'}`);
			}
				break;
			case 'leaderboard': {
				const entries = Object.entries(db.users).sort((a, b) => b[1].money - a[1].money).slice(0, 10).map(entry => entry[0]);
				let teksnya = '╭──❍「 *LEADERBOARD* 」❍\n';
				for (let i = 0; i < entries.length; i++) {
					teksnya += `│• ${i + 1}. @${entries[i].split('@')[0]}\n│• Balance : ${db.users[entries[i]].money.toLocaleString('id-ID')}\n│\n`;
				}
				m.reply(teksnya + '╰──────❍');
			}
				break;
			case 'req': case 'request': {
				if (!text) return m.reply('Mau Request apa ke Owner?');
				await m.reply(`*Request Telah Terkirim Ke Owner*\n_Terima Kasih🙏_`);
				await axly.sendFromOwner(ownerNumber, `Pesan Dari : @${m.sender.split('@')[0]}\nUntuk Owner\n\nRequest ${text}`, m, { contextInfo: { mentionedJid: [m.sender], isForwarded: true } });
			}
				break;
			case 'totalfitur': {
				const total = ((fs.readFileSync(__filename).toString()).match(/case '/g) || []).length;
				m.reply(`Total Fitur : ${total}`);
			}
				break;
			case 'daily': case 'claim': {
				daily(m, db);
			}
				break;
			case 'transfer': case 'tf': {
				transfer(m, args, db);
			}
				break;
			case 'buy': {
				buy(m, args, db);
			}
				break;
			case 'react': {
				axly.sendMessage(m.chat, { react: { text: args[0], key: m.quoted ? m.quoted.key : m.key } });
			}
				break;
			case 'tagme': {
				m.reply(`@${m.sender.split('@')[0]}`, { mentions: [m.sender] });
			}
				break;
			case 'runtime': case 'tes': case 'bot': {
				if (!args[0] && !args[1]) return m.reply(`*Bot Telah Online Selama*\n*${runtime(process.uptime())}*`);
				switch (args[0]) {
					case 'mode': case 'public': case 'self':
						if (!isCreator) return m.reply(global.mess.owner);
						if (args[1] == 'public' || args[1] == 'all') {
							if (axly.public && set.grouponly && set.privateonly) return m.reply('*Sudah Aktif Sebelumnya*');
							axly.public = set.public = true;
							set.grouponly = true;
							set.privateonly = true;
							m.reply('*Sukses Change To Public Usage*');
						} else if (args[1] == 'self') {
							set.grouponly = false;
							set.privateonly = false;
							axly.public = set.public = false;
							m.reply('*Sukses Change To Self Usage*');
						} else if (args[1] == 'group') {
							set.grouponly = true;
							set.privateonly = false;
							m.reply('*Sukses Change To Group Only*');
						} else if (args[1] == 'private') {
							set.grouponly = false;
							set.privateonly = true;
							m.reply('*Sukses Change To Private Only*');
						} else m.reply('Mode self/public/group/private/all');
						break;
					case 'log': case 'anticall': case 'autobio': case 'autoread': case 'autotyping': case 'readsw': case 'multiprefix': case 'antispam': case 'didyoumean':
						if (!isCreator) return m.reply(global.mess.owner);
						if (args[1] == 'on') {
							if (set[args[0]]) return m.reply('*Sudah Aktif Sebelumnya*');
							set[args[0]] = true;
							m.reply('*Sukses Change To On*');
						} else if (args[1] == 'off') {
							set[args[0]] = false;
							m.reply('*Sukses Change To Off*');
						} else m.reply(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} on/off`);
						break;
					case 'set': case 'settings':
						let settingsBot = Object.entries(set).map(([key, value]) => {
							let list = key == 'status' ? new Date(value).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : (typeof value === 'boolean') ? (value ? 'on🟢' : 'off🔴') : (typeof value === 'object') ? `\n${value.map(a => '- ' + a).join('\n')}` : value;
							return `- ${key.charAt(0).toUpperCase() + key.slice(1)} : ${list}`;
						}).join('\n');
						m.reply(`Settings Bot @${botNumber.split('@')[0]}\n${settingsBot}\n\nExample: ${prefix + command} mode`);
						break;
					case 'author': case 'authorprefix':
						if (!isCreator) return m.reply(global.mess.owner);
						if (args[1] == 'on') {
							set.authorPrefix = '.';
							m.reply(global.mess.done);
						} else if (args[1] == 'off') {
							set.authorPrefix = '';
							m.reply(global.mess.done);
						} else m.reply(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} on/off`);
						break;
					default: {
						let menuList = `*⚙️ SETTINGS BOT ⚙️*
					
Select Bot Settings:

*👥 Mode Penggunaan:*
- Mode Bot : *${prefix + command} mode [public/self/group/private]*

*🎛️ Fitur Otomatis (on/off):*
- Anti Call : *${prefix + command} anticall [on/off]*
- Anti Spam : *${prefix + command} antispam [on/off]*
- Auto Bio : *${prefix + command} autobio [on/off]*
- Auto Read : *${prefix + command} autoread [on/off]*
- Auto Typing : *${prefix + command} autotyping [on/off]*
- Read Status/SW : *${prefix + command} readsw [on/off]*

*🛠️ System Settings:*
- Multi Prefix : *${prefix + command} multiprefix [on/off]*
- Did You Mean : *${prefix + command} didyoumean [on/off]*
- Log Console : *${prefix + command} log [on/off]*
- Author Prefix : *${prefix + command} author [on/off]*

*📊 Info & Status:*
- Cek Semua Setting : *${prefix + command} set*
- Cek Runtime Bot : *${prefix + command}*`;
						if (args[0] || args[1]) m.reply(menuList);
					}
				}
			}
				break;
			case 'ping': case 'botstatus': case 'statusbot': {
				const used = process.memoryUsage();
				const cpus = os.cpus().map(cpu => {
					cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
					return cpu;
				});
				const cpu = cpus.reduce((last, cpu, _, { length }) => {
					last.total += cpu.total;
					last.speed += cpu.speed / length;
					last.times.user += cpu.times.user;
					last.times.nice += cpu.times.nice;
					last.times.sys += cpu.times.sys;
					last.times.idle += cpu.times.idle;
					last.times.irq += cpu.times.irq;
					return last;
				}, {
					speed: 0,
					total: 0,
					times: {
						user: 0,
						nice: 0,
						sys: 0,
						idle: 0,
						irq: 0
					}
				});
				let timestamp = speed();
				let latensi = speed() - timestamp;
				let neww = performance.now();
				let oldd = performance.now();
				let respon = `Kecepatan Respon ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${runtime(process.uptime())}\n\n💻 Info Server\nRAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}\n\n_NodeJS Memory Usaage_\n${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${formatp(used[key])}`).join('\n')}\n\n${cpus[0] ? `_Total CPU Usage_\n${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}\n_CPU Core(s) Usage (${cpus.length} Core CPU)_\n${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}`.trim();
				m.reply(respon);
			}
				break;
			case 'speedtest': case 'speed': {
				m.reply('Testing Speed...');
				let cp = require('child_process');
				let { promisify } = require('util');
				let exec = promisify(cp.exec).bind(cp);
				let o;
				try {
					o = await exec('python3 speed.py --share');
				} catch (e) {
					o = e;
				} finally {
					let { stdout, stderr } = o;
					if (stdout.trim()) m.reply(stdout);
					if (stderr.trim()) m.reply(stderr);
				}
			}
				break;
			case 'afk': {
				let user = db.users[m.sender];
				user.afkTime = +new Date;
				user.afkReason = text;
				m.reply(`@${m.sender.split('@')[0]} Telah Afk${text ? ': ' + text : ''}`);
			}
				break;
			case 'readviewonce': case 'readviewone': case 'rvo': {
				if (!m.quoted) return m.reply(global.mess.quoted);
				try {
					if (m.quoted.msg.viewOnce) {
						delete m.quoted.chat;
						m.quoted.msg.viewOnce = false;
						await m.reply({ forward: m.quoted });
					} else m.reply(`Reply view once message\nExample: ${prefix + command}`);
				} catch (e) {
					m.reply('Media Tidak Valid!');
				}
			}
				break;
			case 'inspect': case 'cekidch': case 'idch': {
				if (!text) return m.reply('Masukkan Link Grup atau Saluran!');
				let _grup = /chat.whatsapp.com\/([\w\d]*)/;
				let _saluran = /whatsapp\.com\/channel\/([\w\d]*)/;
				if (_grup.test(text)) {
					await axly.groupGetInviteInfo(text.match(_grup)[1]).then((_g) => {
						let teks = `*[ INFORMATION GROUP ]*\n\nName Group: ${_g.subject}\nGroup ID: ${_g.id}\nCreate At: ${new Date(_g.creation * 1000).toLocaleString()}${_g.owner ? ('\nCreate By: ' + _g.owner) : ''}\nLinked Parent: ${_g.linkedParent}\nRestrict: ${_g.restrict}\nAnnounce: ${_g.announce}\nIs Community: ${_g.isCommunity}\nCommunity Announce:${_g.isCommunityAnnounce}\nJoin Approval: ${_g.joinApprovalMode}\nMember Add Mode: ${_g.memberAddMode}\nDescription ID: ${'`' + _g.descId + '`'}\nDescription: ${_g.desc}\nParticipants:\n`;
						_g.participants.forEach((a) => {
							teks += a.admin ? `- Admin: @${a.id.split('@')[0]} [${a.admin}]\n` : '';
						});
						m.reply(teks);
					}).catch((e) => {
						if ([400, 406].includes(e.data)) return m.reply('Grup Tidak Di Temukan❗');
						if (e.data == 401) return m.reply('Bot Di Kick Dari Grup Tersebut❗');
						if (e.data == 410) return m.reply('Url Grup Telah Di Setel Ulang❗');
					});
				} else if (_saluran.test(text) || text.endsWith('@newsletter') || !isNaN(text)) {
					await axly.newsletterMsg(text.match(_saluran)[1]).then((n) => {
						m.reply(`*[ INFORMATION CHANNEL ]*\n\nID: ${n.id}\nState: ${n.state.type}\nName: ${n.thread_metadata.name.text}\nCreate At: ${new Date(n.thread_metadata.creation_time * 1000).toLocaleString()}\nSubscriber: ${n.thread_metadata.subscribers_count}\nVerification: ${n.thread_metadata.verification}\nDescription: ${n.thread_metadata.description.text}\n`);
					}).catch((e) => m.reply('Saluran Tidak Di Temukan❗'));
				} else m.reply('Hanya Support Url Grup atau Saluran!');
			}
				break;
			case 'addmsg': {
				if (!m.quoted) return m.reply('Reply Pesan Yang Ingin Disave Di Database');
				if (!text) return m.reply(`Example : ${prefix + command} file name`);
				let msgs = db.database;
				if (text.toLowerCase() in msgs) return m.reply(`'${text}' telah terdaftar di list pesan`);
				msgs[text.toLowerCase()] = m.quoted;
				delete msgs[text.toLowerCase()].chat;
				m.reply(`Berhasil menambahkan pesan di list pesan sebagai '${text}'\nAkses dengan ${prefix}getmsg ${text}\nLihat list Pesan Dengan ${prefix}listmsg`);
			}
				break;
			case 'delmsg': case 'deletemsg': {
				if (!text) return m.reply('Nama msg yg mau di delete?');
				let msgs = db.database;
				if (text == 'allmsg') {
					db.database = {};
					m.reply('Berhasil menghapus seluruh msg dari list pesan');
				} else {
					if (!(text.toLowerCase() in msgs)) return m.reply(`'${text}' tidak terdaftar didalam list pesan`);
					delete msgs[text.toLowerCase()];
					m.reply(`Berhasil menghapus '${text}' dari list pesan`);
				}
			}
				break;
			case 'getmsg': {
				if (!text) return m.reply(`Example : ${prefix + command} file name\n\nLihat list pesan dengan ${prefix}listmsg`);
				let msgs = db.database;
				if (!(text.toLowerCase() in msgs)) return m.reply(`'${text}' tidak terdaftar di list pesan`);
				await axly.relayMessage(m.chat, msgs[text.toLowerCase()], {});
			}
				break;
			case 'listmsg': {
				let seplit = Object.entries(db.database).map(([nama, isi]) => { return { nama, message: getContentType(isi) }; });
				let teks = '「 LIST DATABASE 」\n\n';
				for (let i of seplit) {
					teks += `${setv} *Name :* ${i.nama}\n${setv} *Type :* ${i.message?.replace(/Message/i, '')}\n───────────────\n`;
				}
				m.reply(teks);
			}
				break;
			case 'setcmd': case 'addcmd': {
				if (!m.quoted) return m.reply(global.mess.quoted);
				if (!m.quoted.fileSha256) return m.reply('SHA256 Hash Missing!');
				if (!text) return m.reply(`Example : ${prefix + command} CMD Name`);
				let hash = m.quoted.fileSha256.toString('base64');
				if (global.db.cmd[hash] && global.db.cmd[hash].locked) return m.reply('You have no permission to change this sticker command');
				global.db.cmd[hash] = {
					creator: m.sender,
					locked: false,
					at: +new Date,
					text
				};
				m.reply(global.mess.done);
			}
				break;
			case 'delcmd': {
				if (!m.quoted) return m.reply(global.mess.quoted);
				if (!m.quoted.fileSha256) return m.reply('SHA256 Hash Missing!');
				let hash = m.quoted.fileSha256.toString('base64');
				if (global.db.cmd[hash] && global.db.cmd[hash].locked) return m.reply('You have no permission to change this sticker command');
				delete global.db.cmd[hash];
				m.reply(global.mess.done);
			}
				break;
			case 'listcmd': {
				let teks = `*List Hash*\nInfo: *bold* hash is Locked\n${Object.entries(global.db.cmd).map(([key, value], index) => `${index + 1}. ${value.locked ? `*${key}*` : key} : ${value.text}`).join('\n')}`.trim();
				axly.sendText(m.chat, teks, m);
			}
				break;
			case 'lockcmd': case 'unlockcmd': {
				if (!isCreator) return m.reply(global.mess.owner);
				if (!m.quoted) return m.reply(global.mess.quoted);
				if (!m.quoted.fileSha256) return m.reply('SHA256 Hash Missing!');
				let hash = m.quoted.fileSha256.toString('base64');
				if (!(hash in global.db.cmd)) return m.reply('You have no permission to change this sticker command');
				global.db.cmd[hash].locked = !/^un/i.test(command);
			}
				break;
			case 'q': case 'quoted': {
				if (!m.quoted) return m.reply(global.mess.quoted);
				if (text) {
					delete m.quoted.chat;
					await m.reply({ forward: m.quoted });
				} else {
					try {
						const anu = await m.getQuotedObj();
						if (!anu) return m.reply('Format Tidak Tersedia!');
						if (!anu.quoted) return m.reply('Pesan Yang Anda Reply Tidak Mengandung Reply');
						await axly.relayMessage(m.chat, { [anu.quoted.type]: anu.quoted.msg }, {});
					} catch (e) {
						return m.reply('Format Tidak Tersedia!');
					}
				}
			}
				break;
			case 'confes': case 'confess': case 'menfes': case 'menfess': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (m.isGroup) return m.reply(global.mess.private);
				if (menfes[m.sender]) return m.reply(`Kamu Sedang Berada Di Sesi ${command}!`);
				if (!text) return m.reply(`Example : ${prefix + command} 62xxxx|Nama Samaran`);
				let [teks1, teks2] = text.split`|`;
				if (teks1) {
					const tujuan = teks1.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
					const onWa = await axly.onWhatsApp(tujuan);
					if (!onWa.length > 0) return m.reply(global.mess.onWa);
					menfes[m.sender] = {
						tujuan: tujuan,
						nama: teks2 ? teks2 : 'Orang'
					};
					menfes[tujuan] = {
						tujuan: m.sender,
						nama: 'Penerima',
					};
					const timeout = setTimeout(() => {
						if (menfes[m.sender]) {
							m.reply(`_Waktu ${command} habis_`);
							delete menfes[m.sender];
						}
						if (menfes[tujuan]) {
							axly.sendMessage(tujuan, { text: `_Waktu ${command} habis_` });
							delete menfes[tujuan];
						}
						menfesTimeouts.delete(m.sender);
						menfesTimeouts.delete(tujuan);
					}, 600000);
					menfesTimeouts.set(m.sender, timeout);
					menfesTimeouts.set(tujuan, timeout);
					axly.sendMessage(tujuan, { text: `_${command} connected_\n*Note :* jika ingin mengakhiri ketik _*${prefix}del${command}*_` });
					m.reply(`_Memulai ${command}..._\n*Silahkan Mulai kirim pesan/media*\n*Durasi ${command} hanya selama 10 menit*\n*Note :* jika ingin mengakhiri ketik _*${prefix}del${command}*_`);
					setLimit(m, db);
				} else m.reply(`Masukkan Nomernya!\nExample : ${prefix + command} 62xxxx|Nama Samaran`);
			}
				break;
			case 'delconfes': case 'delconfess': case 'delmenfes': case 'delmenfess': {
				if (!menfes[m.sender]) return m.reply(`Kamu Tidak Sedang Berada Di Sesi ${command.split('del')[1]}!`);
				let anu = menfes[m.sender];
				if (menfesTimeouts.has(m.sender)) {
					clearTimeout(menfesTimeouts.get(m.sender));
					menfesTimeouts.delete(m.sender);
				}
				if (menfesTimeouts.has(anu.tujuan)) {
					clearTimeout(menfesTimeouts.get(anu.tujuan));
					menfesTimeouts.delete(anu.tujuan);
				}
				axly.sendMessage(anu.tujuan, { text: `Chat Di Akhiri Oleh ${anu.nama ? anu.nama : 'Seseorang'}` });
				m.reply(`Sukses Mengakhiri Sesi ${command.split('del')[1]}!`);
				delete menfes[anu.tujuan];
				delete menfes[m.sender];
			}


				break;
			case 'jadibot': {
				if (!isPremium) return m.reply(global.mess.prem);
				if (!isLimit) return m.reply(global.mess.limit);
				const nmrnya = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender;
				const onWa = await axly.onWhatsApp(nmrnya);
				if (!onWa.length > 0) return m.reply(global.mess.onWa);
				await JadiBot(axly, nmrnya, m, store);
				m.reply(`Gunakan ${prefix}stopjadibot\nUntuk Berhenti`);
				setLimit(m, db);
			}
				break;
			case 'stopjadibot': case 'deljadibot': {
				const nmrnya = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender;
				const onWa = await axly.onWhatsApp(nmrnya);
				if (!onWa.length > 0) return m.reply(global.mess.onWa);
				await StopJadiBot(axly, nmrnya, m);
			}
				break;
			case 'listjadibot': {
				ListJadiBot(axly, m);
			}
				break;

			// Tools Menu
			case 'fetch': case 'get': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!/^https?:\/\//.test(text)) return m.reply('Awali dengan http:// atau https://');
				try {
					const res = await axios.get(isUrl(text) ? isUrl(text)[0] : text);
					if (!/text|json|html|plain/.test(res.headers['content-type'])) {
						await m.reply(text);
					} else m.reply(util.format(res.data));
					setLimit(m, db);
				} catch (e) {
					m.reply(String(e));
				}
			}
				break;
			case 'toaud': case 'toaudio': {
				if (!/video|audio/.test(mime)) return m.reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`);
				m.react('⏳');
				let media = await axly.downloadAndSaveMediaMessage(qmsg);
				try {
					let audio = await toAudio(media, 'mp4');
					await m.reply({ audio: { url: audio }, mimetype: 'audio/mpeg' });
					if (fs.existsSync(audio)) fs.unlinkSync(audio);
				} finally {
					if (fs.existsSync(media)) fs.unlinkSync(media);
				}
			}
				break;
			case 'tomp3': {
				if (!/video|audio/.test(mime)) return m.reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`);
				m.react('⏳');
				let media = await axly.downloadAndSaveMediaMessage(qmsg);
				try {
					let audio = await toAudio(media, 'mp4');
					await m.reply({ document: { url: audio }, mimetype: 'audio/mpeg', fileName: `Convert By Axly Bot.mp3` });
					if (fs.existsSync(audio)) fs.unlinkSync(audio);
				} finally {
					if (fs.existsSync(media)) fs.unlinkSync(media);
				}
			}
				break;
			case 'wormgpt': case 'venice': case 'veniceai': case 'uncensored': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} halo`);
    m.react('⏳');

    try {
        // Endpoint AI Uncensored
        const apiUrl = `https://axlyapi.qzz.io/ai/uncensored?text=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, { timeout: 60000 });

        if (data.status === true && data.data && data.data.answer) {
            let response = data.data.answer;

            // Kirim per 4000 karakter biar gak kepotong
            if (response.length > 4000) {
                for (let i = 0; i < response.length; i += 4000) {
                    await m.reply(response.slice(i, i + 4000));
                }
            } else {
                await m.reply(response);
            }

            setLimit(m, db);
            m.react('✅');
        } else {
            throw new Error('Gagal dapat respons');
        }
    } catch (e) {
        console.error(e);
        m.react('❌');
        m.reply('❌ AI Uncensored error, coba lagi nanti.');
    }
}
break;
			case 'tovn': case 'toptt': case 'tovoice': {
				if (!/video|audio/.test(mime)) return m.reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`);
				m.react('⏳');
				let media = await axly.downloadAndSaveMediaMessage(qmsg);
				try {
					let audioBuffer = await toPTT(media, 'mp4');
					await m.reply({ audio: audioBuffer, mimetype: 'audio/ogg; codecs=opus', ptt: true });
				} finally {
					if (fs.existsSync(media)) fs.unlinkSync(media);
				}
			}
				break;
			case 'togif': {
				if (!/webp|video/.test(mime)) return m.reply(`Reply Video/Stiker dengan caption *${prefix + command}*`);
				m.react('⏳');
				let media = await axly.downloadAndSaveMediaMessage(qmsg);
				let ran = `./database/temp/${getRandom('.mp4')}`;
				exec(`ffmpeg -y -i "${media}" -an -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -pix_fmt yuv420p -c:v libx264 -preset veryfast "${ran}"`, async (err) => {
					try {
						if (err) return m.reply(global.mess.fail);
						await m.reply({ video: { url: ran }, gifPlayback: true, caption: global.mess.done, gifAttribution: pickRandom(['TENOR', 'GIPHY']) });
					} finally {
						if (fs.existsSync(media)) fs.unlinkSync(media);
						if (fs.existsSync(ran)) fs.unlinkSync(ran);
					}
				});
			}
				break;
			case 'toimage': case 'toimg': {
				if (!/webp|video|image/.test(mime)) return m.reply(`Reply Video/Stiker dengan caption *${prefix + command}*`);
				m.react('⏳');
				let media = await axly.downloadAndSaveMediaMessage(qmsg);
				let ran = `./database/temp/${getRandom('.png')}`;
				exec(`ffmpeg -y -i "${media}" -vframes 1 "${ran}"`, async (err) => {
					try {
						if (err) return m.reply(global.mess.fail);
						await m.reply({ image: { url: ran }, caption: global.mess.done });
					} finally {
						if (fs.existsSync(media)) fs.unlinkSync(media);
						if (fs.existsSync(ran)) fs.unlinkSync(ran);
					}
				});
			}
				break;
			case 'toptv': {
				if (!/video/.test(mime)) return m.reply(`Kirim/Reply Video Yang Ingin Dijadikan PTV Message Dengan Caption ${prefix + command}`);
				if ((m.quoted ? m.quoted.type : m.type) === 'videoMessage') {
					m.react('⏳');
					let media = await axly.downloadAndSaveMediaMessage(qmsg);
					try {
						const message = await generateWAMessageContent({ video: { url: media } }, { upload: axly.waUploadToServer });
						await axly.relayMessage(m.chat, { ptvMessage: message.videoMessage }, {});
					} finally {
						if (fs.existsSync(media)) fs.unlinkSync(media);
					}
				} else m.reply('Reply Video Yang Mau Di Ubah Ke PTV Message!');
			}
				break;
			case 'tourl': {
				if (/webp|video|sticker|audio|jpg|jpeg|png/.test(mime)) {
					m.react('⏳');
					let media = await axly.downloadAndSaveMediaMessage(qmsg);
					try {
						let anu = await UguuSe(media);
						m.reply('Url : ' + anu.url);
					} finally {
						if (fs.existsSync(media)) fs.unlinkSync(media);
					}
				} else m.reply(global.mess.media);
			}
				break;
case 'tts': case 'say': case 'suara': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`🎤 *TTS Voice*\n\nGunakan:\n${prefix}tts halo dunia\n${prefix}tts nami halo dunia\n\nVoice tersedia:\n▸ nahida\n▸ nami\n▸ ana\n▸ optimus\n▸ goku\n▸ elon_musk\n▸ mickey\n▸ kendrick\n▸ eminem`);
    
    // Daftar voice
    const validVoices = ['nahida', 'nami', 'ana', 'optimus', 'goku', 'elon_musk', 'mickey', 'kendrick', 'eminem'];
    
    let voice = 'nami'; // default
    let cleanText = text;
    
    // Cek apakah kata pertama adalah nama voice
    const firstWord = text.split(' ')[0].toLowerCase();
    if (validVoices.includes(firstWord)) {
        voice = firstWord;
        // Hapus kata voice dari teks (ambil sisanya)
        cleanText = text.split(' ').slice(1).join(' ').trim();
    }
    
    // Kalo teks kosong setelah dihapus voice
    if (!cleanText) {
        return m.reply(`🎤 *TTS Voice*\n\nTeksnya mana?\nContoh: ${prefix}tts ${voice} halo dunia`);
    }
    
    await m.react('🎤');
    
    try {
        // Panggil API lo
        const apiUrl = `https://axlyapi.qzz.io/tools/text-to-speech?text=${encodeURIComponent(cleanText)}&voice=${voice}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (!data.status || !data.result) throw new Error('Gagal dari API');
        
        // Cari URL audio
        let audioUrl = null;
        for (const item of data.result) {
            if (item[voice]) {
                audioUrl = item[voice];
                break;
            }
        }
        
        if (!audioUrl) {
            const namiItem = data.result.find(item => item.nami);
            audioUrl = namiItem?.nami;
        }
        
        if (!audioUrl) throw new Error('Audio tidak ditemukan');
        
        // Kirim audio
        await axly.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: m });
        
        setLimit(m, db);
        await m.react('✅');
        
    } catch (e) {
        console.error('TTS Error:', e);
        await m.react('❌');
        m.reply(`❌ Gagal: ${e.message}`);
    }
}
break;
			case 'translate': case 'tr': {
				if (text && text == 'list') {
					let list_tr = `╭──❍「 *Kode Bahasa* 」❍\n│• af : Afrikaans\n│• ar : Arab\n│• zh : Chinese\n│• en : English\n│• en-us : English (United States)\n│• fr : French\n│• de : German\n│• hi : Hindi\n│• hu : Hungarian\n│• is : Icelandic\n│• id : Indonesian\n│• it : Italian\n│• ja : Japanese\n│• ko : Korean\n│• la : Latin\n│• no : Norwegian\n│• pt : Portuguese\n│• pt : Portuguese\n│• pt-br : Portuguese (Brazil)\n│• ro : Romanian\n│• ru : Russian\n│• sr : Serbian\n│• es : Spanish\n│• sv : Swedish\n│• ta : Tamil\n│• th : Thai\n│• tr : Turkish\n│• vi : Vietnamese\n╰──────❍`;
					m.reply(list_tr);
				} else {
					if (!m.quoted && (!text || !args[1])) return m.reply(`Kirim/reply text dengan caption ${prefix + command}`);
					let lang = args[0] ? args[0] : global.locale;
					let teks = args[1] ? args.slice(1).join(' ') : m.quoted.text;
					try {
						// Google Translate gratis tanpa API key
						const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(lang)}&dt=t&q=${encodeURIComponent(teks)}`;
						const response = await fetch(url);
						const json = await response.json();
						const hasil = json[0][0][0];
						m.reply(`To : ${lang}\n${hasil}`);
					} catch (e) {
						console.log(e);
						m.reply(`Lang *${lang}* Tidak Di temukan!\nSilahkan lihat list, ${prefix + command} list`);
					}
				}
			}
				break;
			case 'toqr': case 'qr': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!text) return m.reply(`Ubah Text ke Qr dengan *${prefix + command}* textnya`);
				m.react('⏳');
				const path = require('path');
				const os = require('os');
				const tmpFile = path.join(os.tmpdir(), `qr-${Date.now()}.png`);
				try {
					// API gratis tanpa key (api.qrserver.com)
					const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;
					const response = await fetch(url);
					if (!response.ok) throw new Error('Gagal membuat QR');
					const buffer = await response.arrayBuffer();
					await fs.promises.writeFile(tmpFile, Buffer.from(buffer));
					await m.reply({ image: { url: tmpFile }, caption: 'Nih Bro' });
					setLimit(m, db);
				} catch (e) {
					console.log(e);
					m.reply(global.mess.fail);
				} finally {
					if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
				}
			}
				break;
case 'tohd': case 'remini': case 'hd': case 'enhance': {
    if (!isLimit) return m.reply(global.mess.limit);
    
    let mediaMsg = m.quoted ? m.quoted : m;
    let mime = (mediaMsg.msg || mediaMsg).mimetype || '';
    
    if (!/image/.test(mime)) {
        return m.reply(`Kirim/Reply Gambar dengan format\nExample: ${prefix + command}\n\n_*Support:* JPG, PNG, WebP_\n_Memperjelas gambar menjadi resolusi tinggi_`);
    }
    
    m.react('⏳');
    let mediaPath = null;
    
    try {
        mediaPath = await axly.downloadAndSaveMediaMessage(mediaMsg);
        
        // Upload ke UguuSe
        let upload = await UguuSe(mediaPath);
        if (!upload?.url) throw new Error('Upload gagal');
        
        // Endpoint Enhance dari AxlyAPI (langsung return gambar hasil enhancement)
        let apiUrl = `https://axlyapi.qzz.io/tools/enhance?url=${encodeURIComponent(upload.url)}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 60000
        });
        
        const buffer = Buffer.from(response.data);
        
        // Cek apakah response berupa gambar (bukan JSON error)
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal enhance gambar');
            } catch (jsonErr) {
                // Bukan JSON, lanjut kirim
            }
        }
        
        // Kirim hasil enhance
        await axly.sendMessage(
            m.chat, 
            { 
                image: buffer, 
                caption: `✨ *Image Enhanced!*\n\n✅ Gambar berhasil ditingkatkan resolusinya\n📊 *Quality:* HD / 4K\n\n_Sebelum vs Sesudah - Kualitas gambar meningkat!_` 
            }, 
            { quoted: m }
        );
        
        setLimit(m, db);
        m.react('✅');
        
    } catch (e) {
        console.error('Enhance Error:', e.message);
        m.react('❌');
        
        // Fallback: Coba dengan parameter scale yang lebih rendah
        try {
            const fallbackUrl = `https://axlyapi.qzz.io/tools/enhance?url=${encodeURIComponent(upload?.url || '')}&scale=2`;
            const fallbackRes = await axios.get(fallbackUrl, {
                responseType: 'arraybuffer',
                timeout: 60000
            });
            
            await axly.sendMessage(
                m.chat, 
                { image: Buffer.from(fallbackRes.data), caption: `✨ *Image Enhanced (Scale 2x)*` }, 
                { quoted: m }
            );
            setLimit(m, db);
            m.react('✅');
            return;
        } catch (fallbackErr) {
            console.error('Fallback Enhance Error:', fallbackErr.message);
        }
        
        m.reply(`❌ Gagal enhance gambar!\n\nPastikan gambar jelas dan tidak terlalu buram.\nCoba dengan gambar lain.`);
    } finally {
        if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    }
}
break;
	case 'ssweb': case 'screenshot': case 'ss': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} https://github.com`);

    let url = text;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    m.react('⏳');

    try {
        // Endpoint SSWeb dari AxlyAPI (langsung return gambar)
        const apiUrl = `https://axlyapi.qzz.io/tools/ssweb?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 60000
        });
        
        const buffer = Buffer.from(response.data);
        
        // Cek apakah response berupa gambar (bukan JSON error)
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            // Jika ternyata return JSON, parse dan cek
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal screenshot');
            } catch (jsonErr) {
                // Bukan JSON, lanjut kirim gambar
            }
        }
        
        // Kirim screenshot langsung
        await axly.sendMessage(
            m.chat,
            {
                image: buffer,
                caption: `📸 *Screenshot Web*\n\n🔗 *URL:* ${url}\n⏱️ *Waktu:* ${new Date().toLocaleString('id-ID')}\n\n_SS oleh AxlyAPI_`
            },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('SSWeb Error:', e.message);
        m.react('❌');
        
        // Fallback: Coba dengan parameter fullpage
        try {
            const fallbackUrl = `https://axlyapi.qzz.io/tools/ssweb?url=${encodeURIComponent(url)}&fullpage=true`;
            const fallbackRes = await axios.get(fallbackUrl, {
                responseType: 'arraybuffer',
                timeout: 60000
            });
            
            const fallbackBuffer = Buffer.from(fallbackRes.data);
            await axly.sendMessage(
                m.chat,
                {
                    image: fallbackBuffer,
                    caption: `📸 *Screenshot Web (Full Page)*\n\n🔗 *URL:* ${url}`
                },
                { quoted: m }
            );
            setLimit(m, db);
            m.react('✅');
            return;
        } catch (fallbackErr) {
            console.error('Fallback SSWeb Error:', fallbackErr.message);
        }
        
        m.reply(`❌ Gagal screenshot website!\n\nPastikan URL valid dan website bisa diakses.\nContoh: ${prefix + command} https://google.com`);
    }
}
break;

			case 'readmore': {
				let teks1 = text.split`|`[0] ? text.split`|`[0] : '';
				let teks2 = text.split`|`[1] ? text.split`|`[1] : '';
				m.reply(teks1 + readmore + teks2);
			}
				break;
			case 'getexif': {
				if (!m.quoted) return m.reply(`Reply sticker\nDengan caption ${prefix + command}`);
				if (!/sticker|webp/.test(quoted.type)) return m.reply(`Reply sticker\nDengan caption ${prefix + command}`);
				const img = new webp.Image();
				await img.load(await m.quoted.download());
				if (!img.exif) return m.reply('Stiker ini tidak memiliki metadata/EXIF sama sekali.');
				try {
					const exifData = JSON.parse(img.exif.slice(22).toString());
					m.reply(util.format(exifData));
				} catch (e) {
					m.reply(`Stiker memiliki EXIF, tapi formatnya bukan JSON yang valid:\n\n${img.exif.toString()}`);
				}
			}
				break;
			case 'cuaca': case 'weather': {
				if (!text) return m.reply(`Example: ${prefix + command} jakarta`);
				try {
					// 1. Cari koordinat kota pakai Nominatim (gratis, tanpa key)
					const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=1`;
					const geoRes = await fetch(geoUrl, {
						headers: { 'User-Agent': 'WhatsAppBot/1.0' } // Nominatim wajib user-agent
					});
					const geoData = await geoRes.json();
					if (!geoData.length) return m.reply('Kota Tidak Di Temukan!');

					const { lat, lon, display_name } = geoData[0];

					// 2. Ambil data cuaca pakai Open-Meteo (gratis, tanpa key)
					const cuacaUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,pressure_msl`;
					const cuacaRes = await fetch(cuacaUrl);
					const cuacaData = await cuacaRes.json();

					const cw = cuacaData.current_weather;
					const hourly = cuacaData.hourly;

					// Konversi kode cuaca WMO ke deskripsi
					const wmoCode = cw.weathercode;
					const cuacaDesc = {
						0: 'Cerah', 1: 'Cerah Berawan', 2: 'Berawan', 3: 'Mendung',
						45: 'Berkabut', 48: 'Berkabut', 51: 'Gerimis Ringan', 53: 'Gerimis', 55: 'Gerimis Lebat',
						61: 'Hujan Ringan', 63: 'Hujan', 65: 'Hujan Lebat',
						71: 'Salju Ringan', 73: 'Salju', 75: 'Salju Lebat',
						95: 'Badai Petir', 96: 'Badai Petir Hujan Es', 99: 'Badai Petir Hujan Es Lebat'
					}[wmoCode] || 'Tidak diketahui';

					const cuacaUtama = wmoCode <= 3 ? 'Cerah' : wmoCode < 50 ? 'Berkabut' : wmoCode < 60 ? 'Gerimis' : wmoCode < 70 ? 'Hujan' : wmoCode < 80 ? 'Salju' : 'Badai';

					// Ambil kelembapan & tekanan dari jam saat ini (perkiraan)
					const nowHour = new Date().getHours();
					const humidity = hourly?.relativehumidity_2m?.[nowHour] || 'N/A';
					const pressure = hourly?.pressure_msl?.[nowHour] || 'N/A';

					let teks = `*🏙 Cuaca Kota ${display_name.split(',')[0]}*\n\n`;
					teks += `*🌤️ Cuaca :* ${cuacaUtama}\n`;
					teks += `*📝 Deskripsi :* ${cuacaDesc}\n`;
					teks += `*🌡️ Suhu :* ${cw.temperature} °C\n`;
					teks += `*🤔 Kecepatan Angin :* ${cw.windspeed} Km/h\n`;
					teks += `*🌬️ Tekanan :* ${pressure} hPa\n`;
					teks += `*💧 Kelembapan :* ${humidity}%\n`;
					teks += `*📍Lokasi :*\n- *Bujur :* ${lat}\n- *Lintang :* ${lon}\n`;
					teks += `*🌏 Negara :* ${display_name.split(',').pop().trim()}`;

					m.reply(teks);
				} catch (e) {
					console.log(e);
					m.reply('Kota Tidak Di Temukan!');
				}
			}
				break;
			case 'tovideo': case 'tovid': case 'stickertovideo': case 'giftomp4': case 'toimg': case 'togif': {
				if (!m.quoted) return m.reply('Reply stiker!');

				let qmsg = m.quoted;
				let mime = (qmsg.msg || qmsg).mimetype || '';

				if (!/webp/.test(mime) && !/sticker/.test(qmsg.type || qmsg.mtype || '')) {
					return m.reply('Reply stiker!');
				}

				m.react('⏳');

				try {
					let img = await qmsg.download();

					// Cek animasi dari buffer
					let isAnimated = img.includes(Buffer.from('ANIM')) || img.includes(Buffer.from('ANMF'));

					// toimg: stiker → gambar
					if (/toimg/.test(command)) {
						let out = await webpToVideo(img); // fungsi ini return PNG kalau statis
						await axly.sendMessage(
							m.chat,
							{ image: out, caption: '✅ Stiker → Gambar' },
							{ quoted: m }
						);
						m.react('✅');
						return;
					}

					// tovid/tovideo/togif: stiker animasi → video
					if (isAnimated && (/tovid|tovideo|togif/.test(command))) {
						await m.reply('_Tunggu sebentar, lagi convert..._');
						let out = await webpToVideo(img);

						await axly.sendMessage(
							m.chat,
							{
								video: out,
								mimetype: 'video/mp4',
								gifPlayback: /togif/i.test(command),
								caption: '✅ Stiker → Video'
							},
							{ quoted: m }
						);
						m.react('✅');
						return;
					}

					// Fallback: stiker statis + tovid → jadi gambar
					if (!isAnimated && (/tovid|tovideo|togif/.test(command))) {
						let out = await webpToVideo(img);
						await axly.sendMessage(
							m.chat,
							{ image: out, caption: '⚠️ Stiker statis, jadi gambar aja' },
							{ quoted: m }
						);
						m.react('✅');
						return;
					}

					m.reply('Gunakan:\n- .toimg (stiker → gambar)\n- .tovid (stiker animasi → video)');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal convert stiker!');
				}
			}
				break;
			case 's': case 'sticker': case 'stiker': case 'sgif': case 'stikergif': case 'stickergif': {
				if (!/image|video|webp/.test(mime) && !isUrl(text)) return m.reply(`Kirim/reply gambar/video/stiker dengan caption ${prefix + command}`);

				m.react('⏳');
				let mediaPath = null;
				let resizedPath = null;

				try {
					let q = m.quoted ? m.quoted : m;
					let mimeType = (q.msg || q).mimetype || q.mediaType || '';

					let [packname, ...author] = text.split`|`;
					author = (author || []).join`|`;

					// Fungsi resize gambar ke 512x512 menggunakan sharp
					const resizeImage = async (buffer) => {
						const sharp = require('sharp');
						return await sharp(buffer)
							.resize(512, 512, { fit: 'cover', position: 'center' })
							.toBuffer();
					};

					if (/webp/g.test(mimeType)) {
						// Stiker ke stiker (resize dulu)
						let imgBuffer = await q.download?.();
						const sharp = require('sharp');
						const resizedBuffer = await sharp(imgBuffer)
							.resize(512, 512, { fit: 'cover', position: 'center' })
							.toBuffer();
						await axly.sendAsSticker(m.chat, resizedBuffer, m, {
							packname: packname || global.packname,
							author: author || global.author
						});
						m.react('✅');
						return;
					} else if (/image/g.test(mimeType)) {
						let imgBuffer = await q.download?.();
						const resizedBuffer = await resizeImage(imgBuffer);
						await axly.sendAsSticker(m.chat, resizedBuffer, m, {
							packname: packname || global.packname,
							author: author || global.author
						});
						m.react('✅');
						return;
					} else if (/video/g.test(mimeType)) {
						if ((q.msg || q).seconds > 10) {
							m.react('❌');
							return m.reply('Maksimal 10 detik!');
						}
						mediaPath = await axly.downloadAndSaveMediaMessage(q);

						// Resize video ke 512x512 pake ffmpeg
						resizedPath = `./database/temp/resized_${Date.now()}.mp4`;
						execSync(`ffmpeg -i "${mediaPath}" -vf "scale=512:512:force_original_aspect_ratio=1,pad=512:512:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset fast -pix_fmt yuv420p "${resizedPath}"`, { stdio: 'ignore' });

						await axly.sendAsSticker(m.chat, resizedPath, m, {
							packname: packname || global.packname,
							author: author || global.author
						});
						m.react('✅');
						return;
					} else if (isUrl(text)) {
						const res = await axios.get(text, { responseType: 'arraybuffer' });
						const buffer = Buffer.from(res.data);
						// Cek apakah URL mengarah ke gambar atau video
						if (text.match(/\.(jpg|jpeg|png|webp)$/i)) {
							const resizedBuffer = await resizeImage(buffer);
							await axly.sendAsSticker(m.chat, resizedBuffer, m, {
								packname: packname || global.packname,
								author: author || global.author
							});
						} else {
							await axly.sendAsSticker(m.chat, buffer, m, {
								packname: packname || global.packname,
								author: author || global.author
							});
						}
						m.react('✅');
						return;
					} else {
						throw new Error('Format tidak didukung');
					}

					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal membuat stiker!');
				} finally {
					if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
					if (resizedPath && fs.existsSync(resizedPath)) fs.unlinkSync(resizedPath);
				}
			}
				break;
			case 'stickerwm': case 'swm': case 'curi': case 'colong': case 'take': case 'stickergifwm': case 'sgifwm': {
				if (!/image|video|sticker/.test(quoted.type)) return m.reply(`Kirim/reply gambar/video/gif dengan caption ${prefix + command}\nDurasi Image/Video/Gif 1-9 Detik`);
				let media = await axly.downloadAndSaveMediaMessage(qmsg);
				let teks1 = text.split`|`[0] ? text.split`|`[0] : packname;
				let teks2 = text.split`|`[1] ? text.split`|`[1] : author;
				if (/image|webp/.test(mime)) {
					m.react('⏳');
					await axly.sendAsSticker(m.chat, media, m, { packname: teks1 });
				} else if (/video/.test(mime)) {
					if ((qmsg).seconds > 11) return m.reply('Maksimal 10 detik!');
					m.react('⏳');
					await axly.sendAsSticker(m.chat, media, m, { packname: teks1 });
				} else m.reply(`Kirim/reply gambar/video/gif dengan caption ${prefix + command}\nDurasi Video/Gif 1-9 Detik`);
			}
				break;
case 'smeme': case 'stickmeme': case 'stikmeme': case 'stickermeme': case 'stikermeme': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text && !m.quoted) return m.reply(`Kirim/reply gambar dengan caption ${prefix + command} teks_atas|teks_bawah`);
    
    m.react('⏳');
    
    let atas = '';
    let bawah = '';
    
    // Parse teks dari command atau reply
    if (text && text.includes('|')) {
        atas = text.split('|')[0] ? text.split('|')[0].trim() : '';
        bawah = text.split('|')[1] ? text.split('|')[1].trim() : '';
    } else if (text && !text.includes('|')) {
        atas = text.trim();
        bawah = '';
    } else {
        return m.reply(`Format: ${prefix + command} teks_atas|teks_bawah\n\nContoh: ${prefix + command} lucu|sekali`);
    }
    
    let mediaPath = null;
    let imageUrl = null;
    
    try {
        // Ambil gambar dari reply atau caption
        let qmsg = m.quoted ? m.quoted : m;
        let mime = (qmsg.msg || qmsg).mimetype || '';
        
        if (/image/.test(mime)) {
            // Jika ada gambar, download dan upload
            mediaPath = await axly.downloadAndSaveMediaMessage(qmsg);
            
            // Upload ke UguuSe
            let upload = await UguuSe(mediaPath);
            if (!upload?.url) throw new Error('Upload gagal');
            imageUrl = upload.url;
        } else if (m.quoted && m.quoted.text) {
            // Jika reply ke pesan teks, cek apakah itu URL
            const textContent = m.quoted.text;
            if (textContent.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i)) {
                imageUrl = textContent.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i)[0];
            } else {
                return m.reply('❌ Reply ke gambar atau kirim URL gambar!\n\nContoh: /smeme lucu|sekali dengan reply gambar');
            }
        } else {
            return m.reply('❌ Reply ke gambar atau kirim URL gambar!\n\nContoh: /smeme lucu|sekali dengan reply gambar');
        }
        
        if (!imageUrl) throw new Error('Tidak ada URL gambar');
        
        // Encode parameter
        const encodedTop = encodeURIComponent(atas);
        const encodedBottom = encodeURIComponent(bawah);
        const encodedUrl = encodeURIComponent(imageUrl);
        
        // Endpoint Sticker Meme dari AxlyAPI
        const apiUrl = `https://axlyapi.qzz.io/maker/smeme?top=${encodedTop}&bottom=${encodedBottom}&url=${encodedUrl}&fontSize=auto&strokeWidth=auto`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 60000
        });
        
        const buffer = Buffer.from(response.data);
        
        // Cek apakah response berupa gambar (bukan JSON error)
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal membuat stiker meme');
            } catch (jsonErr) {
                // Bukan JSON, lanjut kirim
            }
        }
        
        // Kirim sebagai stiker
        await axly.sendAsSticker(m.chat, buffer, m, { packname, author });
        
        setLimit(m, db);
        m.react('✅');
        
    } catch (e) {
        console.error('Sticker Meme Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal membuat stiker meme! Coba lagi nanti.\n\nPastikan gambar jelas dan teks tidak terlalu panjang.');
    } finally {
        if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    }
}
break;
case 'emojimix': case 'mixemoji': case 'emojikombinasi': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} 😀 🙃\nAtau: ${prefix + command} 😀+🙃\n\nGabungkan 2 emoji untuk membuat emoji unik!`);
    
    m.react('⏳');
    
    try {
        // Parse emoji dari text (format: "😀 🙃" atau "😀+🙃")
        let emoji1, emoji2;
        
        if (text.includes('+')) {
            const parts = text.split('+');
            emoji1 = parts[0].trim();
            emoji2 = parts[1].trim();
        } else if (text.includes(' ')) {
            const parts = text.split(' ');
            emoji1 = parts[0].trim();
            emoji2 = parts[1].trim();
        } else {
            return m.reply('❌ Masukkan 2 emoji!\n\nContoh: /emojimix 😀 🙃\nAtau: /emojimix 😀+🙃');
        }
        
        // Validasi emoji (minimal 1 karakter dan bukan huruf biasa)
        if (emoji1.length < 1 || emoji2.length < 1) {
            return m.reply('❌ Format tidak valid! Masukkan 2 emoji.\nContoh: /emojimix 😀 🙃');
        }
        
        // Encode emoji ke URL format
        const encodeEmoji1 = encodeURIComponent(emoji1);
        const encodeEmoji2 = encodeURIComponent(emoji2);
        
        // Endpoint Emoji Mix dari AxlyAPI
        const apiUrl = `https://axlyapi.qzz.io/tools/emojimix?emoji1=${encodeEmoji1}&emoji2=${encodeEmoji2}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        const buffer = Buffer.from(response.data);
        
        // Cek apakah response berupa gambar (bukan JSON error)
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            // Jika ternyata return JSON, parse dan cek
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal menggabungkan emoji');
            } catch (jsonErr) {
                // Bukan JSON, lanjut kirim gambar
            }
        }
        
        // Kirim gambar hasil mix emoji
        await axly.sendMessage(
            m.chat,
            { 
                image: buffer, 
                caption: `✨ *Emoji Mix Result*\n\n${emoji1} + ${emoji2} = Emoji Unik!\n\n_Simpan dan gunakan di WhatsApp!_` 
            },
            { quoted: m }
        );
        
        setLimit(m, db);
        m.react('✅');
        
    } catch (e) {
        console.error('EmojiMix Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal menggabungkan emoji! Coba dengan kombinasi emoji lain.\n\nContoh: /emojimix 😀 🙃\n/emojimix 🐱+🐶\n/emojimix ❤️ 🔥');
    }
}
break;
			case 'iqc': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!text && (!m.quoted || !m.quoted.text)) return m.reply(`Kirim/reply pesan *${prefix + command}* Teksnya`);
				m.react('⏳');
				let queryText = text ? text : m.quoted.text;
				if (queryText.length >= 200) return m.reply('Max 200 Length!');

				// Siapkan parameter dinamis untuk gaya iPhone
				const now = new Date();
				const jam = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
				const bat = Math.floor(Math.random() * 91) + 10; // 10–100
				const carriers = ['Telkomsel', 'Indosat', 'XL', 'Smartfren', 'Three', 'By.U', 'Axis'];
				const carrier = carriers[Math.floor(Math.random() * carriers.length)];
				const signal = Math.floor(Math.random() * 4) + 1; // 1–4 bar
				const emojiStyle = 'apple';

				const apiUrl = `https://brat.siputzx.my.id/iphone-quoted?time=${jam}&messageText=${encodeURIComponent(queryText)}&batteryPercentage=${bat}&carrierName=${carrier}&signalStrength=${signal}&emojiStyle=${emojiStyle}`;

				try {
					// Ambil gambar dari API (response berupa buffer)
					const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
					const imageBuffer = Buffer.from(response.data, 'binary');

					// Kirim gambar hasil quote
					await m.reply({ image: imageBuffer, caption: global.mess.done });
					setLimit(m, db);
				} catch (e) {
					console.error(e);
					m.reply(`Gagal membuat quote: ${e.message}`);
				}
			}
				break;
				case 'animerbaru': case 'animetrbaru': case 'animeupdate': case 'animebaru': case 'update': {
    if (!isLimit) return m.reply(global.mess.limit);
    m.react('⏳');

    try {
        // ========== 1. PANGGIL API ANIME TERBARU ==========
        const apiUrl = 'https://axlyapi.qzz.io/anime/samehadaku/latest';
        const { data } = await axios.get(apiUrl, { timeout: 15000 });

        if (!data.status || !data.results || data.results.length === 0) {
            throw new Error('Tidak ada anime terbaru');
        }

        const animeList = data.results;
        const total = data.total || animeList.length;

        // ========== 2. FORMAT CAPTION ==========
        let caption = `🎬 *ANIME TERBARU HARI INI*\n\n`;
        caption += `📊 *Total:* ${total} anime\n`;
        caption += `📅 *Update:* ${new Date().toLocaleDateString('id-ID')}\n\n`;
        
        // Tampilkan semua anime terbaru (15 anime)
        for (let i = 0; i < animeList.length; i++) {
            const anime = animeList[i];
            const title = anime.title || 'Unknown';
            const episode = anime.episode || '-';
            const url = anime.url || '#';
            
            caption += `${i + 1}. *${title}*\n`;
            caption += `   🎞️ ${episode}\n`;
            caption += `   🔗 ${url}\n\n`;
        }
        
        caption += `📝 *Cara nonton:*\n`;
        caption += `Copy link anime di atas, lalu ketik:\n`;
        caption += `${prefix}animedetail <link_anime>\n\n`;
        caption += `*Contoh:*\n`;
        caption += `${prefix}animedetail ${animeList[0]?.url || ''}\n\n`;
        caption += `🔍 *Cari anime:* ${prefix}anime <judul>`;

        // ========== 3. KIRIM PESAN ==========
        // Jika caption terlalu panjang, kirim sebagai file txt
        if (caption.length > 4000) {
            const fs = require('fs');
            const tempFile = path.join(__dirname, '../database/temp', `anime_list_${Date.now()}.txt`);
            fs.writeFileSync(tempFile, caption, 'utf-8');
            
            await axly.sendMessage(
                m.chat,
                {
                    document: fs.readFileSync(tempFile),
                    mimetype: 'text/plain',
                    fileName: `anime_terbaru.txt`,
                    caption: `🎬 *ANIME TERBARU*\n📊 Total: ${total} anime`
                },
                { quoted: m }
            );
            fs.unlinkSync(tempFile);
        } else {
            await m.reply(caption);
        }
        
        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Anime Terbaru Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal mengambil daftar anime terbaru. Coba lagi nanti.');
    }
}
break;
case 'qc':
case 'quote':
case 'fakechat':
case 'quotechat':
case 'xquote':
case 'quotly': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text && !m.quoted) return m.reply(`Kirim / reply pesan untuk *${prefix + command}*`);
    m.react('⏳');

    let queryText = text ? text : (m.quoted ? m.quoted.text : '');
    if (!queryText) return m.reply('Teksnya mana?');
    if (queryText.length > 10000) return m.reply('Max 10000 karakter!');

    // Ambil nama pengirim tanpa emoji
    function removeEmojis(str) {
        return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF])/g, '');
    }
    let senderName = (m.pushName || store.contacts?.[m.sender]?.name || m.sender.split('@')[0]);
    let cleanName = removeEmojis(senderName).trim() || 'User';

    // Ambil foto profil (opsional, bisa gagal)
    let avatarUrl = 'https://i.pinimg.com/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg'; // default
    try {
        const profilePic = await axly.profilePictureUrl(m.sender, 'image');
        if (profilePic && !profilePic.includes('undefined')) avatarUrl = profilePic;
    } catch (e) { }

    // Pilihan warna background
    let color = 'hitam'; // default
    if (text.includes('--color=')) {
        const colorMatch = text.match(/--color=(\w+)/);
        if (colorMatch) color = colorMatch[1];
    } else if (text.includes('bg=')) {
        const colorMatch = text.match(/bg=(\w+)/);
        if (colorMatch) color = colorMatch[1];
    }

    try {
        // Endpoint Quote Chat dari AxlyAPI
        let apiUrl = `https://axlyapi.qzz.io/maker/qc?text=${encodeURIComponent(queryText)}&name=${encodeURIComponent(cleanName)}&avatar=${encodeURIComponent(avatarUrl)}&color=${encodeURIComponent(color)}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        const buffer = Buffer.from(response.data);
        
        // Cek apakah response berupa gambar (bukan JSON error)
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            // Jika ternyata return JSON, parse dan cek
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal membuat quote');
            } catch (jsonErr) {
                // Bukan JSON, lanjut kirim gambar
            }
        }
        
        // Kirim sebagai stiker
        await axly.sendAsSticker(m.chat, buffer, m, { packname, author });
        
        setLimit(m, db);
        m.react('✅');
        
    } catch (err) {
        console.error('Quote Error:', err.message);
        m.react('❌');
        
        // Fallback: coba tanpa avatar jika error
        try {
            let fallbackUrl = `https://axlyapi.qzz.io/maker/qc?text=${encodeURIComponent(queryText)}&name=${encodeURIComponent(cleanName)}&color=${encodeURIComponent(color)}`;
            const fallbackRes = await axios.get(fallbackUrl, {
                responseType: 'arraybuffer',
                timeout: 30000
            });
            
            await axly.sendAsSticker(m.chat, Buffer.from(fallbackRes.data), m, { packname, author });
            setLimit(m, db);
            m.react('✅');
            return;
        } catch (fallbackErr) {
            console.error('Fallback Quote Error:', fallbackErr.message);
        }
        
        m.reply('❌ Gagal membuat quote! Coba lagi nanti.\n\n_Gunakan parameter warna: --color=hitam, --color=putih, --color=gradien_');
    }
}
break;
	case 'brat': case 'bratimg': case 'bratimage': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text && (!m.quoted || !m.quoted.text)) return m.reply(`Kirim/reply pesan *${prefix + command}* Teksnya\n\nContoh: ${prefix + command} halo`);
    
    let queryText = text ? text : m.quoted.text;
    if (queryText.length >= 200) return m.reply('Max 200 karakter!');
    
    m.react('⏳');

    try {
        // Endpoint Brat Image dari AxlyAPI (langsung return gambar)
        const apiUrl = `https://axlyapi.qzz.io/maker/brat?text=${encodeURIComponent(queryText)}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
            }
        });
        
        const imageBuffer = Buffer.from(response.data);
        
        // Cek apakah response berupa gambar (bukan JSON error)
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            try {
                const jsonData = JSON.parse(imageBuffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal membuat gambar brat');
            } catch (jsonErr) {
                // Bukan JSON, lanjut kirim
            }
        }
        
        // Kirim sebagai stiker
        await axly.sendAsSticker(m.chat, imageBuffer, m, { packname, author });
        
        setLimit(m, db);
        m.react('✅');
        
    } catch (e) {
        console.error('Brat Image Error:', e.message);
        m.react('❌');
        
        // Fallback: Coba dengan parameter warna default
        try {
            const fallbackUrl = `https://axlyapi.qzz.io/maker/brat?text=${encodeURIComponent(queryText)}&style=default`;
            const fallbackRes = await axios.get(fallbackUrl, {
                responseType: 'arraybuffer',
                timeout: 30000
            });
            
            await axly.sendAsSticker(m.chat, Buffer.from(fallbackRes.data), m, { packname, author });
            setLimit(m, db);
            m.react('✅');
            return;
        } catch (fallbackErr) {
            console.error('Fallback Brat Error:', fallbackErr.message);
        }
        
        m.reply(`❌ Gagal membuat gambar brat!\n\nCoba dengan teks yang lebih pendek.\nContoh: ${prefix + command} halo bang`);
    }
}
break;
case 'bratvid': case 'bratvideo': case 'brat': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text && (!m.quoted || !m.quoted.text)) return m.reply(`Kirim/reply pesan *${prefix + command}* Teksnya\n\nContoh: ${prefix + command} halo`);
    m.react('⏳');

    let queryText = text ? text : m.quoted.text;
    if (queryText.length >= 200) return m.reply('Max 200 karakter!');
    
    queryText = queryText.replace(/[^\w\s]/gi, ' ').trim();

    try {
        const apiUrl = `https://axlyapi.qzz.io/maker/bratvid?text=${encodeURIComponent(queryText)}`;
        
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
            }
        });
        
        const buffer = Buffer.from(response.data);
        
        // ========== KONVERSI MP4 KE WEBP (STICKER) ==========
        const fs = require('fs');
        const { exec } = require('child_process');
        const path = require('path');
        
        const tempDir = './database/temp/';
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        
        const inputPath = path.join(tempDir, `brat_${Date.now()}.mp4`);
        const outputPath = path.join(tempDir, `brat_${Date.now()}.webp`);
        
        fs.writeFileSync(inputPath, buffer);
        
        // Konversi dengan FFmpeg
        await new Promise((resolve, reject) => {
            exec(`ffmpeg -i ${inputPath} -vf "fps=15,scale=512:512:force_original_aspect_ratio=increase,crop=512:512" -c:v libwebp -lossless 0 -q:v 80 ${outputPath} -y`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        const stickerBuffer = fs.readFileSync(outputPath);
        
        // Kirim sebagai sticker
        await axly.sendMessage(m.chat, {
            sticker: stickerBuffer
        }, { quoted: m });
        
        // Hapus file temporary
        try {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        } catch (e) {}
        // ===================================================
        
        setLimit(m, db);
        m.react('✅');
        
    } catch (e) {
        console.error('Brat Error:', e.message);
        m.react('❌');
        
        m.reply(`❌ Gagal membuat brat sticker!\n\nCoba dengan teks yang lebih pendek.\nContoh: ${prefix + command} halo`);
    }
}
break;

			case 'nuliskanan': case 'nuliskiri': case 'foliokanan': case 'foliokiri': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!text) return m.reply(`Kirim perintah *${prefix + command}* Teksnya`);
				m.react('⏳');

				// Format teks sama seperti di kode asli
				const splitText = text.replace(/(\S+\s*){1,9}/g, '$&\n');
				const fixHeight = splitText.split('\n').slice(0, 31).join('\n');

				let hasil; // Variabel untuk menyimpan path file gambar

				try {
					// 🔥 GANTI API DI SINI
					// Gunakan axios untuk request ke endpoint API baru
					const apiUrl = `https://api.siputzx.my.id/api/m/nulis?text=${encodeURIComponent(fixHeight)}`;
					const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

					// Data gambar dalam bentuk buffer
					const imageBuffer = Buffer.from(response.data);

					// Simpan buffer ke file temporary seperti perilaku  sebelumnya (stream: true)
					const tempFilePath = path.join(process.cwd(), 'database/temp', `${Date.now()}.png`);
					fs.writeFileSync(tempFilePath, imageBuffer);
					hasil = tempFilePath;

					// Kirim gambar ke chat
					await m.reply({ image: { url: hasil }, caption: 'Jangan Malas Lord. Jadilah siswa yang rajin ರ_ರ' });
					setLimit(m, db);

				} catch (e) {
					console.error(e);
					m.reply(global.mess.fail);
				} finally {
					// Hapus file temporary jika ada
					if (hasil && fs.existsSync(hasil)) fs.unlinkSync(hasil);
				}
			}
				break;
			case 'bass': case 'blown': case 'deep': case 'earrape': case 'fast': case 'fat': case 'nightcore': case 'reverse': case 'robot': case 'slow': case 'smooth': case 'tupai': {
				try {
					let set;
					if (/bass/.test(command)) set = '-af equalizer=f=54:width_type=o:width=2:g=20';
					if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log';
					if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3';
					if (/earrape/.test(command)) set = '-af volume=12';
					if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"';
					if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"';
					if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25';
					if (/reverse/.test(command)) set = '-filter_complex "areverse"';
					if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';
					if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"';
					if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';
					if (/tupai/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"';
					if (/audio/.test(mime)) {
						m.react('⏳');
						let media = await axly.downloadAndSaveMediaMessage(qmsg);
						let ran = `./database/temp/${getRandom('.mp3')}`;
						exec(`ffmpeg -i "${media}" ${set} "${ran}"`, async (err, stderr, stdout) => {
							try {
								if (err) return m.reply(global.mess.fail);
								await m.reply({ audio: { url: ran }, mimetype: 'audio/mpeg' });
							} finally {
								if (fs.existsSync(media)) fs.unlinkSync(media);
								if (fs.existsSync(ran)) fs.unlinkSync(ran);
							}
						});
					} else m.reply(`Balas audio yang ingin diubah dengan caption *${prefix + command}*`);
				} catch (e) {
					m.reply(global.mess.fail);
				}
			}
				break;
			case 'tinyurl': case 'shorturl': case 'shortlink': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!text || !isUrl(text)) return m.reply(`Example: ${prefix + command} https://github.com/axlydev/hitori`);
				const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`;
				// Contoh link: https://tinyurl.com/api-create.php?url=https://github.com/axlydev/hitori
				try {
					let res = await axios.get(apiUrl);
					m.reply('Url : ' + res.data);
					setLimit(m, db);
				} catch (e) {
					console.log(e);
					m.reply(global.mess.fail);
				}
			}
				break;
			case 'git': case 'gitclone': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!args[0]) return m.reply(`Example: ${prefix + command} https://github.com/axlydev/hitori`);
				if (!isUrl(args[0]) && !args[0].includes('github.com')) return m.reply('Gunakan Url Github!');
				let [, user, repo] = args[0].match(/(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i) || [];
				try {
					m.reply({ document: { url: `https://api.github.com/repos/${user}/${repo}/zipball` }, fileName: repo + '.zip', mimetype: 'application/zip' }).catch((e) => m.reply(global.mess.error));
					setLimit(m, db);
				} catch (e) {
					m.reply(global.mess.fail);
				}
			}
				break;

			// Ai Menu
			case 'ai': case 'google': case 'bard': case 'gemini': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} halo`);
    m.react('⏳');
    
    try {
        // Buat session ID berdasarkan nomor pengirim (unik per user)
        const sessionId = m.sender.split('@')[0];
        
        // Ganti endpoint ke /ai/openai (karena response yang cocok)
        const apiUrl = `https://axlyapi.qzz.io/ai/openai?text=${encodeURIComponent(text)}&session_id=${sessionId}`;
        const { data } = await axios.get(apiUrl, { timeout: 60000 });

        // Validasi response - struktur berbeda!
        if (data.status && data.result) {
            let response = data.result;
            
            // Kirim jawaban (potong jika terlalu panjang)
            if (response.length > 4000) {
                for (let i = 0; i < response.length; i += 4000) {
                    await m.reply(response.slice(i, i + 4000));
                }
            } else {
                await m.reply(response);
            }
            
            setLimit(m, db);
            m.react('✅');
        } else {
            throw new Error('Gagal mendapatkan respons');
        }
        
    } catch (e) {
        console.error('AI Error:', e.message);
        m.react('❌');
        m.reply(pickRandom([
            'Maaf, AI sedang bermasalah. Coba lagi nanti.',
            'Tidak dapat terhubung ke server AI.',
            'Layanan AI sedang sibuk.',
            'Gagal mendapatkan respons dari AI.'
        ]));
    }
}
break;
			
			case 'melolo': case 'novelsearch': case 'carinovels': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!text) return m.reply(`Example: ${prefix + command} sang dewa`);
				m.react('⏳');

				try {
					const apiUrl = `https://omegatech-api.dixonomega.tech/api/Search/melo?query=${encodeURIComponent(text)}`;
					const { data } = await axios.get(apiUrl, { timeout: 30000 });

					if (data.statusCode !== 200 || !data.result?.success) throw new Error('Gagal mencari');

					const searchData = data.result?.data?.result?.search_data || [];
					let books = [];

					// Kumpulin semua buku dari search_data
					searchData.forEach(item => {
						if (item.books) {
							books = books.concat(...[item.books]);
						}
					});

					if (books.length === 0) throw new Error('Tidak ada hasil');

					// Ambil maks 5 hasil
					const hasil = books.slice(0, 5);

					let caption = `📚 *MELOLO - NOVEL SEARCH*\n\n🔍 *Pencarian:* ${text}\n📊 *Total:* ${books.length} hasil\n\n`;

					hasil.forEach((book, i) => {
						caption += `*${i + 1}.* ${book.book_name || '-'}\n`;
						caption += `   ✍️ *Author:* ${book.author || '-'}\n`;
						caption += `   📊 *Status:* ${book.show_creation_status || '-'}\n`;
						caption += `   📖 *Chapter:* ${book.serial_count || '-'}\n`;
						caption += `   👁️ *Views:* ${book.cover_stat_infos?.[0]?.stat_value || '-'}\n`;
						if (book.abstract) caption += `   📝 *Sinopsis:* ${book.abstract.slice(0, 150)}...\n`;
						caption += `\n`;
					});

					if (books.length > 5) caption += `_...dan ${books.length - 5} hasil lainnya_\n`;
					caption += `\n_${prefix}melolo <judul> untuk cari novel lain_`;

					// Kirim thumbnail buku pertama
					const firstBook = books[0];
					if (firstBook.thumb_url) {
						await axly.sendMessage(
							m.chat,
							{ image: { url: firstBook.thumb_url }, caption },
							{ quoted: m }
						);
					} else {
						await m.reply(caption);
					}

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Novel tidak ditemukan! Coba kata kunci lain.');
				}
			}
				break;
case 'stalkff': case 'ffstalk': case 'freefire': case 'ff': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} 12345678`);
    m.react('⏳');

    try {
        // Endpoint Stalker Free Fire dari AxlyAPI (pake ff.js yang baru)
        const apiUrl = `https://axlyapi.qzz.io/stalk/ff?uid=${encodeURIComponent(text.trim())}`;
        const { data } = await axios.get(apiUrl, { timeout: 20000 });

        // Validasi response
        if (!data.status || !data.result) throw new Error('Akun tidak ditemukan');

        const result = data.result;

        // Format number with dots
        const formatNumber = (num) => {
            if (!num) return '0';
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        };

        // Format rank (sudah ada nama dari API)
        const brRankName = result.rank?.battle_royale?.name || 'Unranked';
        const brRankPoints = result.rank?.battle_royale?.points || 0;
        const csRankName = result.rank?.clash_squad?.name || 'Unranked';
        const csRankPoints = result.rank?.clash_squad?.points || 0;

        // Bikin caption dengan format rapi
        let caption = `🎮 *FREE FIRE STALKER*\n\n`;
        caption += `┌─⊷ *PROFILE*\n`;
        caption += `├ 👤 *Nickname:* ${result.nickname || '-'}\n`;
        caption += `├ 🆔 *UID:* ${result.uid || text}\n`;
        caption += `├ 🌍 *Region:* ${result.region || '-'} ${result.region_flag || ''}\n`;
        caption += `├ ⭐ *Level:* ${result.level || 0}\n`;
        caption += `├ ❤️ *Liked:* ${formatNumber(result.liked)}\n`;
        caption += `├ 📅 *Dibuat:* ${result.created_at || '-'}\n`;
        caption += `├ 🕒 *Login Terakhir:* ${result.last_login || '-'}\n`;
        caption += `├ 📊 *Total EXP:* ${formatNumber(result.exp)}\n`;
        caption += `├ 💳 *Credit Score:* ${result.credit_score || 100}\n`;
        caption += `└─⊷ *RANK*\n\n`;
        
        caption += `┌─⊷ *BATTLE ROYALE*\n`;
        caption += `├ 🏆 *Rank:* ${brRankName}\n`;
        caption += `├ 🎯 *Points:* ${brRankPoints}\n`;
        caption += `└─⊷ *CLASH SQUAD*\n\n`;
        
        caption += `┌─⊷ *CLASH SQUAD RANK*\n`;
        caption += `├ 🎯 *Rank:* ${csRankName}\n`;
        caption += `├ 🎮 *Points:* ${csRankPoints}\n`;
        caption += `└─⊷ *CLAN*\n\n`;
        
        // Clan info
        if (result.clan) {
            caption += `┌─⊷ *CLAN*\n`;
            caption += `├ 🏠 *Name:* ${result.clan.name || '-'}\n`;
            caption += `├ 📊 *Level:* ${result.clan.level || 0}\n`;
            caption += `├ 👥 *Members:* ${result.clan.member_count || 0}\n`;
            caption += `└─⊷ *TITLE*\n\n`;
        }
        
        // Title/Badge
        if (result.title && result.title.name !== 'Unknown Title') {
            caption += `┌─⊷ *TITLE/BADGE*\n`;
            caption += `├ 🏅 *Name:* ${result.title.name || '-'}\n`;
            caption += `├ ✨ *Rarity:* ${result.title.rarity || '-'}\n`;
            if (result.title.desc) caption += `└ 📝 *Desc:* ${result.title.desc}\n\n`;
            else caption += `└─⊷ *PET*\n\n`;
        }
        
        // Pet info
        if (result.pet) {
            caption += `┌─⊷ *PET*\n`;
            caption += `├ 🐾 *Name:* ${result.pet.name || '-'}\n`;
            caption += `├ ⚡ *Skill:* ${result.pet.skill || '-'}\n`;
            caption += `├ ⭐ *Rarity:* ${result.pet.rarity || '-'}\n`;
            caption += `├ 📊 *Level:* ${result.pet.level || 0}\n`;
            caption += `└─⊷ *SIGNATURE*\n\n`;
        }
        
        // Signature
        if (result.signature) {
            caption += `┌─⊷ *SIGNATURE*\n`;
            caption += `└ 📝 ${result.signature.substring(0, 100)}${result.signature.length > 100 ? '...' : ''}\n\n`;
        }
        
        // Equipped Skills (optional, tampilkan 3 aja biar gak kepanjangan)
        if (result.equipment?.equipped_skills && result.equipment.equipped_skills.length > 0) {
            caption += `┌─⊷ *EQUIPPED SKILLS*\n`;
            const skills = result.equipment.equipped_skills.slice(0, 5);
            skills.forEach((skill, i) => {
                caption += `├ ${i+1}. ${skill.name} (${skill.character})\n`;
            });
            if (result.equipment.equipped_skills.length > 5) {
                caption += `├ _...dan ${result.equipment.equipped_skills.length - 5} skill lainnya_\n`;
            }
            caption += `└─⊷ *WEAPON SKINS*\n\n`;
        }
        
        // Weapon Skins (tampilkan 3 aja)
        if (result.weapon_skins && result.weapon_skins.length > 0) {
            caption += `┌─⊷ *WEAPON SKINS*\n`;
            const skins = result.weapon_skins.slice(0, 3);
            skins.forEach((skin, i) => {
                caption += `├ ${i+1}. ${skin.name} (${skin.weapon}) - ${skin.rarity}\n`;
            });
            if (result.weapon_skins.length > 3) {
                caption += `├ _...dan ${result.weapon_skins.length - 3} skin lainnya_\n`;
            }
            caption += `└─⊷ *END*\n\n`;
        }
        
        caption += `_Data diambil dari server resmi Garena_\n`;
        caption += `_Update: ${new Date().toLocaleString('id-ID')}_`;

        await m.reply(caption);
        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Free Fire Stalker Error:', e.message);
        m.react('❌');
        
        if (e.response?.status === 404) {
            m.reply(`❌ UID *"${text}"* tidak ditemukan di Free Fire!\n\nPastikan UID benar (angka 8-9 digit).\nContoh: /stalkff 12345678`);
        } else if (e.code === 'ECONNABORTED') {
            m.reply('❌ Timeout! Server sedang sibuk. Coba lagi nanti.');
        } else {
            m.reply(`❌ Gagal mengambil data Free Fire!\n\nGunakan format: /stalkff <UID>\nContoh: /stalkff 12345678`);
        }
    }
}
break;
case 'bilibili': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} renegade immortal`);
    m.react('⏳');

    try {
        const apiUrl = `https://axlyapi.qzz.io/search/bilibili?q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, { timeout: 20000 });

        if (!data.status || !data.result?.data || data.result.data.length === 0) {
            throw new Error('Tidak ada hasil');
        }

        const results = data.result.data.slice(0, 5);
        let caption = `🎬 *DONGHUA / BILIBILI SEARCH*\n\n`;
        caption += `🔍 *Pencarian:* ${data.result.query || text}\n`;
        caption += `📊 *Total:* ${data.result.total || results.length} hasil\n`;
        caption += `📺 *Provider:* Bilibili.tv\n\n`;

        results.forEach((item, i) => {
            caption += `*${i + 1}.* ${item.title}\n`;
            caption += `   ⏱️ Durasi: ${item.duration || '-'}\n`;
            caption += `   👤 Author: ${item.author?.username || 'Unknown'}\n`;
            caption += `   👁️ Views: ${item.views || '-'}\n`;
            caption += `   🔗 Link: ${item.video_url}\n\n`;
        });

        if (data.result.total > 5) {
            caption += `_...dan ${data.result.total - 5} hasil lainnya_`;
        }

        const firstThumb = results[0]?.cover_url;
        if (firstThumb && firstThumb.startsWith('http')) {
            await axly.sendMessage(
                m.chat,
                { image: { url: firstThumb }, caption },
                { quoted: m }
            );
        } else {
            await m.reply(caption);
        }

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Bilibili Error:', e.message);
        m.react('❌');
        m.reply(`❌ Donghua *"${text}"* tidak ditemukan! Coba kata kunci lain.`);
    }
}
break;
			// Search Menu
			case 'gimage': case 'bingimg': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!text) return m.reply(`Example: ${prefix + command} kucing`);
				m.react('⏳');
				try {
					const apiUrl = `https://api.siputzx.my.id/api/s/bimg?query=${encodeURIComponent(text)}`;
					const { data } = await axios.get(apiUrl);

					if (!data.status || !data.data || data.data.length === 0) throw new Error('empty');

					const randomImage = pickRandom(data.data);
					await m.reply({ image: { url: randomImage }, caption: `Hasil pencarian: ${text}` });
					setLimit(m, db);
				} catch (e) {
					console.log(e);
					m.reply('Pencarian gambar tidak ditemukan!');
				}
			}
				break;
			case 'blurface': case 'blurwajah': case 'blur': {
				if (!isLimit) return m.reply(global.mess.limit);

				let mediaMsg = m.quoted ? m.quoted : m;
				let mime = (mediaMsg.msg || mediaMsg).mimetype || '';

				if (!/image/.test(mime)) return m.reply(`⚠️ Reply/Kirim gambar dengan caption *${prefix + command}*`);

				m.react('⏳');
				let mediaPath = null;

				try {
					mediaPath = await axly.downloadAndSaveMediaMessage(mediaMsg);

					// Upload ke UguuSe dulu
					let upload = await UguuSe(mediaPath);
					if (!upload?.url) throw new Error('Upload gagal');

					// Panggil API blurface
					let api = `https://api.danzy.web.id/api/maker/blurface?url=${encodeURIComponent(upload.url)}`;

					const res = await axios.get(api, { responseType: 'arraybuffer', timeout: 30000 });
					const buffer = Buffer.from(res.data);

					await axly.sendMessage(
						m.chat,
						{ image: buffer, caption: '✅ Blur Face Done' },
						{ quoted: m }
					);

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal blur wajah!');
				} finally {
					if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
				}
			}
				break;
			case 'toanime': case 'jadianime': case 'animein': {
    if (!isLimit) return m.reply(global.mess.limit);

    let mediaMsg = m.quoted ? m.quoted : m;
    let mime = (mediaMsg.msg || mediaMsg).mimetype || '';

    if (!/image/.test(mime)) return m.reply(`⚠️ Reply/Kirim gambar dengan caption *${prefix + command}*`);

    m.react('⏳');
    let mediaPath = null;

    try {
        mediaPath = await axly.downloadAndSaveMediaMessage(mediaMsg);

        // Upload ke UguuSe dulu
        let upload = await UguuSe(mediaPath);
        if (!upload?.url) throw new Error('Upload gagal');

        // Panggil API toanime dari AxlyAPI
        let apiUrl = `https://axlyapi.qzz.io/maker/toanime?url=${encodeURIComponent(upload.url)}`;

        const res = await axios.get(apiUrl, { 
            responseType: 'arraybuffer', 
            timeout: 60000 
        });
        
        const buffer = Buffer.from(res.data);
        
        // Cek apakah response berupa gambar (bukan JSON error)
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            // Jika ternyata return JSON, parse dan cek
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal convert ke anime');
            } catch (jsonErr) {
                // Bukan JSON, lanjut kirim gambar
            }
        }

        await axly.sendMessage(
            m.chat,
            { image: buffer, caption: '✨ *To Anime Success!*\n\nGambar telah berhasil diubah ke gaya anime.' },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('ToAnime Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal convert ke anime! Coba lagi nanti dengan gambar yang lebih jelas.');
    } finally {
        if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    }
}
break;
			case 'toreal': case 'torealistic': case 'jadinyata': {
				if (!isLimit) return m.reply(global.mess.limit);

				let mediaMsg = m.quoted ? m.quoted : m;
				let mime = (mediaMsg.msg || mediaMsg).mimetype || '';

				if (!/image/.test(mime)) return m.reply(`⚠️ Reply/Kirim gambar dengan caption *${prefix + command}*`);

				m.react('⏳');
				let mediaPath = null;

				try {
					mediaPath = await axly.downloadAndSaveMediaMessage(mediaMsg);

					// Upload ke UguuSe dulu
					let upload = await UguuSe(mediaPath);
					if (!upload?.url) throw new Error('Upload gagal');

					// Panggil API torealistic
					let api = `https://www.neoapis.xyz/api/ai-image/torealistic?url=${encodeURIComponent(upload.url)}`;

					const res = await axios.get(api, { responseType: 'arraybuffer', timeout: 60000 });
					const buffer = Buffer.from(res.data);

					await axly.sendMessage(
						m.chat,
						{ image: buffer, caption: '✅ To Realistic Done' },
						{ quoted: m }
					);

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal convert ke realistik!');
				} finally {
					if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
				}
			}
				break;
			case 'tohitam': case 'hitamkan': {
    if (!isLimit) return m.reply(global.mess.limit);

    let mediaMsg = m.quoted ? m.quoted : m;
    let mime = (mediaMsg.msg || mediaMsg).mimetype || '';

    if (!/image/.test(mime)) {
        return m.reply(`⚠️ Reply/Kirim gambar dengan caption *${prefix + command}*`);
    }

    m.react('⏳');
    let mediaPath = null;

    try {
        mediaPath = await axly.downloadAndSaveMediaMessage(mediaMsg);
        let buf = fs.readFileSync(mediaPath);

        let form = new FormData();
        form.append('image', buf, { filename: 'image.jpg', contentType: 'image/jpeg' });

        let { data } = await axios.post('https://api.fvckers.my.id/api/image/tohitam?apikey=FVCKX', form, {
            headers: form.getHeaders(),
            timeout: 120000
        });

        if (data?.result?.image_url) {
            await axly.sendMessage(m.chat, {
                image: { url: data.result.image_url },
                caption: '✅ ToHitam'
            }, { quoted: m });

            setLimit(m, db);
            m.react('✅');
        } else {
            throw new Error('Gagal');
        }

    } catch (e) {
        console.error(e);
        m.react('❌');
        m.reply('❌ Gagal: ' + e.message);
    } finally {
        if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    }
}
break


			// Stalker Menu
			case 'wastalk': case 'whatsappstalk': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!text) return m.reply(`Example: ${prefix + command} @tag / 628xxx`);
				try {
					let num = m.quoted?.sender || m.mentionedJid?.[0] || text;
					if (!num) return m.reply(`Example : ${prefix + command} @tag / 628xxx`);
					num = num.replace(/\D/g, '') + '@s.whatsapp.net';
					if (!(await axly.onWhatsApp(num))[0]?.exists) return m.reply('Nomer tidak terdaftar di WhatsApp!');
					let img = await axly.profilePictureUrl(num, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60');
					let bio = await axly.fetchStatus(num).catch(_ => { });
					let name = await axly.getName(num);
					let business = await axly.getBusinessProfile(num);
					let format = PhoneNum(`+${num.split('@')[0]}`);
					let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
					let country = regionNames.of(format.getRegionCode('international'));
					let wea = `WhatsApp Stalk\n\n*° Country :* ${country.toUpperCase()}\n*° Name :* ${name ? name : '-'}\n*° Format Number :* ${format.getNumber('international')}\n*° Url Api :* wa.me/${num.split('@')[0]}\n*° Mentions :* @${num.split('@')[0]}\n*° Status :* ${bio?.status || '-'}\n*° Date Status :* ${bio?.setAt ? moment(bio.setAt.toDateString()).locale(global.locale).format('LL') : '-'}\n\n${business ? `*WhatsApp Business Stalk*\n\n*° BusinessId :* ${business.wid}\n*° Website :* ${business.website ? business.website : '-'}\n*° Email :* ${business.email ? business.email : '-'}\n*° Category :* ${business.category}\n*° Address :* ${business.address ? business.address : '-'}\n*° Timeone :* ${business.business_hours.timezone ? business.business_hours.timezone : '-'}\n*° Description* : ${business.description ? business.description : '-'}` : '*Standard WhatsApp Account*'}`;
					img ? await axly.sendMessage(m.chat, { image: { url: img }, caption: wea, mentions: [num] }, { quoted: m }) : m.reply(wea);
				} catch (e) {
					m.reply('Nomer Tidak ditemukan!');
				}
			}
				break;
			case 'genshinstalk': case 'genshin': case 'gistalk': case 'gi': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`⚠️ Masukkan UID Genshin Impact!\n\nExample: ${prefix + command} 856012067`);

    m.react('⏳');

    try {
        // Endpoint Stalker Genshin dari AxlyAPI
        let api = `https://axlyapi.qzz.io/stalker/genshin?id=${encodeURIComponent(text)}`;
        const res = await axios.get(api, { timeout: 30000 });

        // Validasi response
        if (!res.data?.status || !res.data?.result) throw new Error('UID tidak ditemukan');

        const data = res.data.result;

        // Format data
        const uid = data.uid || text;
        const nickname = data.nickname || '-';
        const level = data.level || '-';
        const worldLevel = data.world_level || '-';
        const achievements = data.achievements || 0;
        const activeDays = data.active_days || 0;
        const characters = data.characters || 0;
        const spiralAbyss = data.spiral_abyss || '-';
        const server = data.server || '-';
        const avatarUrl = data.avatar;

        // Konversi server ke nama yang lebih familiar
        let serverName = server;
        if (server === 'os_asia') serverName = 'Asia';
        else if (server === 'os_usa') serverName = 'America';
        else if (server === 'os_euro') serverName = 'Europe';
        else if (server === 'os_cht') serverName = 'Taiwan/HK/Macau';

        // Bikin caption dengan format rapi
        let caption = `✨ *GENSHIN IMPACT STALKER*\n\n`;
        caption += `┌─⊷ *PROFILE*\n`;
        caption += `├ 👤 *Nickname:* ${nickname}\n`;
        caption += `├ 🆔 *UID:* ${uid}\n`;
        caption += `├ 🌍 *Server:* ${serverName}\n`;
        caption += `├ ⭐ *Adventure Rank:* ${level}\n`;
        caption += `├ 🌎 *World Level:* ${worldLevel}\n`;
        caption += `└─⊷ *STATISTICS*\n\n`;
        
        caption += `┌─⊷ *ACHIEVEMENTS*\n`;
        caption += `├ 🏆 *Achievements:* ${achievements.toLocaleString()}\n`;
        caption += `├ 📅 *Active Days:* ${activeDays.toLocaleString()}\n`;
        caption += `├ 👥 *Characters Owned:* ${characters}\n`;
        caption += `├ 🗡️ *Spiral Abyss:* ${spiralAbyss}\n`;
        caption += `└─⊷ *INFO*\n\n`;
        
        caption += `┌─⊷ *DETAILS*\n`;
        caption += `├ 📊 *Total Achievements:* ${achievements.toLocaleString()}/??\n`;
        caption += `├ 🎮 *Game:* Genshin Impact\n`;
        caption += `└─⊷ *END*\n\n`;
        
        caption += `_Data diambil dari server resmi Hoyoverse_\n`;
        caption += `_Update: ${new Date().toLocaleString('id-ID')}_`;

        // Kirim avatar jika ada
        if (avatarUrl && avatarUrl.startsWith('http')) {
            await axly.sendMessage(
                m.chat,
                { image: { url: avatarUrl }, caption },
                { quoted: m }
            );
        } else {
            await m.reply(caption);
        }

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Genshin Stalker Error:', e.message);
        m.react('❌');
        
        if (e.response?.status === 404) {
            m.reply(`❌ UID *"${text}"* tidak ditemukan di Genshin Impact!\n\nPastikan UID benar (angka 9 digit).\nContoh: /genshinstalk 856012067`);
        } else if (e.code === 'ECONNABORTED') {
            m.reply('❌ Timeout! Server sedang sibuk. Coba lagi nanti.');
        } else {
            m.reply(`❌ Gagal mengambil data Genshin Impact!\n\nGunakan format: /genshinstalk <UID>\nContoh: /genshinstalk 856012067`);
        }
    }
}
break;
case 'robloxstalk': case 'rbstalk': case 'rbxstalk': case 'roblox': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`⚠️ Masukkan Username Roblox!\n\nExample: ${prefix + command} bulderman`);

    m.react('⏳');

    try {
        // Endpoint Stalker Roblox dari AxlyAPI
        let api = `https://axlyapi.qzz.io/stalker/roblox?username=${encodeURIComponent(text)}`;
        const res = await axios.get(api, { timeout: 15000 });

        // Validasi response
        if (!res.data?.status || !res.data?.result) throw new Error('User tidak ditemukan');

        const data = res.data.result;

        // Format created date
        let createdDate = data.created || '-';
        try {
            const date = new Date(data.created);
            if (!isNaN(date.getTime())) {
                createdDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            }
        } catch (e) {}

        // Bikin caption dengan format rapi
        let caption = `🎮 *ROBLOX STALKER*\n\n`;
        caption += `┌─⊷ *PROFILE*\n`;
        caption += `├ 👤 *Username:* ${data.username || '-'}\n`;
        caption += `├ 📛 *Display:* ${data.display_name || data.username || '-'}\n`;
        caption += `├ 🆔 *User ID:* ${data.user_id || '-'}\n`;
        caption += `├ 📅 *Created:* ${createdDate}\n`;
        caption += `├ 🚫 *Banned:* ${data.is_banned ? '✅ Ya' : '❌ Tidak'}\n`;
        caption += `└─⊷ *BIO*\n\n`;
        
        // Description
        if (data.description && data.description !== '-') {
            const desc = data.description.length > 200 ? data.description.substring(0, 200) + '...' : data.description;
            caption += `📝 *Bio:* ${desc}\n\n`;
        } else {
            caption += `📝 *Bio:* -\n\n`;
        }
        
        // Status presence
        if (data.presence) {
            caption += `┌─⊷ *STATUS*\n`;
            caption += `├ 🟢 *Status:* ${data.presence.status || 'Offline'}\n`;
            if (data.presence.lastOnline) {
                caption += `├ ⏱️ *Last Online:* ${data.presence.lastOnline}\n`;
            }
            caption += `└─⊷ *SOCIAL*\n\n`;
        }
        
        // Social stats
        if (data.social) {
            caption += `┌─⊷ *SOCIAL STATS*\n`;
            caption += `├ 👥 *Friends:* ${data.social.friends?.toLocaleString() || 0}\n`;
            caption += `├ 📢 *Followers:* ${data.social.followers?.toLocaleString() || 0}\n`;
            caption += `├ 👣 *Following:* ${data.social.following?.toLocaleString() || 0}\n`;
            caption += `└─⊷ *GROUPS & GAMES*\n\n`;
        }
        
        // Groups
        if (data.groups && data.groups.total > 0) {
            caption += `┌─⊷ *GROUPS (${data.groups.total})*\n`;
            const topGroups = data.groups.list?.slice(0, 5) || [];
            topGroups.forEach((group, i) => {
                caption += `├ ${i+1}. ${group.name}\n`;
                caption += `│  └ Role: ${group.role} (Rank ${group.rank})\n`;
            });
            if (data.groups.total > 5) {
                caption += `├ _...dan ${data.groups.total - 5} grup lainnya_\n`;
            }
            caption += `└─⊷ *GAMES*\n\n`;
        } else {
            caption += `┌─⊷ *GROUPS*\n`;
            caption += `└ ❌ Tidak bergabung dengan grup apapun\n\n`;
        }
        
        // Games
        if (data.games && data.games.total > 0) {
            caption += `┌─⊷ *GAMES (${data.games.total})*\n`;
            const topGames = data.games.list?.slice(0, 3) || [];
            topGames.forEach((game, i) => {
                caption += `├ ${i+1}. ${game.name}\n`;
                if (game.visits) caption += `│  └ 👁️ ${game.visits.toLocaleString()} visits\n`;
            });
            if (data.games.total > 3) {
                caption += `├ _...dan ${data.games.total - 3} game lainnya_\n`;
            }
            caption += `└─⊷ *END*\n\n`;
        }
        
        caption += `_Data diambil dari server resmi Roblox_\n`;
        caption += `_Update: ${new Date().toLocaleString('id-ID')}_`;

        // Ambil avatar (prioritas avatar_url atau avatar)
        let avatarUrl = data.avatar_url || data.avatar;
        if (!avatarUrl && data.avatar?.full_body) {
            avatarUrl = data.avatar.full_body;
        }

        if (avatarUrl && avatarUrl.startsWith('http')) {
            await axly.sendMessage(
                m.chat,
                { image: { url: avatarUrl }, caption },
                { quoted: m }
            );
        } else {
            await m.reply(caption);
        }

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Roblox Stalker Error:', e.message);
        m.react('❌');
        
        if (e.response?.status === 404) {
            m.reply(`❌ User *"${text}"* tidak ditemukan di Roblox!\n\nPastikan username benar.\nContoh: /robloxstalk bulderman`);
        } else if (e.code === 'ECONNABORTED') {
            m.reply('❌ Timeout! Server sedang sibuk. Coba lagi nanti.');
        } else {
            m.reply(`❌ Gagal mengambil data Roblox!\n\nGunakan format: /robloxstalk <username>\nContoh: /robloxstalk bulderman`);
        }
    }
}
break;
			case 'ghstalk': case 'githubstalk': {
				if (!isLimit) return m.reply(global.mess.limit);
				if (!text) return m.reply(`Example: ${prefix + command} usernamenya`);
				try {
					const res = await fetchJson('https://api.github.com/users/' + text);
					m.reply({ image: { url: res.avatar_url }, caption: `*Username :* ${res.login}\n*Nickname :* ${res.name || 'Tidak ada'}\n*Bio :* ${res.bio || 'Tidak ada'}\n*ID :* ${res.id}\n*Node ID :* ${res.node_id}\n*Type :* ${res.type}\n*Admin :* ${res.admin ? 'Ya' : 'Tidak'}\n*Company :* ${res.company || 'Tidak ada'}\n*Blog :* ${res.blog || 'Tidak ada'}\n*Location :* ${res.location || 'Tidak ada'}\n*Email :* ${res.email || 'Tidak ada'}\n*Public Repo :* ${res.public_repos}\n*Public Gists :* ${res.public_gists}\n*Followers :* ${res.followers}\n*Following :* ${res.following}\n*Created At :* ${res.created_at} *Updated At :* ${res.updated_at}` });
				} catch (e) {
					m.reply('Username Tidak ditemukan!');
				}
			}
				break;

			// Downloader Menu
case 'ytmp3': case 'ytaudio': case 'mp3': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} https://youtube.com/watch?v=bnVUHWCynig`);
    if (!text.includes('youtu')) return m.reply('❌ URL tidak valid! Masukkan URL YouTube yang benar.');

    m.react('⏳');
    try {
        let { data } = await axios.get(`https://axlyapi.qzz.io/download/ytmp3?url=${encodeURIComponent(text.trim())}`, { timeout: 30000 });

        if (!data || data.status !== true) throw new Error(data?.message || 'API error');

        let audios = data?.result?.all_audios || [];
        if (data?.result?.audio && !audios.length) audios = [data.result.audio];
        if (!audios.length) throw new Error('Gagal ambil audio');

        let title = data?.result?.title || 'YouTube Audio';
        let duration = data?.result?.duration || '-';

        let parseSize = s => parseFloat(s) * (s.includes('GB') ? 1024 : 1);
        let sorted = [...audios].sort((a, b) => parseSize(a.size) - parseSize(b.size));

        let audBuf, chosen;
        for (let aud of sorted) {
            if (!aud.url) continue;
            for (let i = 0; i < 3; i++) {
                try {
                    let worker = await axios.get(aud.url, {
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        timeout: 15000
                    });
                    let fileUrl = worker.data?.fileUrl || worker.data?.viewUrl;
                    if (!fileUrl) continue;

                    let dl = await axios.get(fileUrl, {
                        responseType: 'arraybuffer',
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        timeout: 60000,
                        httpsAgent: new (require('https').Agent)({ family: 4 })
                    });

                    if (dl.data) {
                        audBuf = Buffer.from(dl.data);
                        chosen = aud;
                        break;
                    }
                } catch (_) {
                    await new Promise(r => setTimeout(r, 1500));
                }
            }
            if (audBuf) break;
        }

        if (!audBuf) throw new Error('Gagal download, coba lagi');

        // Convert ke mp3 pake ffmpeg (pake Promise)
        let mp3Buf = await new Promise((resolve, reject) => {
            let chunks = [];
            let stream = require('stream').Readable.from(audBuf);
            require('fluent-ffmpeg')()
                .input(stream)
                .audioCodec('libmp3lame')
                .format('mp3')
                .pipe()
                .on('data', c => chunks.push(c))
                .on('end', () => resolve(Buffer.concat(chunks)))
                .on('error', reject);
        });

        await axly.sendMessage(m.chat, {
            audio: mp3Buf,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `${title}.mp3`
        }, { quoted: m });

        setLimit(m, db);
        m.react('✅');
    } catch (e) {
        console.error('[ytmp3]', e?.message);
        m.react('❌');
        m.reply(`❌ Error: ${e.message}`);
    }
}
break;
case 'play': case 'ytplay': case 'yts': case 'ytsearch': case 'youtubesearch': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} one punch man`);
    m.react('⏳');

    try {
        // Endpoint Search YouTube dari AxlyAPI
        const searchUrl = `https://axlyapi.qzz.io/search/youtube?q=${encodeURIComponent(text)}&limit=1`;
        const { data } = await axios.get(searchUrl, { timeout: 15000 });

        // Validasi response
        if (!data.status || !data.result || data.result.length === 0) {
            throw new Error('Tidak ada hasil');
        }

        const video = data.result[0];
        const videoUrl = video.link;
        const title = video.title || 'YouTube Video';
        const channel = video.channel || 'Unknown';
        const duration = video.duration || '-';
        const thumbnail = video.imageUrl || video.thumbnail || 'https://i.ytimg.com/vi/default/hqdefault.jpg';

        // Caption dengan informasi video
        let caption = `🎬 *YOUTUBE VIDEO*\n\n`;
        caption += `📌 *Title:* ${title}\n`;
        caption += `👤 *Channel:* ${channel}\n`;
        caption += `⏱️ *Duration:* ${duration}\n`;
        caption += `🔗 *Link:* ${videoUrl}\n\n`;
        caption += `_Klik tombol di bawah untuk download_`;

        // Kirim pake sendButtonMsg (kayak contoh lo)
        let { key } = await axly.sendButtonMsg(m.chat, { 
            image: { url: thumbnail }, 
            caption: caption, 
            footer: `YouTube Downloader • ${new Date().toLocaleString('id-ID')}`, 
            buttons: [ 
                { buttonId: `${prefix}ytmp3 ${videoUrl}`, buttonText: { displayText: '🎵 Download MP3' }, type: 1 }, 
                { buttonId: `${prefix}ytmp4 ${videoUrl}`, buttonText: { displayText: '📹 Download MP4' }, type: 1 } 
            ] 
        }, { quoted: m });

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('YouTube Search Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal mencari video!\n\nCoba dengan kata kunci lain.\nContoh: /play one punch man');
    }
}
break;
case 'axly': {
    if (!m.key.fromMe && budy.toLowerCase() === 'axly') {
        m.reply('axly cantik banget')
    }
}
break
case 'ytmp4': case 'ytvideo': case 'mp4': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} https://youtube.com/watch?v=bnVUHWCynig`);
    if (!text.includes('youtu')) return m.reply('❌ URL tidak valid! Masukkan URL YouTube yang benar.');

    m.react('⏳');
    try {
        let { data } = await axios.get(`https://axlyapi.qzz.io/download/ytmp4?url=${encodeURIComponent(text.trim())}`, { timeout: 30000 });

        if (!data || data.status !== true) throw new Error(data?.message || 'API error');

        let videos = data?.result?.videos || [];
        if (!videos.length) throw new Error('Gagal ambil video');

        let title = data?.result?.title || 'YouTube Video';
        let duration = data?.result?.duration || '-';

        // Urutin dari kecil biar cepet
        let parseSize = s => parseFloat(s) * (s.includes('GB') ? 1024 : 1);
        let sorted = [...videos].sort((a, b) => parseSize(a.size) - parseSize(b.size));

        let vidBuf, chosen;
        for (let vid of sorted) {
            if (!vid.url) continue;
            for (let i = 0; i < 3; i++) {
                try {
                    // Ambil fileUrl asli dari worker03
                    let worker = await axios.get(vid.url, {
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        timeout: 15000
                    });
                    let fileUrl = worker.data?.fileUrl || worker.data?.viewUrl;
                    if (!fileUrl) continue;

                    // Download video asli
                    let dl = await axios.get(fileUrl, {
                        responseType: 'arraybuffer',
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        timeout: 60000,
                        httpsAgent: new (require('https').Agent)({ family: 4 })
                    });

                    if (dl.data) {
                        vidBuf = Buffer.from(dl.data);
                        chosen = vid;
                        break;
                    }
                } catch (_) {
                    await new Promise(r => setTimeout(r, 1500));
                }
            }
            if (vidBuf) break;
        }

        if (!vidBuf) throw new Error('Gagal download, coba lagi');

        let sizeMB = vidBuf.length / (1024 * 1024);
        if (sizeMB > 100) {
            m.react('❌');
            return m.reply(`❌ Kegedean (${sizeMB.toFixed(2)} MB). Max 100 MB.`);
        }

        await axly.sendMessage(m.chat, {
            video: vidBuf,
            mimetype: 'video/mp4',
            caption: `✅ *YTMP4 Sukses*\n\n📌 *Judul:* ${title}\n🎬 *Resolusi:* ${chosen.resolution || '-'}\n🏷️ *Kualitas:* ${chosen.quality || '-'}\n📦 *Ukuran:* ${chosen.size || `${sizeMB.toFixed(2)} MB`}\n⏱️ *Durasi:* ${duration}`
        }, { quoted: m });

        setLimit(m, db);
        m.react('✅');
    } catch (e) {
        console.error('[ytmp4]', e?.message);
        m.react('❌');
        m.reply(`❌ Error: ${e.message}`);
    }
}
break;
			case 'tofigura': case 'tofigure': case 'jadi3d': {
    if (!isLimit) return m.reply(global.mess.limit);

    let mediaMsg = m.quoted ? m.quoted : m;
    let mime = (mediaMsg.msg || mediaMsg).mimetype || '';

    if (!/image/.test(mime)) {
        return m.reply(`⚠️ Reply/Kirim gambar dengan caption *${prefix + command}*`);
    }

    m.react('⏳');
    let mediaPath = null;

    try {
        mediaPath = await axly.downloadAndSaveMediaMessage(mediaMsg);

        // Upload ke UguuSe dulu
        let upload = await UguuSe(mediaPath);
        if (!upload?.url) throw new Error('Upload gagal');

        // Panggil API tofigure dari AxlyAPI
        let apiUrl = `https://axlyapi.qzz.io/maker/tofigure?url=${encodeURIComponent(upload.url)}`;

        const res = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 120000
        });
        
        const buffer = Buffer.from(res.data);
        
        // Cek apakah response berupa gambar (bukan JSON error)
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            // Jika ternyata return JSON, parse dan cek
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal convert ke figure');
            } catch (jsonErr) {
                // Bukan JSON, lanjut kirim gambar
            }
        }

        await axly.sendMessage(
            m.chat,
            { image: buffer, caption: '✨ *To Figure 3D Success!*\n\nGambar telah berhasil diubah ke gaya figure 3D.' },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('ToFigure Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal mengubah ke figure 3D! Coba lagi nanti dengan gambar yang lebih jelas.');
    } finally {
        if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    }
}
break;
case 'rbg': case 'removebg': case 'removebackground': case 'hapusbg': {
    if (!isLimit) return m.reply(global.mess.limit);

    let mediaMsg = m.quoted ? m.quoted : m;
    let mime = (mediaMsg.msg || mediaMsg).mimetype || '';

    if (!/image/.test(mime)) {
        return m.reply(`⚠️ Reply/Kirim gambar dengan caption *${prefix + command}*`);
    }

    m.react('⏳');
    let mediaPath = null;

    try {
        mediaPath = await axly.downloadAndSaveMediaMessage(mediaMsg);

        // Upload ke UguuSe dulu
        let upload = await UguuSe(mediaPath);
        if (!upload?.url) throw new Error('Upload gagal');

        // Panggil API removebg dari AxlyAPI
        let apiUrl = `https://axlyapi.qzz.io/tools/removebg?url=${encodeURIComponent(upload.url)}`;

        const res = await axios.get(apiUrl, { 
            responseType: 'arraybuffer', 
            timeout: 60000 
        });
        
        const buffer = Buffer.from(res.data);
        
        // Cek apakah response berupa gambar (bukan JSON error)
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            // Jika ternyata return JSON, parse dan cek
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal remove background');
            } catch (jsonErr) {
                // Bukan JSON, lanjut kirim gambar
            }
        }

        await axly.sendMessage(
            m.chat,
            { image: buffer, caption: '✨ *Remove Background Success!*\n\nBackground telah berhasil dihapus.\n\n_Hasil berupa PNG dengan transparansi_' },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('RemoveBG Error:', e.message);
        m.react('❌');
        
        // Fallback: Coba dengan endpoint mirror jika tersedia
        try {
            const fallbackUrl = `https://axlyapi.qzz.io/tools/removebg?url=${encodeURIComponent(upload?.url || '')}&mirror=true`;
            const resFallback = await axios.get(fallbackUrl, { 
                responseType: 'arraybuffer', 
                timeout: 60000 
            });
            
            if (resFallback.data && resFallback.headers['content-type']?.includes('image')) {
                const bufferFallback = Buffer.from(resFallback.data);
                await axly.sendMessage(
                    m.chat,
                    { image: bufferFallback, caption: '✨ *Remove Background Success (Mirror)!*' },
                    { quoted: m }
                );
                setLimit(m, db);
                m.react('✅');
                return;
            }
        } catch (fallbackErr) {
            console.error('Fallback Error:', fallbackErr.message);
        }
        
        m.reply('❌ Gagal remove background! Coba lagi nanti dengan gambar yang lebih jelas.');
    } finally {
        if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    }
}
break;
case 'ig': case 'instagram': case 'instadl': case 'igdown': case 'igdl': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} https://www.instagram.com/reel/DV--z9bE09N/`);
    if (!text.includes('instagram.com')) return m.reply('❌ URL tidak valid! Masukkan URL Instagram yang benar.');
    m.react('⏳');

    try {
        // Endpoint Instagram Downloader dari AxlyAPI
        const apiUrl = `https://axlyapi.qzz.io/download/igdl?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        // Validasi response
        if (!data.status || !data.result || !data.result.video_url) {
            throw new Error('Gagal mendapatkan data');
        }

        const result = data.result;
        const videoUrl = result.video_url;
        const thumbnail = result.thumbnail;
        const allLinks = result.all_download_links || [];

        // Pilih video URL (prioritas video_url, fallback ke link pertama)
        let selectedUrl = videoUrl;
        if (!selectedUrl && allLinks.length > 0) {
            selectedUrl = allLinks[0];
        }

        if (!selectedUrl) throw new Error('Video URL tidak ditemukan');

        // Download video sebagai buffer
        const vidRes = await axios.get(selectedUrl, {
            responseType: 'arraybuffer',
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Referer': 'https://www.instagram.com/'
            }
        });

        const buffer = Buffer.from(vidRes.data);
        const fileSizeMB = buffer.length / (1024 * 1024);

        if (fileSizeMB > 100) {
            m.react('❌');
            return m.reply(`❌ Video terlalu besar (${fileSizeMB.toFixed(2)} MB). Maksimal 100 MB.`);
        }

        // Kirim video
        await axly.sendMessage(
            m.chat,
            {
                video: buffer,
                caption: `📹 *INSTAGRAM DOWNLOADER*\n\n` +
                    `✅ *Status:* Berhasil diunduh\n` +
                    `📦 *Ukuran:* ${fileSizeMB.toFixed(2)} MB\n` +
                    `🔗 *Sumber:* Instagram\n\n` +
                    `_Download by AxlyAPI_`,
                mimetype: 'video/mp4'
            },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Instagram Download Error:', e.message);
        m.react('❌');
        
        // Fallback: Coba dengan endpoint v2
        try {
            const fallbackUrl = `https://axlyapi.qzz.io/download/igdl?url=${encodeURIComponent(text)}&v=2`;
            const fallbackRes = await axios.get(fallbackUrl, { timeout: 30000 });
            
            if (fallbackRes.data.status && fallbackRes.data.result?.video_url) {
                const fallbackVideo = fallbackRes.data.result.video_url;
                const fallbackBuffer = await axios.get(fallbackVideo, { responseType: 'arraybuffer' });
                
                await axly.sendMessage(
                    m.chat,
                    { video: Buffer.from(fallbackBuffer.data), caption: '📹 Instagram Video (Fallback)' },
                    { quoted: m }
                );
                setLimit(m, db);
                m.react('✅');
                return;
            }
        } catch (fallbackErr) {
            console.error('Fallback Error:', fallbackErr.message);
        }
        
        m.reply('❌ Gagal download video Instagram!\n\nPastikan URL valid:\n- Reel: instagram.com/reel/...\n- TV: instagram.com/tv/...\n- Postingan: instagram.com/p/...\n\n*Catatan:* Akun private tidak bisa di-download.');
    }
}
break;
			case 'tiktok': case 'tiktokdown': case 'ttdown': case 'ttdl': case 'tt': case 'ttmp4': case 'ttvideo': case 'tiktokmp4': case 'tiktokvideo': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} https://vt.tiktok.com/ZSxa38TX3/`);
    if (!text.includes('tiktok.com')) return m.reply('❌ URL tidak valid! Masukkan URL TikTok yang benar.');
    m.react('⏳');

    try {
        // Endpoint TikTok Downloader dari AxlyAPI
        const apiUrl = `https://axlyapi.qzz.io/download/tiktok?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });

        // Validasi response
        if (!data.status || !data.result || !data.result.data) {
            throw new Error('Gagal mendapatkan data');
        }

        const result = data.result;
        const tiktokData = result.data || {};
        
        // ========== CEK SLIDESHOW (FOTO) ==========
        if (tiktokData.images && tiktokData.images.length > 0) {
            // Ini adalah slideshow (foto)
            const author = tiktokData.author?.nickname || 'Unknown';
            const uniqueId = tiktokData.author?.unique_id || '-';
            const captionText = tiktokData.title || 'TikTok Slideshow';
            const images = tiktokData.images;
            const playCount = tiktokData.play_count || 0;
            const diggCount = tiktokData.digg_count || 0;
            const commentCount = tiktokData.comment_count || 0;
            const shareCount = tiktokData.share_count || 0;
            
            const infoText = `📸 *TIKTOK SLIDESHOW*\n\n` +
                `👤 *Author:* ${author} (@${uniqueId})\n` +
                `📝 *Caption:* ${captionText.substring(0, 100)}${captionText.length > 100 ? '...' : ''}\n` +
                `🖼️ *Jumlah Foto:* ${images.length}\n` +
                `👁️ *Views:* ${playCount.toLocaleString()}\n` +
                `❤️ *Likes:* ${diggCount.toLocaleString()}\n` +
                `💬 *Comments:* ${commentCount.toLocaleString()}\n` +
                `↗️ *Shares:* ${shareCount.toLocaleString()}\n\n` +
                `_Download by AxlyAPI_`;
            
            // Kirim info terlebih dahulu
            await m.reply(infoText);
            
            // Kirim semua foto satu per satu
            let successCount = 0;
            for (let i = 0; i < images.length; i++) {
                try {
                    const imgBuffer = await axios.get(images[i], {
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                            'Referer': 'https://www.tiktok.com/'
                        }
                    });
                    
                    await axly.sendMessage(
                        m.chat,
                        {
                            image: Buffer.from(imgBuffer.data),
                            caption: `${i+1}/${images.length} 📸`
                        },
                        { quoted: m }
                    );
                    successCount++;
                    
                    // Jeda 500ms biar tidak kena limit
                    await new Promise(r => setTimeout(r, 500));
                    
                } catch (imgErr) {
                    console.error(`Gagal kirim foto ${i+1}:`, imgErr.message);
                    await m.reply(`⚠️ Gagal mengirim foto ${i+1}/${images.length}`);
                }
            }
            
            // Kirim audio jika ada (opsional)
            if (tiktokData.music || tiktokData.music_info?.play) {
                try {
                    const musicUrl = tiktokData.music || tiktokData.music_info?.play;
                    const audioRes = await axios.get(musicUrl, { responseType: 'arraybuffer', timeout: 30000 });
                    const audioBuffer = Buffer.from(audioRes.data);
                    
                    await axly.sendMessage(
                        m.chat,
                        {
                            audio: audioBuffer,
                            mimetype: 'audio/mpeg',
                            caption: `🎵 *Backsound:* ${tiktokData.music_info?.title || 'Original Sound'}`
                        },
                        { quoted: m }
                    );
                } catch (audioErr) {
                    console.error('Audio error:', audioErr.message);
                }
            }
            
            setLimit(m, db);
            m.react('✅');
            return; // Keluar karena sudah selesai kirim foto
        }
        
        // ========== VIDEO BIASA ==========
        // Ambil informasi dari response
        const author = tiktokData.author?.nickname || 'Unknown';
        const uniqueId = tiktokData.author?.unique_id || '-';
        const caption = tiktokData.title || tiktokData.content_desc?.join(' ') || 'TikTok Video';
        const duration = tiktokData.duration || 0;
        const playCount = tiktokData.play_count || 0;
        const diggCount = tiktokData.digg_count || 0;
        const commentCount = tiktokData.comment_count || 0;
        const shareCount = tiktokData.share_count || 0;
        
        // Pilih kualitas video (prioritas: hdplay > play > wmplay)
        let videoUrl = tiktokData.hdplay || tiktokData.play || tiktokData.wmplay;
        const isWatermarked = !tiktokData.hdplay && !tiktokData.play && tiktokData.wmplay;
        
        if (!videoUrl) throw new Error('Video URL tidak ditemukan');
        
        // Hitung durasi dalam menit:detik
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const durationText = duration > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : '-';
        
        // Info caption
        const infoText = `📹 *TIKTOK DOWNLOADER*\n\n` +
            `👤 *Author:* ${author} (@${uniqueId})\n` +
            `📝 *Caption:* ${caption.substring(0, 100)}${caption.length > 100 ? '...' : ''}\n` +
            `⏱️ *Duration:* ${durationText}\n` +
            `👁️ *Views:* ${playCount.toLocaleString()}\n` +
            `❤️ *Likes:* ${diggCount.toLocaleString()}\n` +
            `💬 *Comments:* ${commentCount.toLocaleString()}\n` +
            `↗️ *Shares:* ${shareCount.toLocaleString()}\n` +
            `${isWatermarked ? '⚠️ *Watermark:* Ada (tanpa watermark tidak tersedia)' : '✅ *Watermark:* Tanpa watermark'}\n\n` +
            `_Download by AxlyAPI_`;
        
        // Download video sebagai buffer
        const vidRes = await axios.get(videoUrl, {
            responseType: 'arraybuffer',
            timeout: 60000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Referer': 'https://www.tiktok.com/'
            }
        });
        
        const buffer = Buffer.from(vidRes.data);
        const fileSizeMB = buffer.length / (1024 * 1024);
        
        if (fileSizeMB > 100) {
            m.react('❌');
            return m.reply(`❌ Video terlalu besar (${fileSizeMB.toFixed(2)} MB). Maksimal 100 MB.`);
        }
        
        // Kirim video
        await axly.sendMessage(
            m.chat,
            {
                video: buffer,
                caption: infoText,
                mimetype: 'video/mp4'
            },
            { quoted: m }
        );
        
        // Opsional: Kirim audio terpisah
        if (tiktokData.music || tiktokData.music_info?.play) {
            try {
                const musicUrl = tiktokData.music || tiktokData.music_info?.play;
                const audioRes = await axios.get(musicUrl, { responseType: 'arraybuffer', timeout: 30000 });
                const audioBuffer = Buffer.from(audioRes.data);
                
                await axly.sendMessage(
                    m.chat,
                    {
                        audio: audioBuffer,
                        mimetype: 'audio/mpeg',
                        caption: `🎵 *Audio:* ${tiktokData.music_info?.title || 'Original Sound'}`
                    },
                    { quoted: m }
                );
            } catch (audioErr) {
                console.error('Audio download error:', audioErr.message);
            }
        }
        
        setLimit(m, db);
        m.react('✅');
        
    } catch (e) {
        console.error('TikTok Download Error:', e.message);
        m.react('❌');
        
        // Fallback: Coba dengan parameter tanpa watermark
        try {
            const fallbackUrl = `https://axlyapi.qzz.io/download/tiktok?url=${encodeURIComponent(text)}&watermark=false`;
            const fallbackRes = await axios.get(fallbackUrl, { timeout: 30000 });
            
            if (fallbackRes.data.status && fallbackRes.data.result?.data) {
                const fallbackVideo = fallbackRes.data.result.data.play || fallbackRes.data.result.data.wmplay;
                if (fallbackVideo) {
                    const fallbackBuffer = await axios.get(fallbackVideo, { responseType: 'arraybuffer' });
                    await axly.sendMessage(
                        m.chat,
                        { video: Buffer.from(fallbackBuffer.data), caption: '📹 TikTok Video (Fallback)' },
                        { quoted: m }
                    );
                    setLimit(m, db);
                    m.react('✅');
                    return;
                }
            }
        } catch (fallbackErr) {
            console.error('Fallback Error:', fallbackErr.message);
        }
        
        m.reply('❌ Gagal download TikTok!\n\nPastikan URL valid dan konten tidak di-private.\nCoba lagi nanti.');
    }
}
break;
			case 'ttmp3': case 'tiktokmp3': case 'ttaudio': case 'tiktokaudio': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} url_tiktok`);
    if (!text.includes('tiktok.com')) return m.reply('Url Tidak Mengandung Result Dari Tiktok!');
    m.react('⏳');
    try {
        let apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(text)}?hd=1`;
        let { data: hasil } = await axios.get(apiUrl);
        if (hasil.code === 0 && hasil.data) {
            let musicUrl = hasil.data.music;
            await m.reply({
                audio: { url: musicUrl },
                mimetype: 'audio/mpeg'
            });
            setLimit(m, db);
            m.react('✅');
        } else {
            throw new Error('Gagal mengambil data');
        }
    } catch (e) {
        console.log(e);
        m.react('❌');
        m.reply(global.mess.fail);
    }
}
break
			case 'mediafire': case 'mf': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} https://www.mediafire.com/file/xxxxxxxxx/xxxxx.zip/file`);
    if (!isUrl(args[0]) && !args[0].includes('mediafire.com')) return m.reply('Url Invalid!');
    m.react('⏳');
    try {
        const apiUrl = `https://api.zenzxz.my.id/download/mediafire?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, { timeout: 30000 });
        
        if (data.status && data.result && data.result.length > 0) {
            const file = data.result[0];
            if (!file.url) throw new Error('Link tidak ditemukan');
            
            await m.reply({
                document: { url: file.url },
                mimetype: file.mimetype || 'application/octet-stream',
                fileName: file.filename || 'file',
                caption: `*MEDIAFIRE DOWNLOADER*\n\n📝 *Name:* ${file.filename || '-'}\n📦 *Size:* ${file.size || '-'}`
            });
            setLimit(m, db);
            m.react('✅');
        } else {
            throw new Error('Gagal mendapatkan data');
        }
    } catch (e) {
        console.log(e);
        m.react('❌');
        m.reply(global.mess.fail);
    }
}
break
			case 'spotifydl': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} https://open.spotify.com/track/0JiVRyTJcJnmlwCZ854K4p`);
    if (!isUrl(args[0]) && !args[0].includes('open.spotify.com/track')) return m.reply('Url Invalid!');
    try {
        let apiUrl = `https://api.nexray.eu.cc/downloader/spotify?url=${encodeURIComponent(text)}`;
        let { data } = await axios.get(apiUrl);

        if (data.status && data.result && data.result.url) {
            const hasil = data.result;
            m.react('⏳');

            await m.reply({
                audio: { url: hasil.url },
                mimetype: 'audio/mpeg'
            });
            setLimit(m, db);
            m.react('✅');
        } else {
            throw new Error('Gagal mengunduh');
        }
    } catch (e) {
        console.log(e);
        m.react('❌');
        m.reply(global.mess.fail);
    }
}
break




			// Random Menu
			case 'coffe': case 'kopi': {
				try {
					await axly.sendFileUrl(m.chat, 'https://coffee.alexflipnote.dev/random', '☕ Random Coffe', m);
				} catch (e) {
					try {
						const anu = await fetchJson('https://api.sampleapis.com/coffee/hot');
						await axly.sendFileUrl(m.chat, pickRandom(anu).image, '☕ Random Coffe', m);
					} catch (e) {
						m.reply('Server Sedang Offline!');
					}
				}
			}
				break;
			case 'cecanindo': case 'cecanindonesia': case 'indocecan': {
				if (!isLimit) return m.reply(global.mess.limit);

				m.react('⏳');

				try {
					const res = await axios.get('https://api.nexray.eu.cc/random/cecan/indonesia', {
						responseType: 'arraybuffer',
						timeout: 30000
					});
					const buffer = Buffer.from(res.data);

					await axly.sendMessage(
						m.chat,
						{ image: buffer, caption: '👩🏽 Random CeCan Indonesia' },
						{ quoted: m }
					);

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal mengambil gambar');
				}
			}
				break;
			case 'cecanjapan': case 'japancecan': case 'japan': {
				if (!isLimit) return m.reply(global.mess.limit);

				m.react('⏳');

				try {
					const res = await axios.get('https://api.nexray.eu.cc/random/cecan/japan', {
						responseType: 'arraybuffer',
						timeout: 30000
					});
					const buffer = Buffer.from(res.data);

					await axly.sendMessage(
						m.chat,
						{ image: buffer, caption: '👩🏻‍🦰 Random CeCan Japan' },
						{ quoted: m }
					);

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal mengambil gambar');
				}
			}
				break;
			case 'cecankorea': case 'koreacecan': case 'korea': {
				if (!isLimit) return m.reply(global.mess.limit);

				m.react('⏳');

				try {
					const res = await axios.get('https://api.nexray.eu.cc/random/cecan/korea', {
						responseType: 'arraybuffer',
						timeout: 30000
					});
					const buffer = Buffer.from(res.data);

					await axly.sendMessage(
						m.chat,
						{ image: buffer, caption: '👩🏻 Random CeCan Korea' },
						{ quoted: m }
					);

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal mengambil gambar');
				}
			}
				break;
			case 'pap': case 'randompap': {
				if (!isLimit) return m.reply(global.mess.limit);

				m.react('⏳');

				try {
					const res = await axios.get('https://api.nexray.eu.cc/random/pap', {
						responseType: 'arraybuffer',
						timeout: 30000
					});
					const buffer = Buffer.from(res.data);

					await axly.sendMessage(
						m.chat,
						{ image: buffer, caption: '📸 Random PAP' },
						{ quoted: m }
					);

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal mengambil gambar');
				}
			}
				break;
			case 'cecanvietnam': case 'vietnamcecan': case 'vietnam': {
				if (!isLimit) return m.reply(global.mess.limit);

				m.react('⏳');

				try {
					const res = await axios.get('https://api.nexray.eu.cc/random/cecan/vietnam', {
						responseType: 'arraybuffer',
						timeout: 30000
					});
					const buffer = Buffer.from(res.data);

					await axly.sendMessage(
						m.chat,
						{ image: buffer, caption: '👩🏻 Random CeCan Vietnam' },
						{ quoted: m }
					);

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal mengambil gambar');
				}
			}
				break;
			case 'cecanthailand': case 'thailandcecan': case 'thailand': {
				if (!isLimit) return m.reply(global.mess.limit);

				m.react('⏳');

				try {
					const res = await axios.get('https://api.nexray.eu.cc/random/cecan/thailand', {
						responseType: 'arraybuffer',
						timeout: 30000
					});
					const buffer = Buffer.from(res.data);

					await axly.sendMessage(
						m.chat,
						{ image: buffer, caption: '👩🏽 Random CeCan Thailand' },
						{ quoted: m }
					);

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal mengambil gambar');
				}
			}
				break;
			case 'cecanchina': case 'chinagirl': {
				if (!isLimit) return m.reply(global.mess.limit);

				m.react('⏳');

				try {
					const res = await axios.get('https://api.nexray.eu.cc/random/cecan/china', {
						responseType: 'arraybuffer',
						timeout: 30000
					});
					const buffer = Buffer.from(res.data);

					await axly.sendMessage(
						m.chat,
						{ image: buffer, caption: 'Random CeCan China' },
						{ quoted: m }
					);

					setLimit(m, db);
					m.react('✅');

				} catch (e) {
					console.error(e);
					m.react('❌');
					m.reply('❌ Gagal mengambil gambar');
				}
			}
				break;
			case 'bluearchive': case 'ba': {
    if (!isLimit) return m.reply(global.mess.limit);

    m.react('⏳');

    try {
        const apiUrl = 'https://axlyapi.qzz.io/random/ba';
        const res = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        const buffer = Buffer.from(res.data);
        
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal mengambil gambar');
            } catch (jsonErr) {}
        }

        await axly.sendMessage(
            m.chat,
            { image: buffer, caption: '💙 Random Blue Archive - Azusa, Hoshino, Shiroko, dan lainnya!' },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Blue Archive Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal mengambil gambar Blue Archive. Coba lagi nanti.');
    }
}
break;

			case 'pinterest': case 'pint': case 'pin': case 'pindl': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`Example: ${prefix + command} one punch man\n\nAtau: ${prefix + command} one punch man|5 (untuk jumlah gambar)`);
    m.react('⏳');

    try {
        // Parse jumlah gambar (default 1, maks 5)
        let query = text;
        let limit = 1;
        
        if (text.includes('|')) {
            const parts = text.split('|');
            query = parts[0].trim();
            limit = parseInt(parts[1].trim());
            if (isNaN(limit) || limit < 1) limit = 1;
            if (limit > 5) limit = 5; // Maksimal 5 gambar biar ga spam
        }
        
        // Endpoint Pinterest Search dari AxlyAPI
        const apiUrl = `https://axlyapi.qzz.io/search/pinterest?q=${encodeURIComponent(query)}&limit=${limit}`;
        const { data } = await axios.get(apiUrl, { timeout: 20000 });

        // Validasi response
        if (!data.status || !data.result || !data.result.data || data.result.data.length === 0) {
            throw new Error('Tidak ada hasil');
        }

        const result = data.result;
        const images = result.data;
        const total = result.total || images.length;
        const queryUsed = result.query || query;

        // Kirim gambar satu per satu
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const imageUrl = img.image_url;
            const title = img.title || 'Tanpa Judul';
            const description = img.description || '';
            const likes = img.likes || 0;
            const author = img.author?.username || 'Unknown';
            
            let caption = `📌 *PINTEREST SEARCH*\n\n` +
                `🔍 *Query:* ${queryUsed}\n` +
                `📊 *Gambar ke-${i+1} dari ${total}*\n\n` +
                `🖼️ *Title:* ${title}\n` +
                `✍️ *Desk:* ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}\n` +
                `❤️ *Likes:* ${likes.toLocaleString()}\n` +
                `👤 *Author:* ${author}\n\n` +
                `_Download by AxlyAPI_`;
            
            // Kirim gambar
            await axly.sendMessage(
                m.chat,
                {
                    image: { url: imageUrl },
                    caption: caption
                },
                { quoted: m }
            );
            
            // Delay biar ga kecepetan (kecuali gambar terakhir)
            if (i < images.length - 1) await sleep(1000);
        }

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Pinterest Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal mencari gambar di Pinterest!\n\nCoba dengan kata kunci lain.\nContoh: /pinterest kucing lucu');
    }
}
break;
case 'animedetail': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`*Contoh:* ${prefix + command} https://v2.samehadaku.how/anime/naruto-kecil/`);
    m.react('⏳');

    try {
        const detailUrl = `https://axlyapi.qzz.io/anime/samehadaku/detail?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(detailUrl, { timeout: 15000 });

        if (!data.status || !data.result) {
            throw new Error('Detail tidak ditemukan');
        }

        const detail = data.result.detail || {};
        
        let episodes = [];
        if (data.result.episodes && Array.isArray(data.result.episodes)) {
            episodes = data.result.episodes;
        } else if (data.result.episodes_list && Array.isArray(data.result.episodes_list)) {
            episodes = data.result.episodes_list;
        }
        
        const totalEpisodes = data.result.total_episodes || episodes.length || '-';
        
        // Ambil link episode pertama sebagai contoh
        let exampleLink = '';
        if (episodes.length > 0) {
            exampleLink = episodes[0].url || episodes[0].link || '';
        }

        // Format info anime
        let caption = `*❏───『 ANIME DETAIL 』───❏*\n`;
        caption += `📺 *ᴛɪᴛʟᴇ:* ${detail.title || '-'}\n`;
        caption += `✉️ *ᴛʏᴘᴇ:* ${detail.type || '-'}\n`;
        caption += `🗂 *sᴛᴀᴛᴜs:* ${detail.status || '-'}\n`;
        caption += `🎬 *ᴛᴏᴛᴀʟ ᴇᴘ:* ${totalEpisodes}\n`;
        caption += `⌛ *ᴅᴜʀᴀsɪ:* ${detail.duration || '-'} min\n`;
        caption += `🧮 *sᴄᴏʀᴇ:* ${detail.score || '-'}\n`;
        if (detail.released) caption += `🗓️ *ʀɪʟɪs:* ${detail.released}\n`;
        if (detail.studio) caption += `🏢 *sᴛᴜᴅɪᴏ:* ${detail.studio}\n`;
        if (detail.genres && detail.genres.length > 0) {
            caption += `👺 *ɢᴇɴʀᴇ:* ${detail.genres.join(', ')}\n`;
        }
        caption += `⛓️ *ᴜʀʟ:* ${text}\n\n`;

        if (detail.sinopsis) {
            caption += `💬 *sɪɴᴏᴘsɪs:*\n${detail.sinopsis.substring(0, 300)}${detail.sinopsis.length > 300 ? '...' : ''}\n\n`;
        }

        // ========== TAMPILKAN CARA NONTON (TANPA REPLY) ==========
        caption += `🎬 *CARA NONTON EPISODE:*\n\n`;
        caption += `1️⃣ *Copy link episode di bawah ini*\n`;
        caption += `2️⃣ *Ganti angka episode sesuai yang diinginkan*\n`;
        caption += `3️⃣ *Ketik:* ${prefix}nonton <link_episode>\n\n`;
        
        if (exampleLink) {
            // Tampilkan contoh link episode (episode 1, 2, 3)
            caption += `📌 *Contoh link episode:*\n`;
            caption += `Episode 1: \`${exampleLink}\`\n`;
            
            // Buat link untuk episode 2 dan 3
            let modifiedLink = exampleLink;
            if (modifiedLink.match(/-(\d+)/)) {
                const baseUrl = modifiedLink.replace(/-(\d+)(?=\/|$)/, '-');
                caption += `Episode 2: \`${baseUrl}2/\`\n`;
                caption += `Episode 3: \`${baseUrl}3/\`\n`;
            }
        }
        
        caption += `\n📝 *Contoh penggunaan:*\n`;
        caption += `${prefix}nonton ${exampleLink}\n\n`;
        
        caption += `📥 *Atau kunjungi website untuk episode lain:*\n`;
        caption += `${text}`;

        // Kirim pesan dengan gambar
        const posterUrl = detail.poster || detail.image;
        await axly.sendMessage(
            m.chat,
            { image: { url: posterUrl || 'https://telegra.ph/file/95670d63378f7f4210f03.png' }, caption: caption },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Anime Detail Error:', e.message);
        m.react('❌');
        m.reply(`❌ *Gagal mengambil detail anime!*\n\n📌 *Error:* ${e.message}\n\n📥 *Coba buka langsung:*\n${text}`);
    }
}
break;
case 'nonton': case 'animewatch': case 'animeplay': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`*Contoh:* ${prefix + command} https://v2.samehadaku.how/one-punch-man-season-3-episode-3/`);
    
    if (!text.includes('samehadaku')) {
        return m.reply('❌ URL tidak valid! Harap gunakan link dari website Samehadaku.');
    }
    
    m.react('⏳');
    await m.reply('🔄 *Mencari link video...*');

    try {
        // ========== 1. PANGGIL API STREAM ==========
        const apiUrl = `https://axlyapi.qzz.io/anime/samehadaku/stream?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, { timeout: 20000 });

        if (!data.status || !data.a || data.a.length === 0) {
            throw new Error('Tidak ada link video yang tersedia');
        }

        // ========== 2. CARI LINK PIXELDRAIN (PRIORITAS) ==========
        let directUrl = '';
        let sourceName = '';
        
        // Prioritas: Pixeldrain (tanpa iklan)
        for (const source of data.a) {
            if (source.name === 'Pixeldrain') {
                const fileId = source.url.split('/').pop();
                directUrl = `https://pixeldrain.com/api/file/${fileId}`;
                sourceName = 'Pixeldrain';
                break;
            }
        }
        
        // Kalau tidak ada Pixeldrain, ambil Filedon
        if (!directUrl) {
            for (const source of data.a) {
                if (source.name === 'Filedon') {
                    const fileId = source.url.split('/').pop();
                    directUrl = `https://filedon.co/dl/${fileId}`;
                    sourceName = 'Filedon';
                    break;
                }
            }
        }
        
        if (!directUrl) {
            throw new Error('Tidak ada link video yang valid');
        }
        
        // ========== 3. EKSTRAK JUDUL EPISODE ==========
        let episodeTitle = 'Episode';
        let animeTitle = 'Anime';
        
        const lastPart = text.split('/').pop() || '';
        if (lastPart) {
            episodeTitle = lastPart.replace(/-/g, ' ').replace('subtitle indonesia', '').trim();
            episodeTitle = episodeTitle.charAt(0).toUpperCase() + episodeTitle.slice(1);
        }
        
        const animeSlug = text.split('/')[3]?.split('-episode')[0] || '';
        if (animeSlug) {
            animeTitle = animeSlug.replace(/-/g, ' ').trim();
            animeTitle = animeTitle.charAt(0).toUpperCase() + animeTitle.slice(1);
        }
        
        // ========== 4. AMBIL THUMBNAIL (POSTER ANIME) ==========
        let thumbnailUrl = 'https://telegra.ph/file/95670d63378f7f4210f03.png';
        try {
            const searchUrl = `https://axlyapi.qzz.io/anime/samehadaku/search?q=${encodeURIComponent(animeTitle)}`;
            const { data: searchData } = await axios.get(searchUrl, { timeout: 8000 });
            if (searchData.status && searchData.results && searchData.results.length > 0 && searchData.results[0].image) {
                thumbnailUrl = searchData.results[0].image;
            }
        } catch (thumbErr) {
            console.log('[THUMB] Pakai default');
        }
        
        // ========== 5. KIRIM PESAN DENGAN BUTTON ==========
        await new Button(axly)
            .setTitle('🎬 STREAMING ANIME')
            .setSubtitle(episodeTitle)
            .setBody(`📺 *${animeTitle}*\n🔗 *Source:* ${sourceName}\n\nKlik tombol di bawah untuk streaming video.`)
            .setFooter(`© AxlyBot • ${sourceName} (No Ads)`)
            .setImage(thumbnailUrl)
            .addUrl('🎬 Streaming Sekarang', directUrl, true, { icon: 'PLAY' })
            .addReply('🔍 Cari Anime Lain', `${prefix}anime ${animeTitle}`, { icon: 'SEARCH' })
            .send(m.chat, { quoted: m });
        
        setLimit(m, db);
        m.react('✅');
        
    } catch (e) {
        console.error('Nonton Error:', e.message);
        m.react('❌');
        
        let errorMsg = `❌ *Gagal streaming!*\n\n`;
        errorMsg += `📌 *Error:* ${e.message}\n\n`;
        errorMsg += `💡 *Solusi:*\n`;
        errorMsg += `1. Coba lagi nanti\n`;
        errorMsg += `2. Coba episode lain\n`;
        errorMsg += `3. Cek link di browser: ${text}`;
        
        m.reply(errorMsg);
    }
}
break;
		case 'animerbaru': case 'animetrbaru': case 'animeupdate': case 'animebaru': case 'update': {
    if (!isLimit) return m.reply(global.mess.limit);
    m.react('⏳');

    try {
        // ========== 1. PANGGIL API ANIME TERBARU ==========
        const apiUrl = 'https://axlyapi.qzz.io/anime/samehadaku/latest';
        const { data } = await axios.get(apiUrl, { timeout: 15000 });

        if (!data.status || !data.results || data.results.length === 0) {
            throw new Error('Tidak ada anime terbaru');
        }

        const animeList = data.results;
        const total = data.total || animeList.length;

        // ========== 2. FORMAT CAPTION ==========
        let caption = `🎬 *ANIME TERBARU HARI INI*\n\n`;
        caption += `📊 *Total:* ${total} anime\n`;
        caption += `📅 *Update:* ${new Date().toLocaleDateString('id-ID')}\n\n`;
        
        // Tampilkan semua anime terbaru (15 anime)
        for (let i = 0; i < animeList.length; i++) {
            const anime = animeList[i];
            const title = anime.title || 'Unknown';
            const episode = anime.episode || '-';
            const url = anime.url || '#';
            
            caption += `${i + 1}. *${title}*\n`;
            caption += `   🎞️ ${episode}\n`;
            caption += `   🔗 ${url}\n\n`;
        }
        
        caption += `📝 *Cara nonton:*\n`;
        caption += `Copy link anime di atas, lalu ketik:\n`;
        caption += `${prefix}animedetail <link_anime>\n\n`;
        caption += `*Contoh:*\n`;
        caption += `${prefix}animedetail ${animeList[0]?.url || ''}\n\n`;
        caption += `🔍 *Cari anime:* ${prefix}anime <judul>`;

        // ========== 3. KIRIM PESAN ==========
        // Jika caption terlalu panjang, kirim sebagai file txt
        if (caption.length > 4000) {
            const fs = require('fs');
            const tempFile = path.join(__dirname, '../database/temp', `anime_list_${Date.now()}.txt`);
            fs.writeFileSync(tempFile, caption, 'utf-8');
            
            await axly.sendMessage(
                m.chat,
                {
                    document: fs.readFileSync(tempFile),
                    mimetype: 'text/plain',
                    fileName: `anime_terbaru.txt`,
                    caption: `🎬 *ANIME TERBARU*\n📊 Total: ${total} anime`
                },
                { quoted: m }
            );
            fs.unlinkSync(tempFile);
        } else {
            await m.reply(caption);
        }
        
        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Anime Terbaru Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal mengambil daftar anime terbaru. Coba lagi nanti.');
    }
}
break;
case 'donghuawatch': case 'donghuastream': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`*Contoh:* ${prefix + command} tales-of-herding-gods-episode-85-subtitle-indonesia`);
    
    m.react('⏳');

    try {
        const apiUrl = `https://axlyapi.qzz.io/donghua/stream?slug=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl, { timeout: 20000 });

        if (!data.status || !data.result) {
            throw new Error('Tidak ada link video');
        }

        const result = data.result;
        const title = result.title || 'Donghua Episode';
        const streamUrl = result.stream_url || '';
        const videoId = result.video_id || '';
        
        if (!streamUrl && !videoId) {
            throw new Error('Video URL tidak ditemukan');
        }
        
        // Gunakan link Dailymotion atau buat link manual
        let watchUrl = streamUrl;
        if (videoId && !watchUrl) {
            watchUrl = `https://www.dailymotion.com/video/${videoId}`;
        }
        
        // Ekstrak judul
        let episodeNum = '';
        const episodeMatch = text.match(/episode-(\d+)/i);
        if (episodeMatch) episodeNum = episodeMatch[1];
        
        const caption = `🎬 *DONGHUA STREAMING*\n\n` +
            `📺 *Title:* ${title}\n` +
            `${episodeNum ? `🎞️ *Episode:* ${episodeNum}\n` : ''}` +
            `\n📥 *Link streaming:*\n${watchUrl}\n\n` +
            `_Klik link di atas untuk streaming di browser._\n\n` +
            `💡 *Tips:* Jika video tidak muncul, coba buka link di browser.`;
        
        await new Button(axly)
            .setTitle('🎬 DONGHUA STREAMING')
            .setSubtitle(title)
            .setBody(caption)
            .setFooter('© AxlyBot • Dailymotion')
            .addUrl('🎬 Streaming Sekarang', watchUrl, true, { icon: 'PLAY' })
            .addReply('🔍 Cari Donghua Lain', `${prefix}anime ${title.split('Episode')[0].trim()}`, { icon: 'SEARCH' })
            .send(m.chat, { quoted: m });
        
        setLimit(m, db);
        m.react('✅');
        
    } catch (e) {
        console.error('Donghua Error:', e.message);
        m.react('❌');
        m.reply(`❌ *Gagal streaming donghua!*\n\nError: ${e.message}\n\nContoh: ${prefix + command} tales-of-herding-gods-episode-85-subtitle-indonesia`);
    }
}
break;
case 'animerbaru': case 'animetrbaru': case 'animeupdate': case 'animebaru': {
    if (!isLimit) return m.reply(global.mess.limit);
    m.react('⏳');

    try {
        // ========== 1. PANGGIL API ANIME TERBARU ==========
        const apiUrl = 'https://axlyapi.qzz.io/anime/samehadaku/latest';
        const { data } = await axios.get(apiUrl, { timeout: 15000 });

        if (!data.status || !data.results || data.results.length === 0) {
            throw new Error('Tidak ada anime terbaru');
        }

        const animeList = data.results;
        const total = data.total || animeList.length;

        // ========== 2. FORMAT CAPTION ==========
        let caption = `🎬 *ANIME TERBARU HARI INI*\n\n`;
        caption += `📊 *Total:* ${total} anime\n`;
        caption += `📅 *Update:* ${new Date().toLocaleDateString('id-ID')}\n\n`;
        
        // Tampilkan semua anime terbaru (15 anime)
        for (let i = 0; i < animeList.length; i++) {
            const anime = animeList[i];
            const title = anime.title || 'Unknown';
            const episode = anime.episode || '-';
            const url = anime.url || '#';
            
            caption += `${i + 1}. *${title}*\n`;
            caption += `   🎞️ ${episode}\n`;
            caption += `   🔗 ${url}\n\n`;
        }
        
        caption += `📝 *Cara nonton:*\n`;
        caption += `Copy link anime di atas, lalu ketik:\n`;
        caption += `${prefix}animedetail <link_anime>\n\n`;
        caption += `*Contoh:*\n`;
        caption += `${prefix}animedetail ${animeList[0]?.url || ''}\n\n`;
        caption += `🔍 *Cari anime:* ${prefix}anime <judul>`;

        // ========== 3. KIRIM PESAN ==========
        // Jika caption terlalu panjang, kirim sebagai file txt
        if (caption.length > 4000) {
            const fs = require('fs');
            const tempFile = path.join(__dirname, '../database/temp', `anime_list_${Date.now()}.txt`);
            fs.writeFileSync(tempFile, caption, 'utf-8');
            
            await axly.sendMessage(
                m.chat,
                {
                    document: fs.readFileSync(tempFile),
                    mimetype: 'text/plain',
                    fileName: `anime_terbaru.txt`,
                    caption: `🎬 *ANIME TERBARU*\n📊 Total: ${total} anime`
                },
                { quoted: m }
            );
            fs.unlinkSync(tempFile);
        } else {
            await m.reply(caption);
        }
        
        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Anime Terbaru Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal mengambil daftar anime terbaru. Coba lagi nanti.');
    }
}
break;
	case 'anime': case 'animesearch': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`*Contoh:* ${prefix + command} one punch man`);
    m.react('⏳');

    try {
        // Search anime dari API
        const searchUrl = `https://axlyapi.qzz.io/anime/samehadaku/search?q=${encodeURIComponent(text)}`;
        const { data } = await axios.get(searchUrl, { timeout: 15000 });

        if (!data.status || !data.results || data.results.length === 0) {
            throw new Error('Tidak ada hasil');
        }

        // Hapus duplikat berdasarkan URL
        const uniqueResults = [];
        const seenUrls = new Set();
        for (const anime of data.results) {
            if (anime.url && !seenUrls.has(anime.url)) {
                seenUrls.add(anime.url);
                uniqueResults.push(anime);
            }
        }

        // Tampilkan maksimal 10 hasil
        const displayResults = uniqueResults.slice(0, 10);
        
        let caption = `🎬 *ANIME SEARCH*\n\n`;
        caption += `🔍 *Kata kunci:* ${text}\n`;
        caption += `📊 *Total:* ${uniqueResults.length} anime\n\n`;
        caption += `Pilih anime yang ingin dilihat detailnya:\n`;

        // Buat button untuk setiap anime (sama persis seperti .play)
        const buttons = [];
        for (let i = 0; i < displayResults.length; i++) {
            const anime = displayResults[i];
            let btnLabel = anime.title || 'Unknown';
            if (btnLabel.length > 25) {
                btnLabel = btnLabel.substring(0, 22) + '...';
            }
            buttons.push({
                buttonId: `${prefix}animedetail ${anime.url}`,
                buttonText: { displayText: `${i + 1}. ${btnLabel}` },
                type: 1
            });
        }

        await axly.sendButtonMsg(m.chat, {
            text: caption,
            footer: `📌 Klik tombol untuk melihat detail anime`,
            buttons: buttons
        }, { quoted: m });

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Anime Search Error:', e.message);
        m.react('❌');
        m.reply(`❌ Anime *"${text}"* tidak ditemukan!\n\nCoba dengan kata kunci lain.\nContoh: ${prefix + command} naruto`);
    }
}
break;
			case 'loli': {
    if (!isLimit) return m.reply(global.mess.limit);

    m.react('⏳');

    try {
        const apiUrl = 'https://axlyapi.qzz.io/random/loli';
        const res = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        const buffer = Buffer.from(res.data);
        
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal mengambil gambar');
            } catch (jsonErr) {}
        }

        await axly.sendMessage(
            m.chat,
            { image: buffer, caption: '🌸 Random Loli - Kanna, Hina, Shiro, dan lainnya!' },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Loli Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal mengambil gambar Loli. Coba lagi nanti.');
    }
}
break;
			case 'mlstalk': case 'mlbbstalk': case 'ml': case 'mlbb': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!text) return m.reply(`⚠️ Masukkan ID & Zone MLBB!\n\nExample: ${prefix + command} 1222123808 11449`);

    m.react('⏳');

    try {
        // Parse ID dan Zone (format: id zone)
        const parts = text.trim().split(/\s+/);
        let id, zone;
        
        if (parts.length >= 2) {
            id = parts[0];
            zone = parts[1];
        } else {
            return m.reply(`❌ Format salah!\n\nGunakan: ${prefix + command} <id> <zone>\nContoh: ${prefix + command} 1222123808 11449`);
        }

        // Endpoint Stalker MLBB dari AxlyAPI
        const api = `https://axlyapi.qzz.io/stalker/mlbb?id=${encodeURIComponent(id)}&zone=${encodeURIComponent(zone)}`;
        const res = await axios.get(api, { timeout: 15000 });

        // Validasi response
        if (!res.data?.status || !res.data?.result) throw new Error('Akun tidak ditemukan');

        const data = res.data.result;

        // Cek apakah akun ditemukan
        if (!data.found) {
            return m.reply(`❌ Akun dengan ID ${id} dan Zone ${zone} tidak ditemukan!\n\nPastikan ID dan Zone benar.`);
        }

        // Format created_date lebih rapi jika perlu
        let createdDate = data.created_date || '-';
        let lastLogin = data.last_login_country || data.region || '-';
        
        // Bikin caption dengan emoji dan format rapi
        let caption = `🎮 *MOBILE LEGENDS STALKER*\n\n`;
        caption += `┌─⊷ *PROFILE*\n`;
        caption += `├ 👤 *Username:* ${data.nickname || '-'}\n`;
        caption += `├ 🆔 *ID:* ${data.user_id || id}\n`;
        caption += `├ 📦 *Zone:* ${data.zone_id || zone}\n`;
        caption += `└─⊷ *DETAIL*\n\n`;
        
        caption += `┌─⊷ *INFORMASI*\n`;
        caption += `├ 🌍 *Region:* ${data.region || '-'}\n`;
        caption += `├ ⭐ *Level:* ${data.level || '-'}\n`;
        caption += `├ 📅 *Created:* ${createdDate}\n`;
        caption += `├ 🕒 *Last Login:* ${lastLogin}\n`;
        caption += `└─⊷ *STATUS*\n\n`;
        
        caption += `┌─⊷ *VERIFIKASI*\n`;
        caption += `└ 🔍 *Found:* ${data.found ? '✅ Akun Ditemukan' : '❌ Akun Tidak Ditemukan'}\n\n`;
        
        caption += `_Data diambil dari server resmi Mobile Legends_\n`;
        caption += `_Update: ${new Date().toLocaleString('id-ID')}_`;

        await m.reply(caption);
        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('MLBB Stalker Error:', e.message);
        m.react('❌');
        
        // Cek error spesifik
        if (e.response?.status === 404) {
            m.reply('❌ Akun tidak ditemukan!\n\nPastikan ID dan Zone benar.\nContoh: /mlstalk 1222123808 11449');
        } else if (e.code === 'ECONNABORTED') {
            m.reply('❌ Timeout! Server sedang sibuk. Coba lagi nanti.');
        } else {
            m.reply('❌ Gagal mengambil data MLBB!\n\nGunakan format: /mlstalk <id> <zone>\nContoh: /mlstalk 1222123808 11449');
        }
    }
}
break;
			// Anime Menu
			case 'waifu': {
    try {
        if (!isNsfw && text === 'nsfw') return m.reply('Filter Nsfw Sedang Aktif!');

        m.react('⏳');

        const apiUrl = 'https://axlyapi.qzz.io/random/waifu';
        const res = await axios.get(apiUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        const buffer = Buffer.from(res.data);
        
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            try {
                const jsonData = JSON.parse(buffer.toString());
                if (!jsonData.status) throw new Error(jsonData.message || 'Gagal mengambil gambar');
            } catch (jsonErr) {}
        }

        let caption = '💖 Random Waifu - Rem, Zero Two, Asuna, dan lainnya!';
        if (text && text !== 'nsfw') {
            caption = `💖 Random Waifu - Kategori: ${text}`;
        }

        await axly.sendMessage(
            m.chat,
            { image: buffer, caption: caption },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error('Waifu Error:', e.message);
        m.react('❌');
        m.reply('❌ Gagal mengambil gambar Waifu. Coba lagi nanti.');
    }
}
break;
			case 'hdvid': case 'hdvideo': case 'reminivid': {
    if (!isLimit) return m.reply(global.mess.limit);
    if (!/video/.test(mime)) return m.reply(`Kirim/Reply Video dengan caption *${prefix + command}*`);

    m.react('⏳');
    let mediaPath = null;

    try {
        mediaPath = await axly.downloadAndSaveMediaMessage(qmsg);

        // Upload ke UguuSe dulu
        let upload = await UguuSe(mediaPath);
        if (!upload?.url) throw new Error('Upload gagal');

        // Panggil API hdvid
        let api = `https://api.zenzxz.my.id/tools/hdvid?videoUrl=${encodeURIComponent(upload.url)}&resolution=4k`;
        const res = await axios.get(api, { timeout: 30000 });

        if (!res.data?.status || !res.data?.result?.output_url) throw new Error('Gagal enhance video');

        await axly.sendMessage(
            m.chat,
            {
                video: { url: res.data.result.output_url },
                caption: '✅ *Video Enhanced 4K*',
                mimetype: 'video/mp4'
            },
            { quoted: m }
        );

        setLimit(m, db);
        m.react('✅');

    } catch (e) {
        console.error(e);
        m.react('❌');
        m.reply('❌ Gagal: ' + e.message);
    } finally {
        if (mediaPath && fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    }
}
break

			// Fun Menu
			case 'dadu': {
				let ddsa = [{ url: 'https://telegra.ph/file/9f60e4cdbeb79fc6aff7a.png', no: 1 }, { url: 'https://telegra.ph/file/797f86e444755282374ef.png', no: 2 }, { url: 'https://telegra.ph/file/970d2a7656ada7c579b69.png', no: 3 }, { url: 'https://telegra.ph/file/0470d295e00ebe789fb4d.png', no: 4 }, { url: 'https://telegra.ph/file/a9d7332e7ba1d1d26a2be.png', no: 5 }, { url: 'https://telegra.ph/file/99dcd999991a79f9ba0c0.png', no: 6 }];
				let media = pickRandom(ddsa);
				try {
					await axly.sendAsSticker(m.chat, media.url, m, { packname, author, isAvatar: 1 });
				} catch (e) {
					let anu = await fetch(media.url);
					let una = await anu.buffer();
					await axly.sendAsSticker(m.chat, una, m, { packname, author, isAvatar: 1 });
				}
			}
				break;
			case 'halah': case 'hilih': case 'huluh': case 'heleh': case 'holoh': {
				if (!m.quoted && !text) return m.reply(`Kirim/reply text dengan caption ${prefix + command}`);
				let ter = command[1].toLowerCase();
				let tex = m.quoted ? m.quoted.text ? m.quoted.text : q ? q : m.text : q ? q : m.text;
				m.reply(tex.replace(/[aiueo]/g, ter).replace(/[AIUEO]/g, ter.toUpperCase()));
			}
				break;
			case 'bisakah': {
				if (!text) return m.reply(`Example : ${prefix + command} saya menang?`);
				let bisa = ['Bisa', 'Coba Saja', 'Pasti Bisa', 'Mungkin Saja', 'Tidak Bisa', 'Tidak Mungkin', 'Coba Ulangi', 'Ngimpi kah?', 'yakin bisa?'];
				let keh = bisa[Math.floor(Math.random() * bisa.length)];
				m.reply(`*Bisakah ${text}*\nJawab : ${keh}`);
			}
				break;
			case 'apakah': {
				if (!text) return m.reply(`Example : ${prefix + command} saya bisa menang?`);
				let apa = ['Iya', 'Tidak', 'Bisa Jadi', 'Coba Ulangi', 'Mungkin Saja', 'Mungkin Tidak', 'Mungkin Iya', 'Ntahlah'];
				let kah = apa[Math.floor(Math.random() * apa.length)];
				m.reply(`*${command} ${text}*\nJawab : ${kah}`);
			}
				break;
			case 'kapan': case 'kapankah': {
				if (!text) return m.reply(`Example : ${prefix + command} saya menang?`);
				let kapan = ['Besok', 'Lusa', 'Nanti', '4 Hari Lagi', '5 Hari Lagi', '6 Hari Lagi', '1 Minggu Lagi', '2 Minggu Lagi', '3 Minggu Lagi', '1 Bulan Lagi', '2 Bulan Lagi', '3 Bulan Lagi', '4 Bulan Lagi', '5 Bulan Lagi', '6 Bulan Lagi', '1 Tahun Lagi', '2 Tahun Lagi', '3 Tahun Lagi', '4 Tahun Lagi', '5 Tahun Lagi', '6 Tahun Lagi', '1 Abad lagi', '3 Hari Lagi', 'Bulan Depan', 'Ntahlah', 'Tidak Akan Pernah'];
				let koh = kapan[Math.floor(Math.random() * kapan.length)];
				m.reply(`*${command} ${text}*\nJawab : ${koh}`);
			}
				break;
			case 'siapa': case 'siapakah': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (!text) return m.reply(`Example : ${prefix + command} jawa?`);
				let member = (store.groupMetadata[m.chat] ? store.groupMetadata[m.chat].participants : m.metadata.participants).map(a => a.phoneNumber);
				let siapakh = pickRandom(member);
				m.reply(`@${siapakh.split('@')[0]}`);
			}
				break;
			case 'tanyakerang': case 'kerangajaib': case 'kerang': {
				if (!text) return m.reply(`Example : ${prefix + command} boleh pinjam 100?`);
				let krng = ['Mungkin suatu hari', 'Tidak juga', 'Tidak keduanya', 'Kurasa tidak', 'Ya', 'Tidak', 'Coba tanya lagi', 'Tidak ada'];
				let jwb = pickRandom(krng);
				m.reply(`*Pertanyaan : ${text}*\n*Jawab : ${jwb}*`);
			}
				break;
			case 'cekmati': {
				if (!text) return m.reply(`Example : ${prefix + command} nama lu`);
				let teksnya = encodeToLetters(text);
				let data = await axios.get(`https://api.agify.io/?name=${teksnya}`).then(res => res.data).catch(e => ({ age: null }));
				let consistentAge = 0;
				for (let i = 0; i < teksnya.length; i++) consistentAge += teksnya.charCodeAt(i);
				let finalAge = data.age == null ? (consistentAge % 90) + 20 : data.age;
				let nameDisplay = m.mentionedJid && m.mentionedJid.length > 0 ? `@${m.mentionedJid[0].split('@')[0]}` : text;
				m.reply(`Nama : ${nameDisplay}\n*Mati Pada Umur :* ${finalAge} Tahun.\n\n_Cepet Cepet Tobat Bro_\n_Soalnya Mati ga ada yang tau_`);
			}
				break;
			case 'ceksifat': {
				let sifat_a = ['Bijak', 'Sabar', 'Kreatif', 'Humoris', 'Mudah bergaul', 'Mandiri', 'Setia', 'Jujur', 'Dermawan', 'Idealis', 'Adil', 'Sopan', 'Tekun', 'Rajin', 'Pemaaf', 'Murah hati', 'Ceria', 'Percaya diri', 'Penyayang', 'Disiplin', 'Optimis', 'Berani', 'Bersyukur', 'Bertanggung jawab', 'Bisa diandalkan', 'Tenang', 'Kalem', 'Logis'];
				let sifat_b = ['Sombong', 'Minder', 'Pendendam', 'Sensitif', 'Perfeksionis', 'Caper', 'Pelit', 'Egois', 'Pesimis', 'Penyendiri', 'Manipulatif', 'Labil', 'Penakut', 'Vulgar', 'Tidak setia', 'Pemalas', 'Kasar', 'Rumit', 'Boros', 'Keras kepala', 'Tidak bijak', 'Pembelot', 'Serakah', 'Tamak', 'Penggosip', 'Rasis', 'Ceroboh', 'Intoleran'];
				let teks = `╭──❍「 *Cek Sifat* 」❍\n│• Sifat ${text && m.mentionedJid ? text : '@' + m.sender.split('@')[0]}${(text && m.mentionedJid ? '' : (`\n│• Nama : *${text ? text : m.pushName}*` || '\n│• Nama : *Tanpa Nama*'))}\n│• Orang yang : *${pickRandom(sifat_a)}*\n│• Kekurangan : *${pickRandom(sifat_b)}*\n│• Keberanian : *${Math.floor(Math.random() * 100)}%*\n│• Kepedulian : *${Math.floor(Math.random() * 100)}%*\n│• Kecemasan : *${Math.floor(Math.random() * 100)}%*\n│• Ketakutan : *${Math.floor(Math.random() * 100)}%*\n│• Akhlak Baik : *${Math.floor(Math.random() * 100)}%*\n│• Akhlak Buruk : *${Math.floor(Math.random() * 100)}%*\n╰──────❍`;
				m.reply(teks);
			}

				break;

			case 'rate': case 'nilai': {
				m.reply(`Rate Bot : *${Math.floor(Math.random() * 100)}%*`);
			}
				break;
			case 'jodohku': {
				if (!m.isGroup) return m.reply(global.mess.group);
				let member = (store.groupMetadata?.[m.chat]?.participants || m.metadata?.participants || []).map(a => a.phoneNumber);
				let jodoh = pickRandom(member);
				m.reply(`👫Jodoh mu adalah\n@${m.sender.split('@')[0]} ❤ @${jodoh ? jodoh.split('@')[0] : '0'}`);
			}
				break;
			case 'jadian': {
				if (!m.isGroup) return m.reply(global.mess.group);
				let member = (store.groupMetadata?.[m.chat]?.participants || m.metadata?.participants || []).map(a => a.phoneNumber);
				let jadian1 = pickRandom(member);
				let jadian2 = pickRandom(member);
				m.reply(`Ciee yang Jadian💖 Jangan lupa Donasi🗿\n@${jadian1.split('@')[0]} ❤ @${jadian2.split('@')[0]}`);
			}
				break;
			case 'fitnah': {
				let [teks1, teks2, teks3] = text.split`|`;
				if (!teks1 || !teks2 || !teks3) return m.reply(`Example : ${prefix + command} pesan target|pesan mu|nomer/tag target`);
				let ftelo = { key: { fromMe: false, participant: teks3.replace(/[^0-9]/g, '') + '@s.whatsapp.net', ...(m.isGroup ? { remoteJid: m.chat } : { remoteJid: teks3.replace(/[^0-9]/g, '') + '@s.whatsapp.net' }) }, message: { conversation: teks1 } };
				axly.sendMessage(m.chat, { text: teks2 }, { quoted: ftelo });
			}
				break;
			case 'coba': {
				let anu = ['Aku Monyet', 'Aku Kera', 'Aku Tolol', 'Aku Kaya', 'Aku Dewa', 'Aku Anjing', 'Aku Dongo', 'Aku Raja', 'Aku Sultan', 'Aku Baik', 'Aku Hitam', 'Aku Suki'];
				await axly.sendButtonMsg(m.chat, {
					text: 'Semoga Hoki😹',
					buttons: [{
						buttonId: 'teshoki',
						buttonText: { displayText: '\n' + pickRandom(anu) },
						type: 1
					}, {
						buttonId: 'cobacoba',
						buttonText: { displayText: '\n' + pickRandom(anu) },
						type: 1
					}]
				});
			}
				break;

			// Game Menu
			case 'slot': {
				await gameSlot(axly, m, db);
			}
				break;
			case 'casino': {
				await gameCasinoSolo(axly, m, prefix, db);
			}
				break;
			case 'samgong': case 'kartu': {
				await gameSamgongSolo(axly, m, db);
			}
				break;
			case 'rampok': case 'merampok': {
				await gameMerampok(m, db);
			}
				break;
			case 'begal': {
				await gameBegal(axly, m, db);
			}
				break;
			case 'suitpvp': case 'suit': {
				if (Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.sender))) return m.reply(`Selesaikan suit mu yang sebelumnya`);
				if (m.mentionedJid[0] === m.sender) return m.reply(`Tidak bisa bermain dengan diri sendiri !`);
				if (!m.mentionedJid[0]) return m.reply(`_Siapa yang ingin kamu tantang?_\nTag orangnya..\n\nExample : ${prefix}suit @${ownerNumber[0]}`, m.chat, { mentions: [ownerNumber[0] + '@s.whatsapp.net'] });
				if (Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.mentionedJid[0]))) return m.reply(`Orang yang kamu tantang sedang bermain suit bersama orang lain :(`);
				let caption = `_*SUIT PvP*_\n\n@${m.sender.split('@')[0]} menantang @${m.mentionedJid[0].split('@')[0]} untuk bermain suit\n\nSilahkan @${m.mentionedJid[0].split('@')[0]} untuk ketik terima/tolak`;
				let id = 'suit_' + Date.now();
				suit[id] = {
					chat: caption,
					id: id,
					p: m.sender,
					p2: m.mentionedJid[0],
					status: 'wait',
					poin: 10,
					poin_lose: 10,
					timeout: 3 * 60 * 1000
				};
				m.reply(caption);
				await sleep(3 * 60 * 1000);
				if (suit[id]) {
					m.reply(`_Waktu suit habis_`);
					delete suit[id];
				}
			}
				break;
			case 'delsuit': case 'deletesuit': {
				let roomnya = Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.sender));
				if (!roomnya) return m.reply(`Kamu sedang tidak berada di room suit !`);
				delete suit[roomnya.id];
				m.reply(`Berhasil delete session room suit !`);
			}
				break;
			case 'ttc': case 'ttt': case 'tictactoe': {
				if (Object.values(tictactoe).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return m.reply(`Kamu masih didalam game!\nKetik *${prefix}del${command}* Jika Ingin Mengakhiri sesi`);
				let room = Object.values(tictactoe).find(room => room.state === 'WAITING' && (text ? room.name === text : true));
				if (room) {
					m.reply('Partner ditemukan!');
					room.o = m.chat;
					room.game.playerO = m.sender;
					room.state = 'PLAYING';
					if (!(room.game instanceof TicTacToe)) {
						room.game = Object.assign(new TicTacToe(room.game.playerX, room.game.playerO), room.game);
					}
					let arr = room.game.render().map(v => {
						return { X: '❌', O: '⭕', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣' }[v];
					});
					let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n\nMenunggu @${room.game.currentTurn.split('@')[0]}\n\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`;
					if (room.x !== room.o) await axly.sendMessage(room.x, { text: str, mentions: parseMention(str) }, { quoted: m });
					await axly.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m });
				} else {
					room = {
						id: 'tictactoe-' + (+new Date),
						x: m.chat,
						o: '',
						game: new TicTacToe(m.sender, 'o'),
						state: 'WAITING',
					};
					if (text) room.name = text;
					axly.sendMessage(m.chat, { text: 'Menunggu partner' + (text ? ` mengetik command dibawah ini ${prefix}${command} ${text}` : ''), mentions: m.mentionedJid }, { quoted: m });
					tictactoe[room.id] = room;
					await sleep(300000);
					if (tictactoe[room.id]) {
						m.reply(`_Waktu ${command} habis_`);
						delete tictactoe[room.id];
					}
				}
			}
				break;
			case 'delttc': case 'delttt': {
				let roomnya = Object.values(tictactoe).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender));
				if (!roomnya) return m.reply(`Kamu sedang tidak berada di room tictactoe !`);
				delete tictactoe[roomnya.id];
				m.reply(`Berhasil delete session room tictactoe !`);
			}
				break;
			case 'tebakbom': {
				if (tebakbom[m.sender]) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');
				tebakbom[m.sender] = {
					petak: [0, 0, 0, 2, 0, 2, 0, 2, 0, 0].sort(() => Math.random() - 0.5),
					board: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'],
					bomb: 3,
					lolos: 7,
					pick: 0,
					nyawa: ['❤️', '❤️', '❤️'],
				};
				await m.reply(`*TEBAK BOM*\n\n${tebakbom[m.sender].board.join("")}\n\nPilih lah nomor tersebut! dan jangan sampai terkena Bom!\nBomb : ${tebakbom[m.sender].bomb}\nNyawa : ${tebakbom[m.sender].nyawa.join("")}`);
				await sleep(120000);
				if (tebakbom[m.sender]) {
					m.reply(`_Waktu ${command} habis_`);
					delete tebakbom[m.sender];
				}
			}
				break;
			case 'tekateki': {
    if (iGame(tekateki, m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');

    try {
        const apiURL = 'https://axlyapi.qzz.io/game/tekateki/start';
        let res = await axios.get(apiURL);
        let dataGames = res.data;

        if (!dataGames.status || !dataGames.result) throw new Error('empty');

        let soalDipilih = dataGames.result;

        let { key } = await m.reply(`🎮 Teka Teki Berikut :\n\n${soalDipilih.soal}\n\nHint: ${soalDipilih.hint}\n\nWaktu : 60s\nHadiah *+3499*`);

        tekateki[m.chat + key.id] = {
            jawaban: soalDipilih.jawaban.toLowerCase(),
            id: key.id
        };

        await sleep(60000);

        if (rdGame(tekateki, m.chat, key.id)) {
            m.reply('Waktu Habis\nJawaban: ' + tekateki[m.chat + key.id].jawaban);
            delete tekateki[m.chat + key.id];
        }
    } catch (e) {
        console.log(e);
        m.reply('Gagal mengambil soal teka-teki, coba lagi nanti.');
    }
}
break;
			case 'tebaklirik': {
    if (iGame(tebaklirik, m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');

    try {
        const apiURL = 'https://axlyapi.qzz.io/game/tebaklirik/start';
        let res = await axios.get(apiURL);
        let dataGames = res.data;

        if (!dataGames.status || !dataGames.result) throw new Error('empty');

        let soalDipilih = dataGames.result;

        let { key } = await m.reply(`🎮 Tebak Lirik Berikut :\n\n${soalDipilih.soal}\n\nHint: ${soalDipilih.hint}\n\nWaktu : 90s\nHadiah *+4299*`);

        tebaklirik[m.chat + key.id] = {
            jawaban: soalDipilih.jawaban.toLowerCase(),
            id: key.id
        };

        await sleep(90000);

        if (rdGame(tebaklirik, m.chat, key.id)) {
            m.reply('Waktu Habis\nJawaban: ' + tebaklirik[m.chat + key.id].jawaban);
            delete tebaklirik[m.chat + key.id];
        }
    } catch (e) {
        console.log(e);
        m.reply('Gagal mengambil soal tebak lirik, coba lagi nanti.');
    }
}
break;
			case 'tebakkata': {
    if (iGame(tebakkata, m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');

    try {
        const apiURL = 'https://axlyapi.qzz.io/game/tebakkata/start';
        let res = await axios.get(apiURL);
        let dataGames = res.data;

        if (!dataGames.status || !dataGames.result) throw new Error('empty');

        let soalDipilih = dataGames.result;

        let { key } = await m.reply(`🎮 Tebak Kata Berikut :\n\n${soalDipilih.soal}\n\nHint: ${soalDipilih.hint}\n\nWaktu : 60s\nHadiah *+3499*`);

        tebakkata[m.chat + key.id] = {
            jawaban: soalDipilih.jawaban.toLowerCase(),
            id: key.id
        };

        await sleep(60000);

        if (rdGame(tebakkata, m.chat, key.id)) {
            m.reply('Waktu Habis\nJawaban: ' + tebakkata[m.chat + key.id].jawaban);
            delete tebakkata[m.chat + key.id];
        }
    } catch (e) {
        console.log(e);
        m.reply('Gagal ambil soal, coba lagi nanti.');
    }
}
break;
			case 'family100': {
				if (family100.hasOwnProperty(m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');

				try {
					const apiURL = 'https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json';
					let res = await axios.get(apiURL);
					let dataGames = res.data;

					if (!dataGames || dataGames.length === 0) throw new Error('empty');

					let randomIndex = Math.floor(Math.random() * dataGames.length);
					let soalDipilih = dataGames[randomIndex];

					let { key } = await m.reply(`🎮 Family 100 :\n\n${soalDipilih.soal}\n\nWaktu : 5m\nHadiah *+3499*`);

					family100[m.chat] = {
						soal: soalDipilih.soal,
						jawaban: soalDipilih.jawaban,
						terjawab: Array.from(soalDipilih.jawaban, () => false),
						id: key.id
					};

					await sleep(300000);

					if (family100.hasOwnProperty(m.chat)) {
						let jawabanBelumTerjawab = family100[m.chat].jawaban.filter((_, idx) => !family100[m.chat].terjawab[idx]);
						m.reply('Waktu Habis\nJawaban yang belum terjawab:\n- ' + jawabanBelumTerjawab.join('\n- '));
						delete family100[m.chat];
					}
				} catch (e) {
					console.log(e);
					m.reply('Gagal mengambil soal Family 100, coba lagi nanti.');
				}
			}
				break;
			case 'susunkata': {
    if (iGame(susunkata, m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');

    try {
        const apiURL = 'https://axlyapi.qzz.io/game/susunkata/start';
        let res = await axios.get(apiURL);
        let dataGames = res.data;

        if (!dataGames.status || !dataGames.result) throw new Error('empty');

        let soalDipilih = dataGames.result;

        let { key } = await m.reply(`🎮 Susun Kata Berikut :\n\n${soalDipilih.soal}\n\nHint: ${soalDipilih.hint}\n\nWaktu : 60s\nHadiah *+2989*`);

        susunkata[m.chat + key.id] = {
            jawaban: soalDipilih.jawaban.toLowerCase(),
            id: key.id
        };

        await sleep(60000);

        if (rdGame(susunkata, m.chat, key.id)) {
            m.reply('Waktu Habis\nJawaban: ' + susunkata[m.chat + key.id].jawaban);
            delete susunkata[m.chat + key.id];
        }
    } catch (e) {
        console.log(e);
        m.reply('Gagal mengambil soal susun kata, coba lagi nanti.');
    }
}
break;
			case 'tebakkimia': {
    if (iGame(tebakkimia, m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');

    try {
        const apiURL = 'https://axlyapi.qzz.io/game/tebakkimia/start';
        let res = await axios.get(apiURL);
        let dataGames = res.data;

        if (!dataGames.status || !dataGames.result) throw new Error('empty');

        let soalDipilih = dataGames.result;

        let { key } = await m.reply(`🎮 Tebak Kimia Berikut :\n\n${soalDipilih.soal}\n\nHint: ${soalDipilih.hint}\n\nWaktu : 60s\nHadiah *+3499*`);

        tebakkimia[m.chat + key.id] = {
            jawaban: soalDipilih.jawaban.toLowerCase(),
            id: key.id
        };

        await sleep(60000);

        if (rdGame(tebakkimia, m.chat, key.id)) {
            m.reply('Waktu Habis\nJawaban: ' + tebakkimia[m.chat + key.id].jawaban);
            delete tebakkimia[m.chat + key.id];
        }
    } catch (e) {
        console.log(e);
        m.reply('Gagal mengambil soal tebak kimia, coba lagi nanti.');
    }
}
break;
			case 'caklontong': {
    if (iGame(caklontong, m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');

    try {
        const apiURL = 'https://axlyapi.qzz.io/game/caklontong/start';
        let res = await axios.get(apiURL);
        let dataGames = res.data;

        if (!dataGames.status || !dataGames.result) throw new Error('empty');

        let soalDipilih = dataGames.result;

        let { key } = await m.reply(`🎮 Jawab Pertanyaan Berikut :\n\n${soalDipilih.soal}\n\nHint: ${soalDipilih.hint}\n\nWaktu : 60s\nHadiah *+9999*`);

        caklontong[m.chat + key.id] = {
            jawaban: soalDipilih.jawaban.toLowerCase(),
            deskripsi: soalDipilih.hint || 'Tidak ada deskripsi',
            id: key.id
        };

        await sleep(60000);

        if (rdGame(caklontong, m.chat, key.id)) {
            m.reply(`Waktu Habis\nJawaban: ${caklontong[m.chat + key.id].jawaban}\n"${caklontong[m.chat + key.id].deskripsi}"`);
            delete caklontong[m.chat + key.id];
        }
    } catch (e) {
        console.log(e);
        m.reply('Gagal mengambil soal caklontong, coba lagi nanti.');
    }
}
break;
			case 'tebakgambar': {
    if (iGame(tebakgambar, m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');

    try {
        const apiURL = 'https://axlyapi.qzz.io/game/tebakgambar/start';
        let res = await axios.get(apiURL);
        let dataGames = res.data;

        if (!dataGames.status || !dataGames.result) throw new Error('empty');

        let soalDipilih = dataGames.result;

        let { key } = await axly.sendFileUrl(m.chat, soalDipilih.image_url, `🎮 Tebak Gambar Berikut :\n\n${soalDipilih.deskripsi}\n\nHint: ${soalDipilih.hint}\n\nWaktu : 60s\nHadiah *+3499*`, m);

        tebakgambar[m.chat + key.id] = {
            jawaban: soalDipilih.jawaban.toLowerCase(),
            id: key.id
        };

        await sleep(60000);

        if (rdGame(tebakgambar, m.chat, key.id)) {
            m.reply('Waktu Habis\nJawaban: ' + tebakgambar[m.chat + key.id].jawaban);
            delete tebakgambar[m.chat + key.id];
        }
    } catch (e) {
        console.log(e);
        m.reply('Gagal mengambil soal tebak gambar, coba lagi nanti.');
    }
}
break;
			case 'tebakbendera': {
    if (iGame(tebakbendera, m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');

    try {
        const apiURL = 'https://axlyapi.qzz.io/game/tebakbendera/start';
        let res = await axios.get(apiURL);
        let dataGames = res.data;

        if (!dataGames.status || !dataGames.result) throw new Error('empty');

        let soalDipilih = dataGames.result;

        let { key } = await m.reply(`🎮 Tebak Bendera Berikut :\n\n*Bendera : ${soalDipilih.soal}*\n\nHint: ${soalDipilih.hint}\n\nWaktu : 60s\nHadiah *+3499*`);

        tebakbendera[m.chat + key.id] = {
            jawaban: soalDipilih.jawaban.toLowerCase(),
            id: key.id
        };

        await sleep(60000);

        if (rdGame(tebakbendera, m.chat, key.id)) {
            m.reply('Waktu Habis\nJawaban: ' + tebakbendera[m.chat + key.id].jawaban);
            delete tebakbendera[m.chat + key.id];
        }
    } catch (e) {
        console.log(e);
        m.reply('Gagal mengambil soal tebak bendera, coba lagi nanti.');
    }
}
break;
			case 'kuismath': case 'math': {
				const { genMath, modes } = await import('./lib/math.js');
				const inputMode = ['noob', 'easy', 'medium', 'hard', 'extreme', 'impossible', 'impossible2'];
				if (iGame(kuismath, m.chat)) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');
				if (!text) return m.reply(`Mode: ${Object.keys(modes).join(' | ')}\nExample penggunaan: ${prefix}math medium`);
				if (!inputMode.includes(text.toLowerCase())) return m.reply('Mode tidak ditemukan!');
				let result = await genMath(text.toLowerCase());
				let { key } = await m.reply(`*Berapa hasil dari: ${result.soal.toLowerCase()}*?\n\nWaktu : ${(result.waktu / 1000).toFixed(2)} detik`);
				kuismath[m.chat + key.id] = {
					jawaban: result.jawaban,
					mode: text.toLowerCase(),
					id: key.id
				};
				await sleep(kuismath, result.waktu);
				if (rdGame(m.chat + key.id)) {
					m.reply('Waktu Habis\nJawaban: ' + kuismath[m.chat + key.id].jawaban);
					delete kuismath[m.chat + key.id];
				}
			}
				break;
			case 'ulartangga': case 'snakeladder': case 'ut': {
				if (!m.isGroup) return m.reply(global.mess.group);
				if (ulartangga[m.chat] && !(ulartangga[m.chat] instanceof SnakeLadder)) {
					ulartangga[m.chat] = Object.assign(new SnakeLadder(ulartangga[m.chat]), ulartangga[m.chat]);
				}
				switch (args[0]) {
					case 'create': case 'join':
						if (ulartangga[m.chat]) {
							if (Object.keys(ulartangga[m.chat].players).length > 8) return m.reply(`Jumlah Pemain Sudah Maksimal\nSilahkan Memulai Permainan\n${prefix + command} start`);
							if (ulartangga[m.chat].players.some(a => a.id == m.sender)) return m.reply('Kamu Sudah Bergabung!');
							ulartangga[m.chat].players.push({ id: m.sender, move: 0 });
							m.reply('Sukses Join Sesi Game');
						} else {
							ulartangga[m.chat] = new SnakeLadder({ id: m.chat, host: m.sender });
							ulartangga[m.chat].players.push({ id: m.sender, move: 0 });
							ulartangga[m.chat].time = Date.now();
							m.reply('Sukses Membuat Sesi Game');
						}
						break;
					case 'start':
						if (!ulartangga[m.chat]) return m.reply('Tidak Ada Sesi Yang Sedang Berlangsung!');
						if (ulartangga[m.chat].players.length < 2) return m.reply('Jumlah Pemain Kurang!\nMinimal 2 Pemain!');
						if (ulartangga[m.chat].start) return m.reply('Sesi Sudah dimulai Sejak Awal!');
						if (ulartangga[m.chat].host !== m.sender) return m.reply(`Hanya Pembuat Room @${ulartangga[m.chat].host.split('@')[0]} yang bisa Memulai Sessi!`);
						let { key } = await m.reply({ image: { url: ulartangga[m.chat].map.url }, caption: `🐍🪜GAME ULAR TANGGA\n\n${ulartangga[m.chat].players.map((p, i) => `- @${p.id.split('@')[0]} (Pion ${['Merah', 'Biru Muda', 'Kuning', 'Hijau', 'Ungu', 'Jingga', 'Biru Tua', 'Putih'][i]})`).join('\n')}\n\nGiliran: @${m.sender.split('@')[0]}\n\nReply Pesan Ini untuk lanjut bermain!\nExample: roll/kocok`, mentions: ulartangga[m.chat].players.map(p => p.id) });
						ulartangga[m.chat].id = key.id;
						ulartangga[m.chat].start = true;
						break;
					case 'leave':
						if (!ulartangga[m.chat]) return m.reply('Tidak Ada Sesi Yang Sedang Berlangsung!');
						if (!ulartangga[m.chat].players.some(a => a.id == m.sender)) return m.reply('Kamu Bukan Pemain!');
						const player = ulartangga[m.chat].players.findIndex(a => a.id == m.sender);
						if (ulartangga[m.chat].start) return m.reply('Game Sudah dimulai!\nTidak Bisa Keluar Sekarang');
						if (ulartangga[m.chat].players.length < 1 || ulartangga[m.chat].host === m.sender) {
							m.reply(ulartangga[m.chat].host === m.sender ? 'Host Meninggalkan Permainan\nPermainan dihentikan!' : 'Pemain Kurang Dari 1, Permainan dihentikan!');
							delete ulartangga[m.chat];
							break;
						}
						ulartangga[m.chat].players.splice(player, 1);
						m.reply('Sukses Meninggalkan Permainan');
						break;
					case 'end':
						if (!ulartangga[m.chat]) return m.reply('Tidak Ada Sesi Yang Sedang Berlangsung!');
						if (ulartangga[m.chat]?.host !== m.sender) return m.reply(`Hanya Pembuat Room @${ulartangga[m.chat].host.split('@')[0]} yang bisa Menghapus Sessi!`);
						delete ulartangga[m.chat];
						m.reply('Berhasil Menghapus Sesi Game');
						break;
					default:
						m.reply(`🐍🪜GAME ULARTANGGA\nCommand: ${prefix + command} <command>\n- create\n- join\n- start\n- leave\n- end`);
				}
			}
				break;
			case 'chess': case 'catur': case 'ct': {
				const { DEFAUT_POSITION } = await import('chess.js').then(m => m.Chess);
				if (!m.isGroup) return m.reply(global.mess.group);
				if (chess[m.chat] && !(chess[m.chat] instanceof Chess)) {
					chess[m.chat] = Object.assign(new Chess(chess[m.chat].fen), chess[m.chat]);
				}
				switch (args[0]) {
					case 'start':
						if (!chess[m.chat]) return m.reply('Tidak Ada Sesi Yang Sedang Berlangsung!');
						if (!chess[m.chat].acc) return m.reply('Pemain Tidak Lengkap!');
						if (chess[m.chat].player1 !== m.sender) return m.reply('Hanya Pemain Utama Yang bisa Memulai!');
						if (chess[m.chat].turn !== m.sender && !chess[m.chat].start) {
							const encodedFen = encodeURI(chess[m.chat]._fen);
							let boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside`, `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside`, `https://chessboardimage.com/${encodedFen}.png`, `https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}`, `https://fen2image.chessvision.ai/${encodedFen}`];
							for (let url of boardUrls) {
								try {
									const { data } = await axios.get(url, { responseType: 'arraybuffer' });
									let { key } = await m.reply({ image: data, caption: `♟️${command.toUpperCase()} GAME\n\nGiliran: @${m.sender.split('@')[0]}\n\nReply Pesan Ini untuk lanjut bermain!\nExample: from to -> b1 c3`, mentions: [m.sender] });
									chess[m.chat].start = true;
									chess[m.chat].turn = m.sender;
									chess[m.chat].id = key.id;
									return;
								} catch (e) { }
							}
							if (!chess[m.chat].key) {
								m.reply(`Gagal Memulai Permainan!\nGagal Mengirim Papan Permainan!`);
							}
						} else if ([chess[m.chat].player1, chess[m.chat].player2].includes(m.sender)) {
							const isPlayer2 = chess[m.chat].player2 === m.sender;
							const nextPlayer = isPlayer2 ? chess[m.chat].player1 : chess[m.chat].player2;
							const encodedFen = encodeURI(chess[m.chat]._fen);
							const boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside${!isPlayer2 ? '&flip=true' : ''}`, `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${!isPlayer2 ? '&flip=true' : ''}`, `https://chessboardimage.com/${encodedFen}${!isPlayer2 ? '-flip' : ''}.png`, `https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}&coordinates=true&size=765${!isPlayer2 ? '&orientation=black' : ''}`, `https://fen2image.chessvision.ai/${encodedFen}/${!isPlayer2 ? '?pov=black' : ''}`];
							for (let url of boardUrls) {
								try {
									chess[m.chat].turn = chess[m.chat].turn === m.sender ? m.sender : nextPlayer;
									const { data } = await axios.get(url, { responseType: 'arraybuffer' });
									let { key } = await m.reply({ image: data, caption: `♟️CHESS GAME\n\nGiliran: @${chess[m.chat].turn.split('@')[0]}\n\nReply Pesan Ini untuk lanjut bermain!\nExample: from to -> b1 c3`, mentions: [chess[m.chat].turn] });
									chess[m.chat].id = key.id;
									break;
								} catch (e) { }
							}
						}
						break;
					case 'join':
						if (chess[m.chat]) {
							if (chess[m.chat].player1 !== m.sender) {
								if (chess[m.chat].acc) return m.reply(`Pemain Sudah Terisi\nSilahkan Coba Lagi Nanti`);
								let teks = chess[m.chat].player2 === m.sender ? 'TerimaKasih Sudah Mau Bergabung' : `Karena @${chess[m.chat].player2.split('@')[0]} Tidak Merespon\nAkan digantikan Oleh @${m.sender.split('@')[0]}`;
								chess[m.chat].player2 = m.sender;
								chess[m.chat].acc = true;
								m.reply(`${teks}\nSilahkan @${chess[m.chat].player1.split('@')[0]} Untuk Memulai Game (${prefix + command} start)`);
							} else m.reply(`Kamu Sudah Bergabung\nBiarkan Orang Lain Menjadi Lawanmu!`);
						} else m.reply('Tidak Ada Sesi Yang Sedang Berlangsung!');
						break;
					case 'end': case 'leave':
						if (chess[m.chat]) {
							if (![chess[m.chat].player1, chess[m.chat].player2].includes(m.sender)) return m.reply('Hanya Pemain yang Bisa Menghentikan Permainan!');
							delete chess[m.chat];
							m.reply('Sukses Menghapus Sesi Game');
						} else m.reply('Tidak Ada Sesi Yang Sedang Berlangsung!');
						break;
					case 'bot': case 'computer':
						if (chess[m.sender]) {
							delete chess[m.sender];
							return m.reply('Sukses Menghapus Sesi vs BOT');
						} else {
							const { DEFAUT_POSITION } = await import('chess.js').then(m => m.Chess);
							chess[m.sender] = new Chess(DEFAUT_POSITION);
							chess[m.sender]._fen = chess[m.sender].fen();
							chess[m.sender].turn = m.sender;
							chess[m.sender].botMode = true;
							chess[m.sender].time = Date.now();
							const encodedFen = encodeURI(chess[m.sender]._fen);
							const boardUrls = [`https://www.chess.com/dynboard?fen=${encodedFen}&size=3&coordinates=inside`, `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside`, `https://chessboardimage.com/${encodedFen}.png`, `https://backscattering.de/web-boardimage/board.png?fen=${encodedFen}&coordinates=true&size=765`, `https://fen2image.chessvision.ai/${encodedFen}/`];
							for (let url of boardUrls) {
								try {
									const { data } = await axios.get(url, { responseType: 'arraybuffer' });
									let { key } = await m.reply({ image: data, caption: `♟️CHESS GAME\n\nGiliran: @${chess[m.sender].turn.split('@')[0]}\n\nReply Pesan Ini untuk lanjut bermain!\nExample: from to -> b1 c3`, mentions: [chess[m.sender].turn] });
									chess[m.sender].id = key.id;
									break;
								} catch (e) { }
							}
						}
						break;
					default:
						if (/^@?\d+$/.test(args[0])) {
							const { DEFAUT_POSITION } = await import('chess.js').then(m => m.Chess);
							if (chess[m.chat]) return m.reply('Masih Ada Sesi Yang Belum Diselesaikan!');
							if (m.mentionedJid.length < 1) return m.reply('Tag Orang yang Mau diajak Bermain!');
							chess[m.chat] = new Chess(DEFAUT_POSITION);
							chess[m.chat]._fen = chess[m.chat].fen();
							chess[m.chat].player1 = m.sender;
							chess[m.chat].player2 = m.mentionedJid ? m.mentionedJid[0] : null;
							chess[m.chat].time = Date.now();
							chess[m.chat].turn = null;
							chess[m.chat].acc = false;
							m.reply(`♟️${command.toUpperCase()} GAME\n\n@${m.sender.split('@')[0]} Menantang @${m.mentionedJid[0].split('@')[0]}\nUntuk Bergabung ${prefix + command} join`);
						} else {
							m.reply(`♟️${command.toUpperCase()} GAME\n\nExample: ${prefix + command} @tag/number\n- start\n- leave\n- join\n- computer\n- end`);
						}
				}

			}
				break;
			case 'blackjack': case 'bj': {
				let session = null;
				for (let id in blackjack) {
					if (blackjack[id].players.find(p => p.id === m.sender)) {
						session = blackjack[id];
						break;
					}
				}
				if (session && !(session instanceof Blackjack)) {
					session = Object.assign(new Blackjack(session), session);
				}
				if (blackjack[m.chat] && !(blackjack[m.chat] instanceof Blackjack)) {
					blackjack[m.chat] = Object.assign(new Blackjack(blackjack[m.chat]), blackjack[m.chat]);
				}
				switch (args[0]) {
					case 'create': case 'join':
						if (!m.isGroup) return m.reply(mess.group);
						if (blackjack[m.chat] || session) {
							if (blackjack[m.chat]?.players?.some(a => a.id === m.sender)) return m.reply('Kamu Sudah Bergabung!');
							if (session) return m.reply('Kamu sudah bergabung di sesi Grup lain! Keluar dulu sebelum bergabung di sesi baru.');
							if (blackjack[m.chat].players.length > 10) return m.reply(`Jumlah Pemain Sudah Maksimal\nSilahkan Memulai Permainan\n${prefix + command} start`);
							blackjack[m.chat].players.push({ id: m.sender, cards: [] });
							m.reply('Sukses Join Game Blackjack');
						} else {
							blackjack[m.chat] = new Blackjack({ id: m.chat, host: m.sender });
							blackjack[m.chat].players.push({ id: m.sender, cards: [] });
							m.reply('Sukses Create Game Blackjack');
						}
						break;
					case 'start':
						if (!m.isGroup) return m.reply(mess.group);
						if (!blackjack[m.chat]) return m.reply('Tidak Ada Sesi Game Blackjack yang Sedang Berjalan!');
						if (blackjack[m.chat]?.host !== m.sender) return m.reply(`Hanya Pembuat Room @${blackjack[m.chat].host.split('@')[0]} yang bisa Memulai Sessi!`);
						if (blackjack[m.chat].players.length < 2) return m.reply('Minimal 2 Pemain Untuk Memulai Permainan!');
						if (blackjack[m.chat].started) return m.reply('Game Sudah Dimulai Sejak Awal!');
						blackjack[m.chat].distributeCards();
						m.reply(`🃏GAME BLACKJACK♦️\nStart Card: ${blackjack[m.chat].startCard.rank + blackjack[m.chat].startCard.suit}\nDeck Count: ${blackjack[m.chat].deck.length}\n${blackjack[m.chat].players.map(a => `- @${a.id.split('@')[0]} : (${a.cards.length} kartu)`).join('\n')}\n\nCek Private Chat\nwa.me/${botNumber.split('@')[0]}`);
						for (let p of blackjack[m.chat].players) {
							const startCard = blackjack[m.chat].startCard;
							let buttons = p.cards.map(a => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${a.rank}${a.suit}`, id: `.${command} play ${a.rank}${a.suit}` }) }));
							if (!blackjack[m.chat].hasMatching(p.id)) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Minum', id: `.${command} minum` }) });
							await axly.sendListMsg(p.id, { text: `Start Card: ${startCard.rank + startCard.suit}`, footer: `${p.cards.map(c => c.rank + c.suit).join(', ')}`, buttons }, { quoted: m });
						}
						break;
					case 'hit': case 'minum': {
						if (!session) return m.reply('Tidak Ada Sesi Game Blackjack yang Sedang Berjalan!');
						if (!session.started) return m.reply('Game Belum Di Mulai!');
						if (session.players.length < 2) return m.reply('Minimal 2 Pemain Untuk Memulai Permainan!');
						if (!session.players?.some(a => a.id === m.sender)) return m.reply('Kamu belum bergabung!');
						if (!args[0]) return m.reply(`Gunakan format:\n${prefix + command} play <kartu>\nExample: ${prefix + command} hit`);
						const player = session.players.find(p => p.id === m.sender);
						const hitIndex = player.cards.findIndex(c => (c.rank + c.suit) === (session.startCard.rank + session.startCard.suit));
						if (session.submitCard.some(s => s.id === m.sender) || session.skip.includes(m.sender)) {
							return m.reply('Kamu sudah bermain di ronde ini!');
						}
						if (!session.hasMatching(m.sender)) {
							if (session.deck.length) {
								const newCard = session.deck.shift();
								player.cards.push(newCard);
								await sleep(1000);
								let buttons = player.cards.map(a => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${a.rank}${a.suit}`, id: `.${command} play ${a.rank}${a.suit}` }) }));
								if (!session.hasMatching(player.id)) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Minum', id: `.${command} minum` }) });
								await axly.sendListMsg(player.id, { text: `Start Card: ${session.startCard.rank + session.startCard.suit}`, footer: `${player.cards.map(c => c.rank + c.suit).join(', ')}`, buttons }, { quoted: m });
							} else {
								let reuse = session.reuseSubmitCardsForDrinking();
								await m.reply(reuse.msg);
								if (!session.skip.find(a => a.id === player.id)) session.skip.push({ id: player.id });
								await m.reply('Deck sudah habis, kamu tidak bisa mengambil kartu. Dilewati.');
								await axly.sendText(session.id, `@${m.sender.split('@')[0]} dilewati karena deck habis.`, m);
								if ((session.submitCard.length + session.skip.length) === session.players.length) {
									const result = session.resolveRound();
									if (result) {
										await axly.sendText(session.id, result, m);
										if (session.players.length === 1) {
											await axly.sendText(session.id, `Pemain Tersisa 1 (@${session.players[0].id.split('@')[0]}), sesi Blackjack selesai.`, m);
											delete blackjack[session.id];
											return;
										}
										const leaderCards = session.players.find(a => a.id === session.leader);
										let buttons = leaderCards.cards.map(c => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${c.rank}${c.suit}`, id: `.${command} play ${c.rank}${c.suit}` }) }));
										await axly.sendListMsg(session.leader, { text: 'Pilih kartu untuk memulai ronde baru', footer: leaderCards.cards.map(c => c.rank + c.suit).join(', '), buttons }, { quoted: m });
									}
								}
							}
						} else m.reply(`Kamu masih punya kartu dengan suit ${session.startCard.suit}, mainkan dulu sebelum minum!`);
						if ((session.submitCard.length + session.skip.length) === session.players.length) {
							const result = session.resolveRound();
							if (result) {
								await axly.sendText(session.id, result, m);
								if (session.players.length === 1) {
									await axly.sendText(session.id, `Pemain Tersisa 1 (@${session.players[0].id.split('@')[0]}), sesi Blackjack selesai.`, m);
									delete blackjack[session.id];
									return;
								}
								const leaderCards = session.players.find(a => a.id === session.leader);
								let buttons = leaderCards.cards.map(c => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${c.rank}${c.suit}`, id: `.${command} play ${c.rank}${c.suit}` }) }));
								await axly.sendListMsg(session.leader, { text: 'Pilih kartu untuk memulai ronde baru', footer: leaderCards.cards.map(c => c.rank + c.suit).join(', '), buttons }, { quoted: m });
							}
						}
					}
						break;
					case 'play': {
						if (!session) return m.reply('Tidak Ada Sesi Game Blackjack yang Sedang Berjalan!');
						if (!session.started) return m.reply('Game Belum Di Mulai!');
						if (session.players.length < 2) return m.reply('Minimal 2 Pemain Untuk Memulai Permainan!');
						if (!session.players?.some(a => a.id === m.sender)) return m.reply('Kamu belum bergabung!');
						if (!args[1]) return m.reply(`Gunakan format:\n${prefix + command} play <kartu>\nExample: ${prefix + command} play 3♥️`);
						const player = session.players.find(p => p.id === m.sender);
						const idx = player.cards.findIndex(c => normalize(c.rank + c.suit) === normalize(args[1]));
						if (idx === -1) return m.reply('Kartu tidak valid!');
						if (session.submitCard.some(s => s.id === m.sender) || session.skip.includes(m.sender)) return m.reply('Kamu sudah bermain di ronde ini!');
						const card = player.cards[idx];
						if (Object.keys(session.startCard).length) {
							if (card.suit !== session.startCard.suit) return m.reply(`Kartu tidak sesuai! Harus suit ${session.startCard.suit}`);
						} else if (m.sender !== session.leader) return m.reply('Hanya pemimpin ronde yang boleh memulai!');
						player.cards.splice(idx, 1);
						session.secondDeck.push(card);
						session.submitCard.push({ id: m.sender, card: card });
						await sleep(1000);
						if (player.cards.length === 0) {
							session.winner.push({ id: player.id });
							session.leader = '';
							session.submitCard = [];
							session.players = session.players.filter(p => p.id !== player.id);
							await axly.sendText(session.id, `@${m.sender.split('@')[0]} memenangkan permainan!\nSisa Kartu: 0`, m);
							if (session.players.length === 1) {
								await axly.sendText(session.id, `Pemain Tersisa 1 (@${session.players[0].id.split('@')[0]}), sesi Blackjack selesai.`, m);
								delete blackjack[session.id];
								return;
							}
						}
						if (Object.keys(session.startCard).length === 0) {
							session.startCard = card;
							await axly.sendText(session.id, `@${m.sender.split('@')[0]} memulai putaran dengan ${card.rank}${card.suit}`, m);
							for (let s of session.players) {
								if (s.id === session.leader) continue;
								const startCard = session.startCard;
								let buttons = s.cards.map(a => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${a.rank}${a.suit}`, id: `.${command} play ${a.rank}${a.suit}` }) }));
								if (!session.hasMatching(s.id)) buttons.push({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Minum', id: `.${command} minum` }) });
								await axly.sendListMsg(s.id, { text: `Start Card: ${startCard.rank + startCard.suit}`, footer: `${s.cards.map(c => c.rank + c.suit).join(', ')}`, buttons }, { quoted: m });
							}
							return;
						}
						if ((session.submitCard.length + session.skip.length) === session.players.length) {
							const result = session.resolveRound();
							if (result) {
								await axly.sendText(session.id, result, m);
								if (session.players.length === 1) {
									await axly.sendText(session.id, `Pemain Tersisa 1 (@${session.players[0].id.split('@')[0]}), sesi Blackjack selesai.`, m);
									delete blackjack[session.id];
									return;
								}
								const leaderCards = session.players.find(a => a.id === session.leader);
								let buttons = leaderCards.cards.map(c => ({ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `${c.rank}${c.suit}`, id: `.${command} play ${c.rank}${c.suit}` }) }));
								await axly.sendListMsg(session.leader, { text: 'Pilih kartu untuk memulai ronde baru', footer: leaderCards.cards.map(c => c.rank + c.suit).join(', '), buttons }, { quoted: m });
							}
						}
						await m.reply(`Kamu memainkan ${card.rank}${card.suit}`);
						await axly.sendText(session.id, `@${m.sender.split('@')[0]} memainkan ${card.rank}${card.suit}`, m);
					}
						break;
					case 'info':
						if (!session) return m.reply('Tidak Ada Sesi Game Blackjack yang Sedang Berjalan!');
						if (!session.players?.some(a => a.id === m.sender)) return m.reply('Kamu belum bergabung!');
						const players = session.players.map((p, i) => `${i + 1}. @${p.id.split('@')[0]} ${p.id === session.host ? '(HOST) ' : p.id === session.leader ? '(Leader)' : ''}`).join('\n');
						if (m.isGroup) {
							m.reply(`🃏INFO GAME BLACKJACK ♦️\n*Jumlah Pemain:* ${session.players.length}\n*Host:* @${session.host.split('@')[0]}\n*Status:* ${session.started ? 'Dimulai' : 'Belum Mulai'}${Object.keys(session.startCard).length > 1 ? `\n*Start Card:* ${session.startCard.rank + session.startCard.suit}` : ''}\n*Sisa Kartu Deck:* ${session.deck.length}\n\n*Daftar Pemain:*\n${players}${session.secondDeck.length ? `\n\n*Riwayat Kartu:* ${session.secondDeck.map(c => `${c.rank}${c.suit}`).join(', ')}` : ''}`);
						} else {
							const player = session.players.find(p => p.id === m.sender);
							const cards = player.cards?.map(c => `${c.rank}${c.suit}`).join(', ') || 'Belum ada kartu';
							m.reply(`🃏INFO GAME BLACKJACK ♦️\n*Jumlah Pemain:* ${session.players.length}\n*Host:* @${session.host.split('@')[0]}\n*Status:* ${session.started ? 'Dimulai' : 'Belum Mulai'}${Object.keys(session.startCard).length > 1 ? `\n*Start Card:* ${session.startCard.rank + session.startCard.suit}` : ''}\n*Sisa Kartu Deck:* ${session.deck.length}\n\n*Daftar Pemain:*\n${players}\n\n*Kartu Kamu:*\n${cards}${session.secondDeck.length ? `\n\n*Riwayat Kartu:* ${session.secondDeck.map(c => `${c.rank}${c.suit}`).join(', ')}` : ''}`);
						}
						break;
					case 'end':
						if (!m.isGroup) return m.reply(mess.group);
						if (!blackjack[m.chat]) return m.reply('Tidak Ada Sesi Game Blackjack yang Sedang Berjalan!');
						if (blackjack[m.chat]?.host !== m.sender) return m.reply(`Hanya Pembuat Room @${blackjack[m.chat].host.split('@')[0]} yang bisa Menghapus Sessi!`);
						delete blackjack[m.chat];
						m.reply('Berhasil Menghapus Sesi Game Blackjack');
						break;
					default:
						m.reply(`🃏GAME BLACKJACK♦️\nCommand: ${prefix + command} <command>\n- create\n- join\n- start\n- info\n- hit\n- deck\n- end`);
				}
			}
				break;

			// Menu
			case 'menu': {
				if (args[0] == 'set') {
					if (!isCreator) return m.reply(mess.owner);
					if (['1', '2', '3'].includes(args[1])) {
						set.template = parseInt(Number(args[1]));
						m.reply('Sukses Mengubah Template Menu');
					} else m.reply(`Template Menu:\n- 1 (Button Menu)\n- 2 (List Menu)\n- 3 (Document Menu)\n\nExample: ${prefix + command} set 1`);
				} else await templateMenu(axly, set.template, m, prefix, setv, db, { locale_day, date, date_time, botNumber, author, packname, isVip, isPremium, ucapanWaktu });
			}
				break;
case 'allmenu': {
    let profile
    try {
        profile = await axly.profilePictureUrl(m.sender, 'image');
    } catch (e) {
        profile = fake.anonim
    }
    const menunya = `
~_*INFORMATION*_
> Halo users! Ketik .request untuk request fitur
> _kalo gw ga males gw tanggepin_ <

*ɪɴꜰᴏ ᴘᴇɴɢɢᴜɴᴀ*
> ɴᴀᴍᴀ: ${m.pushName || 'Tanpa Nama'}
> ɪᴅ: @${m.sender.split('@')[0]}
> ꜱᴛᴀᴛᴜꜱ: ${isVip ? 'VIP' : isPremium ? 'PREMIUM' : 'FREE'}
> ʟɪᴍɪᴛ: ${isVip ? '∞' : db.users[m.sender]?.limit || 0}
> ᴜᴀɴɢ: ${db.users[m.sender]?.money?.toLocaleString('id-ID') || '0'}

*ɪɴꜰᴏ ʙᴏᴛ*
> ɴᴀᴍᴀ: ${set?.botname || 'Axly Bot'}
> ᴏᴡɴᴇʀ: @${ownerNumber[0].split('@')[0]}
> ᴍᴏᴅᴇ: ${axly.public ? 'Public' : 'Self'}
> ᴘʀᴇꜰɪx: ${set.multiprefix ? 'Multi' : prefix}

*ᴀʙᴏᴜᴛ*
> ᴅᴀᴛᴇ: ${date}
> ᴅᴀʏ: ${locale_day}
> ᴛɪᴍᴇ: ${date_time}

*ʙᴏᴛ*
> ${setv} ${prefix}profile
> ${setv} ${prefix}claim
> ${setv} ${prefix}buy [item] (nominal)
> ${setv} ${prefix}transfer
> ${setv} ${prefix}leaderboard
> ${setv} ${prefix}request (text)
> ${setv} ${prefix}react (emoji)
> ${setv} ${prefix}tagme
> ${setv} ${prefix}runtime
> ${setv} ${prefix}totalfitur
> ${setv} ${prefix}speed
> ${setv} ${prefix}ping
> ${setv} ${prefix}afk
> ${setv} ${prefix}rvo (reply pesan viewone)
> ${setv} ${prefix}inspect (url gc)
> ${setv} ${prefix}addmsg
> ${setv} ${prefix}delmsg
> ${setv} ${prefix}getmsg
> ${setv} ${prefix}listmsg
> ${setv} ${prefix}setcmd
> ${setv} ${prefix}delcmd
> ${setv} ${prefix}listcmd
> ${setv} ${prefix}lockcmd
> ${setv} ${prefix}q (reply pesan)
> ${setv} ${prefix}menfes (62xxx|fake name)
> ${setv} ${prefix}confes (62xxx|fake name)
> ${setv} ${prefix}donasi
> ${setv} ${prefix}addsewa
> ${setv} ${prefix}delsewa
> ${setv} ${prefix}listsewa

*ɢʀᴏᴜᴘ*
> ${setv} ${prefix}add (62xxx)
> ${setv} ${prefix}kick (@tag/62xxx)
> ${setv} ${prefix}promote (@tag/62xxx)
> ${setv} ${prefix}demote (@tag/62xxx)
> ${setv} ${prefix}warn (@tag/62xxx)
> ${setv} ${prefix}unwarn (@tag/62xxx)
> ${setv} ${prefix}setname (nama baru gc)
> ${setv} ${prefix}setdesc (desk)
> ${setv} ${prefix}setppgc (reply imgnya)
> ${setv} ${prefix}delete (reply pesan)
> ${setv} ${prefix}linkgrup
> ${setv} ${prefix}revoke
> ${setv} ${prefix}tagall
> ${setv} ${prefix}sematkan
> ${setv} ${prefix}unpin
> ${setv} ${prefix}hidetag
> ${setv} ${prefix}totag (reply pesan)
> ${setv} ${prefix}listonline
> ${setv} ${prefix}group set
> ${setv} ${prefix}group (khusus admin)

*ꜱᴇᴀʀᴄʜ*
> ${setv} ${prefix}ytsearch (query)
> ${setv} ${prefix}pinterest (query)
> ${setv} ${prefix}google (query)
> ${setv} ${prefix}gimage (query)
> ${setv} ${prefix}cuaca (kota)
> ${setv} ${prefix}melolo (query)

*ᴅᴏᴡɴʟᴏᴀᴅ*
> ${setv} ${prefix}ytmp3 (url)
> ${setv} ${prefix}ytmp4 (url)
> ${setv} ${prefix}instagram (url)
> ${setv} ${prefix}tiktok (url)
> ${setv} ${prefix}tiktokmp3 (url)
> ${setv} ${prefix}mediafire (url)
> ${setv} ${prefix}fb (url)

*ᴛᴏᴏʟꜱ*
> ${setv} ${prefix}get (url) 
> ${setv} ${prefix}hd (reply pesan)
> ${setv} ${prefix}hdvid (reply pesan)
> ${setv} ${prefix}toaudio (reply pesan)
> ${setv} ${prefix}tomp3 (reply pesan)
> ${setv} ${prefix}tovn (reply pesan)
> ${setv} ${prefix}toimage (reply pesan)
> ${setv} ${prefix}toptv (reply pesan)
> ${setv} ${prefix}tourl (reply pesan)
> ${setv} ${prefix}tts (textnya)
> ${setv} ${prefix}toqr (textnya)
> ${setv} ${prefix}brat (textnya)
> ${setv} ${prefix}bratvid (textnya)
> ${setv} ${prefix}ssweb (url) 
> ${setv} ${prefix}sticker (send/reply img)
> ${setv} ${prefix}colong (reply stiker)
> ${setv} ${prefix}smeme (send/reply img)
> ${setv} ${prefix}dehaze (send/reply img)
> ${setv} ${prefix}colorize (send/reply img)
> ${setv} ${prefix}emojimix 🙃+💀
> ${setv} ${prefix}readmore text1|text2
> ${setv} ${prefix}qc (pesannya)
> ${setv} ${prefix}translate
> ${setv} ${prefix}shorturl (urlnya)
> ${setv} ${prefix}gitclone (urlnya)
> ${setv} ${prefix}fat (reply audio)
> ${setv} ${prefix}fast (reply audio)
> ${setv} ${prefix}bass (reply audio)
> ${setv} ${prefix}slow (reply audio)
> ${setv} ${prefix}tupai (reply audio)
> ${setv} ${prefix}deep (reply audio)
> ${setv} ${prefix}robot (reply audio)
> ${setv} ${prefix}blown (reply audio)
> ${setv} ${prefix}reverse (reply audio)
> ${setv} ${prefix}smooth (reply audio)
> ${setv} ${prefix}earrape (reply audio)
> ${setv} ${prefix}nightcore (reply audio)
> ${setv} ${prefix}getexif (reply sticker)
> ${setv} ${prefix}removebg (replay gambar)
> ${setv} ${prefix}tohitam (replay gambar)
> ${setv} ${prefix}tofigura (replay gambar)
> ${setv} ${prefix}toreal
> ${setv} ${prefix}toanime
> ${setv} ${prefix}blurface

*ᴀɪ*
> ${setv} ${prefix}ai (query)
> ${setv} ${prefix}text2img (query)
> ${setv} ${prefix}wormgpt (query)

*ᴀɴɪᴍᴇ*
> ${setv} ${prefix}waifu
> ${setv} ${prefix}loli 
> ${setv} ${prefix}ba (blue archive)
> ${setv} ${prefix}animesearch
> ${setv} ${prefix}animewatch
> ${setv} ${prefix}animelastest
> ${setv} ${prefix}animedetail
> ${setv} ${prefix}donghua(query)

*ɢᴀᴍᴇ*
> ${setv} ${prefix}tictactoe
> ${setv} ${prefix}suit
> ${setv} ${prefix}slot
> ${setv} ${prefix}math (level)
> ${setv} ${prefix}begal
> ${setv} ${prefix}ulartangga
> ${setv} ${prefix}blackjack
> ${setv} ${prefix}catur
> ${setv} ${prefix}casino (nominal)
> ${setv} ${prefix}samgong (nominal)
> ${setv} ${prefix}rampok (@tag)
> ${setv} ${prefix}tekateki
> ${setv} ${prefix}tebaklirik
> ${setv} ${prefix}tebakkata
> ${setv} ${prefix}tebakbom
> ${setv} ${prefix}susunkata
> ${setv} ${prefix}colorblind
> ${setv} ${prefix}tebakkimia
> ${setv} ${prefix}caklontong
> ${setv} ${prefix}tebakgambar
> ${setv} ${prefix}tebakbendera

*ꜰᴜɴ*
> ${setv} ${prefix}coba
> ${setv} ${prefix}dadu
> ${setv} ${prefix}bisakah (text)
> ${setv} ${prefix}apakah (text)
> ${setv} ${prefix}kapan (text)
> ${setv} ${prefix}siapa (text)
> ${setv} ${prefix}kerangajaib (text)
> ${setv} ${prefix}cekmati (nama lu)
> ${setv} ${prefix}ceksifat
> ${setv} ${prefix}rate (reply pesan)
> ${setv} ${prefix}jodohku
> ${setv} ${prefix}jadian
> ${setv} ${prefix}fitnah
> ${setv} ${prefix}halah (text)
> ${setv} ${prefix}hilih (text)
> ${setv} ${prefix}huluh (text)
> ${setv} ${prefix}heleh (text)
> ${setv} ${prefix}holoh (text)

*ʀᴀɴᴅᴏᴍ*
> ${setv} ${prefix}coffe
> ${setv} ${prefix}pap
> ${setv} ${prefix}cecanchina
> ${setv} ${prefix}cecanindonesia
> ${setv} ${prefix}cecanjapan
> ${setv} ${prefix}cecankorea
> ${setv} ${prefix}cecanthailand
> ${setv} ${prefix}cecanvietnam

*ꜱᴛᴀʟᴋ*
> ${setv} ${prefix}wastalk
> ${setv} ${prefix}githubstalk
> ${setv} ${prefix}mlstalk
> ${setv} ${prefix}robloxstalk
> ${setv} ${prefix}genshinstalk
> ${setv} ${prefix}ffstalk

*ᴏᴡɴᴇʀ*
> ${setv} ${prefix}bot [set]
> ${setv} ${prefix}setbio
> ${setv} ${prefix}setppbot
> ${setv} ${prefix}join
> ${setv} ${prefix}leave
> ${setv} ${prefix}block
> ${setv} ${prefix}listblock
> ${setv} ${prefix}openblock
> ${setv} ${prefix}listpc
> ${setv} ${prefix}listgc
> ${setv} ${prefix}ban
> ${setv} ${prefix}unban
> ${setv} ${prefix}mute
> ${setv} ${prefix}unmute
> ${setv} ${prefix}creategc
> ${setv} ${prefix}clearchat
> ${setv} ${prefix}addprem
> ${setv} ${prefix}delprem
> ${setv} ${prefix}listprem
> ${setv} ${prefix}addlimit
> ${setv} ${prefix}adduang
> ${setv} ${prefix}setbotmessages
> ${setv} ${prefix}setbotauthor
> ${setv} ${prefix}setbotname
> ${setv} ${prefix}setbotpackname
> ${setv} ${prefix}setapikey
> ${setv} ${prefix}setbotlimit
> ${setv} ${prefix}setbotmoney
> ${setv} ${prefix}setlocale
> ${setv} ${prefix}settimezone
> ${setv} ${prefix}addprefix
> ${setv} ${prefix}delprefix
> ${setv} ${prefix}addbadword
> ${setv} ${prefix}delbadword
> ${setv} ${prefix}addowner
> ${setv} ${prefix}delowner
> ${setv} ${prefix}getmsgstore
> ${setv} ${prefix}bot --settings
> ${setv} ${prefix}bot settings
> ${setv} ${prefix}getsession
> ${setv} ${prefix}delsession
> ${setv} ${prefix}delsampah
> ${setv} ${prefix}upsw
> ${setv} ${prefix}backup
> ${setv} $
> ${setv} >
> ${setv} <
`;

    // ====== GUNAKAN BUTTONV2 SEPERTI TEMPLATE MENU TYPE 3 ======
    await new ButtonV2(axly)
        .setTitle('SEMUA MENU')
        .setSubtitle('Axly Bot - All Features')
        .setBody(menunya)
        .setFooter('© Axly Bot')
        .setThumbnail(profile)  // Gunakan profile picture
        .addButton('⬅️ BACK', `${prefix}menu`)
        .addButton('👤 OWNER', `${prefix}owner`)
        .send(m.chat, { quoted: m })
}
break

case 'botmenu': {
    m.reply(`
*ʙᴏᴛ*
> ${setv} ${prefix}profile
> ${setv} ${prefix}claim
> ${setv} ${prefix}buy [item] (nominal)
> ${setv} ${prefix}transfer
> ${setv} ${prefix}leaderboard
> ${setv} ${prefix}request (text)
> ${setv} ${prefix}react (emoji)
> ${setv} ${prefix}tagme
> ${setv} ${prefix}runtime
> ${setv} ${prefix}totalfitur
> ${setv} ${prefix}speed
> ${setv} ${prefix}ping
> ${setv} ${prefix}afk
> ${setv} ${prefix}rvo (reply pesan viewone)
> ${setv} ${prefix}inspect (url gc)
> ${setv} ${prefix}addmsg
> ${setv} ${prefix}delmsg
> ${setv} ${prefix}getmsg
> ${setv} ${prefix}listmsg
> ${setv} ${prefix}setcmd
> ${setv} ${prefix}delcmd
> ${setv} ${prefix}listcmd
> ${setv} ${prefix}lockcmd
> ${setv} ${prefix}q (reply pesan)
> ${setv} ${prefix}menfes (62xxx|fake name)
> ${setv} ${prefix}confes (62xxx|fake name)
> ${setv} ${prefix}donasi
> ${setv} ${prefix}addsewa
> ${setv} ${prefix}delsewa
> ${setv} ${prefix}listsewa
`)
}
break

case 'groupmenu': {
    m.reply(`
*ɢʀᴏᴜᴘ*
> ${setv} ${prefix}add (62xxx)
> ${setv} ${prefix}kick (@tag/62xxx)
> ${setv} ${prefix}promote (@tag/62xxx)
> ${setv} ${prefix}demote (@tag/62xxx)
> ${setv} ${prefix}warn (@tag/62xxx)
> ${setv} ${prefix}unwarn (@tag/62xxx)
> ${setv} ${prefix}setname (nama baru gc)
> ${setv} ${prefix}setdesc (desk)
> ${setv} ${prefix}setppgc (reply imgnya)
> ${setv} ${prefix}delete (reply pesan)
> ${setv} ${prefix}linkgrup
> ${setv} ${prefix}revoke
> ${setv} ${prefix}tagall
> ${setv} ${prefix}sematkan
> ${setv} ${prefix}unpin
> ${setv} ${prefix}hidetag
> ${setv} ${prefix}totag (reply pesan)
> ${setv} ${prefix}listonline
> ${setv} ${prefix}group set
> ${setv} ${prefix}group (khusus admin)
`)
}
break

case 'searchmenu': {
    m.reply(`
*ꜱᴇᴀʀᴄʜ*
> ${setv} ${prefix}ytsearch (query)
> ${setv} ${prefix}spotify (query)
> ${setv} ${prefix}pinterest (query)
> ${setv} ${prefix}wallpaper (query)
> ${setv} ${prefix}google (query)
> ${setv} ${prefix}gimage (query)
> ${setv} ${prefix}cuaca (kota)
> ${setv} ${prefix}melolo (query)
`)
}
break

case 'downloadmenu': {
    m.reply(`
*ᴅᴏᴡɴʟᴏᴀᴅ*
> ${setv} ${prefix}ytmp3 (url)
> ${setv} ${prefix}ytmp4 (url)
> ${setv} ${prefix}instagram (url)
> ${setv} ${prefix}tiktok (url)
> ${setv} ${prefix}tiktokmp3 (url)
> ${setv} ${prefix}spotifydl (url)
> ${setv} ${prefix}mediafire (url)
> ${setv} ${prefix}fb (url)
`)
}
break

case 'toolsmenu': {
    m.reply(`
*ᴛᴏᴏʟꜱ*
> ${setv} ${prefix}get (url) 
> ${setv} ${prefix}hd (reply pesan)
> ${setv} ${prefix}hdvid (reply pesan)
> ${setv} ${prefix}toaudio (reply pesan)
> ${setv} ${prefix}tomp3 (reply pesan)
> ${setv} ${prefix}tovn (reply pesan)
> ${setv} ${prefix}toimage (reply pesan)
> ${setv} ${prefix}toptv (reply pesan)
> ${setv} ${prefix}tourl (reply pesan)
> ${setv} ${prefix}tts (textnya)
> ${setv} ${prefix}toqr (textnya)
> ${setv} ${prefix}brat (textnya)
> ${setv} ${prefix}bratvid (textnya)
> ${setv} ${prefix}ssweb (url) 
> ${setv} ${prefix}sticker (send/reply img)
> ${setv} ${prefix}colong (reply stiker)
> ${setv} ${prefix}smeme (send/reply img)
> ${setv} ${prefix}dehaze (send/reply img)
> ${setv} ${prefix}colorize (send/reply img)
> ${setv} ${prefix}emojimix 🙃+💀
> ${setv} ${prefix}readmore text1|text2
> ${setv} ${prefix}qc (pesannya)
> ${setv} ${prefix}translate
> ${setv} ${prefix}shorturl (urlnya)
> ${setv} ${prefix}gitclone (urlnya)
> ${setv} ${prefix}fat (reply audio)
> ${setv} ${prefix}fast (reply audio)
> ${setv} ${prefix}bass (reply audio)
> ${setv} ${prefix}slow (reply audio)
> ${setv} ${prefix}tupai (reply audio)
> ${setv} ${prefix}deep (reply audio)
> ${setv} ${prefix}robot (reply audio)
> ${setv} ${prefix}blown (reply audio)
> ${setv} ${prefix}reverse (reply audio)
> ${setv} ${prefix}smooth (reply audio)
> ${setv} ${prefix}earrape (reply audio)
> ${setv} ${prefix}nightcore (reply audio)
> ${setv} ${prefix}getexif (reply sticker)
> ${setv} ${prefix}removebg (replay gambar)
> ${setv} ${prefix}tohitam (replay gambar)
> ${setv} ${prefix}tofigura (replay gambar)
> ${setv} ${prefix}toreal
> ${setv} ${prefix}toanime
> ${setv} ${prefix}blurface
`)
}
break

case 'aimenu': {
    m.reply(`
*ᴀɪ*
> ${setv} ${prefix}ai (query)
> ${setv} ${prefix}txt2img (query)
> ${setv} ${prefix}wormgpt (query)
`)
}
break

case 'randommenu': {
    m.reply(`
*ʀᴀɴᴅᴏᴍ*
> ${setv} ${prefix}coffe
> ${setv} ${prefix}pap
> ${setv} ${prefix}cecanchina
> ${setv} ${prefix}cecanindonesia
> ${setv} ${prefix}cecanjapan
> ${setv} ${prefix}cecankorea
> ${setv} ${prefix}cecanthailand
> ${setv} ${prefix}cecanvietnam
`)
}
break

case 'stalkermenu': {
    m.reply(`
*ꜱᴛᴀʟᴋ*
> ${setv} ${prefix}wastalk
> ${setv} ${prefix}githubstalk
> ${setv} ${prefix}mlstalk
> ${setv} ${prefix}robloxstalk
> ${setv} ${prefix}genshinstalk
> ${setv} ${prefix}ffstalk
`)
}
break

case 'animemenu': {
    m.reply(`
*ᴀɴɪᴍᴇ*
> ${setv} ${prefix}waifu
> ${setv} ${prefix}loli
> ${setv} ${prefix}ba (blue archive) 
> ${setv} ${prefix}animesearch
> ${setv} ${prefix}animewatch
> ${setv} ${prefix}animelastest
> ${setv} ${prefix}animedetail
> ${setv} ${prefix}donghuawatch (query)
`)
}
break

case 'gamemenu': {
    m.reply(`
*ɢᴀᴍᴇ*
> ${setv} ${prefix}tictactoe
> ${setv} ${prefix}suit
> ${setv} ${prefix}slot
> ${setv} ${prefix}math (level)
> ${setv} ${prefix}begal
> ${setv} ${prefix}ulartangga
> ${setv} ${prefix}blackjack
> ${setv} ${prefix}catur
> ${setv} ${prefix}casino (nominal)
> ${setv} ${prefix}samgong (nominal)
> ${setv} ${prefix}rampok (@tag)
> ${setv} ${prefix}tekateki
> ${setv} ${prefix}tebaklirik
> ${setv} ${prefix}tebakkata
> ${setv} ${prefix}tebakbom
> ${setv} ${prefix}susunkata
> ${setv} ${prefix}colorblind
> ${setv} ${prefix}tebakkimia
> ${setv} ${prefix}caklontong
> ${setv} ${prefix}tebakgambar
> ${setv} ${prefix}tebakbendera
`)
}
break

case 'funmenu': {
    m.reply(`
*ꜰᴜɴ*
> ${setv} ${prefix}coba
> ${setv} ${prefix}dadu
> ${setv} ${prefix}bisakah (text)
> ${setv} ${prefix}apakah (text)
> ${setv} ${prefix}kapan (text)
> ${setv} ${prefix}siapa (text)
> ${setv} ${prefix}kerangajaib (text)
> ${setv} ${prefix}cekmati (nama lu)
> ${setv} ${prefix}ceksifat
> ${setv} ${prefix}rate (reply pesan)
> ${setv} ${prefix}jodohku
> ${setv} ${prefix}jadian
> ${setv} ${prefix}fitnah
> ${setv} ${prefix}halah (text)
> ${setv} ${prefix}hilih (text)
> ${setv} ${prefix}huluh (text)
> ${setv} ${prefix}heleh (text)
> ${setv} ${prefix}holoh (text)
`)
}
break

case 'ownermenu': {
    m.reply(`
*ᴏᴡɴᴇʀ*
> ${setv} ${prefix}bot [set]
> ${setv} ${prefix}setbio
> ${setv} ${prefix}setppbot
> ${setv} ${prefix}join
> ${setv} ${prefix}leave
> ${setv} ${prefix}block
> ${setv} ${prefix}listblock
> ${setv} ${prefix}openblock
> ${setv} ${prefix}listpc
> ${setv} ${prefix}listgc
> ${setv} ${prefix}ban
> ${setv} ${prefix}unban
> ${setv} ${prefix}mute
> ${setv} ${prefix}unmute
> ${setv} ${prefix}creategc
> ${setv} ${prefix}clearchat
> ${setv} ${prefix}addprem
> ${setv} ${prefix}delprem
> ${setv} ${prefix}listprem
> ${setv} ${prefix}addlimit
> ${setv} ${prefix}adduang
> ${setv} ${prefix}setbotmessages
> ${setv} ${prefix}setbotauthor
> ${setv} ${prefix}setbotname
> ${setv} ${prefix}setbotpackname
> ${setv} ${prefix}setapikey
> ${setv} ${prefix}setbotlimit
> ${setv} ${prefix}setbotmoney
> ${setv} ${prefix}setlocale
> ${setv} ${prefix}settimezone
> ${setv} ${prefix}addprefix
> ${setv} ${prefix}delprefix
> ${setv} ${prefix}addbadword
> ${setv} ${prefix}delbadword
> ${setv} ${prefix}addowner
> ${setv} ${prefix}delowner
> ${setv} ${prefix}getmsgstore
> ${setv} ${prefix}bot --settings
> ${setv} ${prefix}bot settings
> ${setv} ${prefix}getsession
> ${setv} ${prefix}delsession
> ${setv} ${prefix}delsampah
> ${setv} ${prefix}upsw
> ${setv} ${prefix}backup
> ${setv} $
> ${setv} >
> ${setv} <
`)
}
break

			default:
				if (budy.startsWith('>')) {
					if (!isCreator) return;
					try {
						let evaled = await eval(budy.slice(2));
						if (typeof evaled !== 'string') evaled = util.inspect(evaled);
						await m.reply(evaled);
					} catch (err) {
						await m.reply(String(err));
					}
				}
				if (budy.startsWith('<')) {
					if (!isCreator) return;
					try {
						let evaled = await eval(`(async () => { ${budy.slice(2)} })()`);
						if (typeof evaled !== 'string') evaled = util.inspect(evaled);
						await m.reply(evaled);
					} catch (err) {
						await m.reply(String(err));
					}
				}
				if (budy.startsWith('$')) {
					if (!isCreator) return;
					if (!text) return;
					exec(budy.slice(2), (err, stdout) => {
						if (err) return m.reply(`${err}`);
						if (stdout) return m.reply(stdout);
					});
				}
				if ((!isCmd || isCreator) && budy.toLowerCase() != undefined) {
					if (m.chat.endsWith('broadcast')) return;
					if (!(budy.toLowerCase() in db.database)) return;
					await axly.relayMessage(m.chat, db.database[budy.toLowerCase()], {});
				}
		}
	} catch (e) {
		console.log(e);
		if (e?.message?.includes('No sessions') || e?.message?.includes('ffmpeg exited with code') || e?.code === 'ERR_FR_MAX_BODY_LENGTH_EXCEEDED' || e?.message?.includes('maxBodyLength limit') || e?.message?.includes('rate-overlimit')) return;
		const errorKey = e?.code || e?.name || e?.message?.slice(0, 100) || 'unknown_error';
		const now = Date.now();
		if (!errorCache[errorKey]) errorCache[errorKey] = [];
		errorCache[errorKey] = errorCache[errorKey].filter(ts => now - ts < 600000);
		if (errorCache[errorKey].length >= 3) return;
		errorCache[errorKey].push(now);
		const isAxiosError = e?.isAxiosError || !!e?.response;
		const statusCode = e?.response?.status || e?.statusCode || e?.data;
		const errorUrl = e?.config?.url || e?.request?.host || '';
		if (statusCode === 500) {
			m.reply('Server API Error: Terjadi gangguan pada server tujuan.');
		} else if (statusCode === 429) {
			if (errorUrl.includes('')) {
				return m.reply('Limit Reached: ' + mess.key);
			} else m.reply('Limit Reached (Sistem/WA): Terlalu banyak permintaan.\nLog Error Telah dikirim ke Owner');
		} else if (statusCode === 403) {
			if (isAxiosError) {
				if (errorUrl.includes('')) {
					return m.reply('Akses Khusus Premium!');
				} else m.reply('API Error: Akses ke server API ditolak (403 Forbidden).');
			} else console.log(chalk.yellowBright('[SYSTEM] Akses grup ditolak (Baileys 403 / Forbidden).'));
		} else if (statusCode === 401) {
			if (isAxiosError) {
				if (errorUrl.includes('')) {
					return m.reply('Invalid Apikey!');
				} else m.reply('API Error: Akses ke server API ditolak (401 Unauthorized).');
			} else console.log(chalk.yellowBright('[SYSTEM] Akses ditolak (401 Unauthorized).'));
		} else m.reply('Error: ' + (e?.name || e?.code || e?.message || 'Terjadi kesalahan tidak diketahui') + '\nLog Error Telah dikirim ke Owner\n\n');
		return axly.sendFromOwner(ownerNumber, `Halo sayang, sepertinya ada yang error nih, jangan lupa diperbaiki ya\n\nVersion : *${require('./package.json').version}*\nType : *${m.type || errorKey}*\n\n*Log error:*\n\n` + util.format(e), m, { contextInfo: { isForwarded: true } });
	}
}

export default axly
