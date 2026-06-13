import '../settings.js';
import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import moment from 'moment-timezone';
import { pickRandom } from './function.js';
import { Button, ButtonV2, Carousel, AIRich } from './nixcode.js';

const __filename = fileURLToPath(import.meta.url);

async function setTemplateMenu(axly, type, m, prefix, setv, db, options = {}) {
    // Ensure hit object exists
    if (!db.hit) {
        db.hit = {};
    }
    
    // Get top commands dari hit data
    // Filter dan sort properly
    let topCommands = Object.entries(db.hit)
        .filter(([cmd, hits]) => {
            // Skip meta commands
            if (cmd === 'totalcmd' || cmd === 'todaycmd') return false;
            // Only include if has hits
            return hits > 0;
        })
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Ambil 5 teratas
    
    let topMenu = '';
    
    // Tampilkan top commands jika ada, jika tidak ada tampilkan default
    if (topCommands && topCommands.length > 0) {
        topMenu = topCommands
            .map(([command, hits]) => `> ${setv} ${prefix}${command}: ${hits} hits`)
            .join('\n');
    } else {
        // Default menu jika belum ada data
        topMenu = [
            `> ${setv} ${prefix}ai`,
            `> ${setv} ${prefix}brat`,
            `> ${setv} ${prefix}tiktok`,
            `> ${setv} ${prefix}cekmati`,
            `> ${setv} ${prefix}susunkata`
        ].join('\n');
    }

    const menunya = `
~_*INFORMATION*_
> Halo users! Ketik .request untuk request
> fitur atau melaporkan masalah eror
> _kalo gw ga males gw tanggepin_ <
> ᴀᴘɪ ʙᴏᴛ : axlyapi.qzz.io ♥︎

*ɪɴꜰᴏ ᴘᴇɴɢɢᴜɴᴀ*
> ɴᴀᴍᴀ: ${m.pushName || 'Tanpa Nama'}
> ɪᴅ: @${m.sender.split('@')[0]}
> ꜱᴛᴀᴛᴜꜱ: ${options.isVip ? 'VIP' : options.isPremium ? 'PREMIUM' : 'FREE'}
> ʟɪᴍɪᴛ: ${options.isVip ? '∞' : db.users[m.sender]?.limit || 0}
> ᴜᴀɴɢ: ${db.users[m.sender]?.money?.toLocaleString('id-ID') || '0'}

*ɪɴꜰᴏ ʙᴏᴛ*
> ɴᴀᴍᴀ: ${db?.set?.[options.botNumber]?.botname || 'Axly Bot'}
> ᴍᴏᴅᴇ: ${axly.public ? 'Public' : 'Self'}
> ᴘʀᴇꜰɪx: ${db.set[options.botNumber]?.multiprefix ? 'Multi' : prefix}
> ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅꜱ: ${db.hit?.totalcmd || 0}

*ᴀʙᴏᴜᴛ*
> ᴅᴀᴛᴇ: ${options.date}
> ᴅᴀʏ: ${options.locale_day}
> ᴛɪᴍᴇ: ${options.date_time}

*ᴛᴏᴘ ᴍᴇɴᴜ*
${topMenu}
> _sɪʟᴀʜᴋᴀɴ ᴛᴇᴋᴀɴ ᴛᴏᴍʙᴏʟ ᴅɪ ʙᴀᴡᴀʜ ᴜɴᴛᴜᴋ ᴍᴇᴍɪʟɪʜ ᴄᴀᴛᴇʜᴏʀʏ_
`;

    if (type == 1 || type == 'buttonMessage') {
        await axly.sendButtonMsg(m.chat, {
            text: `Halo @${m.sender.split('@')[0]}\n\n${topMenu}`,
            footer: 'Klik tombol di bawah untuk melihat semua menu',
            mentions: [m.sender],
            buttons: [
                { buttonId: `${prefix}allmenu`, buttonText: { displayText: '📋 All Menu' }, type: 1 },
                { buttonId: `${prefix}sc`, buttonText: { displayText: '📂 Script' }, type: 1 }
            ]
        }, { quoted: m })
        
    } else if (type == 2 || type == 'listMessage') {
        await axly.sendButtonMsg(m.chat, {
            text: `Halo @${m.sender.split('@')[0]}\n\n${topMenu}`,
            footer: 'Klik tombol di bawah untuk melihat semua menu',
            mentions: [m.sender],
            buttons: [
                { buttonId: `${prefix}allmenu`, buttonText: { displayText: '📋 All Menu' }, type: 1 },
                { buttonId: `${prefix}sc`, buttonText: { displayText: '📂 Script' }, type: 1 }
            ]
        }, { quoted: m })
        
    } else if (type == 3 || type == 'documentMessage') {
        // ========== BUTTON V2 - HANYA 2 BUTTON MENYAMPING ==========
        await new ButtonV2(axly)
            .setTitle('AXLY BOT')
            .setSubtitle('WhatsApp Bot AxlyChann')
            .setBody(menunya)
            .setFooter('© AxlyAssistant • 2026')
            .setThumbnail('https://u.pone.rs/vchiifzr.jpg')
            .addButton('📦 MENU', `${prefix}allmenu`)
            .addButton('👤 PROFILE', `${prefix}profile`)
            .send(m.chat, { quoted: m })
        // ========== END BUTTON V2 ==========
        
    } else if (type == 4 || type == 'videoMessage') {
        // tambahin sendiri
    } else {
        m.reply(`${options.ucapanWaktu} @${m.sender.split('@')[0]}\nSilahkan Gunakan ${prefix}allmenu\nUntuk Melihat Semua Menunya`)
    }
}

export default setTemplateMenu;

fs.watchFile(__filename, async () => {
    fs.unwatchFile(__filename)
    console.log(chalk.yellowBright(`[UPDATE] ${__filename}`))
    await import(`${import.meta.url}?update=${Date.now()}`)
});