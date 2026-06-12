import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

//~~~~~~~~~~~~< GLOBAL SETTINGS >~~~~~~~~~~~~\\

global.owner = ['6282191240883'] // ['628','628'] 2 owner atau lebih
global.author = '~'
global.botname = 'Axly Bot'
global.packname = 'Bot WhatsApp'
global.timezone = 'Asia/Jakarta' // Ganti pakai command .settimezone
global.locale = 'en' // Ganti pakai command .setlocale
global.listprefix = ['+','!','.']

global.listv = ['々']
global.tempatDB = 'database.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.tempatStore = 'baileys_store.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.pairing_code = true
global.number_bot = '' // Kalo pake panel bisa masukin nomer di sini, jika belum ambil session. Format : '628xx'

global.fake = {
	anonim: 'https://telegra.ph/file/95670d63378f7f4210f03.png',
	thumbnailUrl: 'https://n.uguu.se/mxtszACp.jpg',
	thumbnail: fs.readFileSync('./src/media/naze.png'),
	docs: fs.readFileSync('./src/media/fake.pdf'),
	listfakedocs: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf'],
}

global.my = {
	yt: '~',
	gh: '~',
	ch: '~',
}

global.limit = {
	free: 67,
	premium: 6767,
	vip: 677
}

global.money = {
	free: 167676,
	premium: 167676767,
	vip: 10000000
}

global.mess = {
	owner: "Khusus Owner!",
	admin: "Khusus Admin!",
	botAdmin: "Bot harus Admin!",
	onWa: "Nomor tersebut tidak terdaftar di WhatsApp!",
	group: "Khusus Grup!",
	private: "Khusus Private Chat!",
	quoted: "Reply pesannya!",
	limit: "Limit habis!",
	prem: "Khusus Premium!",
	text: "Masukkan teksnya!",
	media: "Kirim medianya!",
	wait: "Proses...",
	fail: "Gagal!",
	error: "Error!",
	done: "Selesai!"
}
// Lainnya
global.jadwalSholat = {
	Subuh: '04:30',
	Dzuhur: '12:06',
	Ashar: '15:21',
	Maghrib: '18:08',
	Isya: '19:00'
}

global.badWords = ['dongo', 'konsol'] // input kata-kata toxic yg lain. ex: ['dongo','dongonya']
global.chatLength = 1000

fs.watchFile(__filename, async () => {
	console.log(chalk.yellowBright(`[UPDATE] ${__filename}`))
});
