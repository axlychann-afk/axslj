import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONT_DIR = path.join(__dirname, 'fonts');
const NOTO_EMOJI_URL = 'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/fonts/NotoColorEmoji.ttf';
const NOTO_EMOJI_PATH = path.join(FONT_DIR, 'NotoColorEmoji.ttf');

// Download file dari URL
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        
        https.get(url, { 
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Follow redirect
                const redirectUrl = response.headers.location;
                downloadFile(redirectUrl, dest).then(resolve).catch(reject);
                return;
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`Gagal download font: HTTP ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
            file.on('error', (err) => {
                fs.unlinkSync(dest);
                reject(err);
            });
        }).on('error', (err) => {
            fs.unlinkSync(dest);
            reject(err);
        });
    });
}

// Pastikan font tersedia dan register ke GlobalFonts
export async function ensureEmojiFont() {
    // Buat folder fonts jika belum ada
    if (!fs.existsSync(FONT_DIR)) {
        fs.mkdirSync(FONT_DIR, { recursive: true });
    }
    
    // Download font jika belum ada
    if (!fs.existsSync(NOTO_EMOJI_PATH)) {
        console.log('[FONT] Downloading NotoColorEmoji.ttf...');
        try {
            await downloadFile(NOTO_EMOJI_URL, NOTO_EMOJI_PATH);
            console.log('[FONT] Download selesai');
        } catch (err) {
            console.error('[FONT] Gagal download:', err.message);
            // Fallback ke URL alternatif
            const fallbackUrl = 'https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/fonts/NotoColorEmoji.ttf';
            await downloadFile(fallbackUrl, NOTO_EMOJI_PATH);
            console.log('[FONT] Download dari fallback selesai');
        }
    }
    
    // Register font ke canvas (dilakukan di tempat pemanggilan)
    return NOTO_EMOJI_PATH;
}

// Cek apakah font sudah ada
export function isEmojiFontAvailable() {
    return fs.existsSync(NOTO_EMOJI_PATH);
}

// Dapatkan path font
export function getEmojiFontPath() {
    return NOTO_EMOJI_PATH;
}

// Path folder fonts
export function getFontsDir() {
    return FONT_DIR;
}