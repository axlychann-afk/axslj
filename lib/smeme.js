import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { readFile, writeFile, mkdir, rm } from "fs/promises";
import { existsSync, createWriteStream, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONT_IMPACT = {
  url: "https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/impact.ttf",
  localPath: path.join(__dirname, "fonts", "impact.ttf"),
  family: "SmemeImpact",
};

const CONFIG = {
  imagePath: process.argv[2] || "/home/container/assets/t3v10.jpg",
  top: process.argv[3] || "Halo",
  bottom: process.argv[4] || "Guyc",
  output: process.argv[5] || "./meme_output.png",

  fontSize: Number(process.argv[6] ?? 0),
  strokeWidth: Number(process.argv[7] ?? 0),

  maxWidth: 1000,

  autoFontRatio: 0.16,
  autoFontHeightRatio: 0.13,
  minFontSize: 20,
  maxFontSize: 180,

  maxTextRatio: 0.92,

  autoStrokeRatio: 0.14,
  minStrokeWidth: 2,
  maxStrokeWidth: 28,

  safePadding: 2,

  sameFontSize: true,
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    let file = createWriteStream(dest);

    const get = (targetUrl) => {
      https
        .get(
          targetUrl,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            },
          },
          (res) => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
              file.close();
              file = createWriteStream(dest);
              return get(res.headers.location);
            }

            if (res.statusCode !== 200) {
              file.close();
              return reject(
                new Error(`Gagal download font Impact: HTTP ${res.statusCode}`)
              );
            }

            res.pipe(file);

            file.on("finish", () => {
              file.close(resolve);
            });

            file.on("error", (err) => {
              file.close();
              reject(err);
            });
          }
        )
        .on("error", (err) => {
          file.close();
          reject(err);
        });
    };

    get(url);
  });
}

async function ensureImpactFont() {
  await mkdir(path.dirname(FONT_IMPACT.localPath), { recursive: true });

  const exists = existsSync(FONT_IMPACT.localPath);
  const valid = exists && statSync(FONT_IMPACT.localPath).size >= 10000;

  if (!valid) {
    if (exists) {
      await rm(FONT_IMPACT.localPath, { force: true });
    }

    await downloadFile(FONT_IMPACT.url, FONT_IMPACT.localPath);
  }

  const size = statSync(FONT_IMPACT.localPath).size;

  if (size < 10000) {
    throw new Error(`Font Impact rusak / bukan TTF valid. Size: ${size} bytes`);
  }

  const ok = GlobalFonts.registerFromPath(
    FONT_IMPACT.localPath,
    FONT_IMPACT.family
  );

  if (!ok) {
    throw new Error(`Font Impact gagal diregister dari: ${FONT_IMPACT.localPath}`);
  }

  return true;
}

let fontRegistered = false;

export async function loadFonts() {
  if (fontRegistered) return;

  await ensureImpactFont();

  fontRegistered = true;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fontCss(size) {
  return `${size}px "SmemeImpact"`;
}

function getAutoFontSize(canvasW, canvasH) {
  const byWidth = canvasW * CONFIG.autoFontRatio;
  const byHeight = canvasH * CONFIG.autoFontHeightRatio;

  return clamp(
    Math.min(byWidth, byHeight),
    CONFIG.minFontSize,
    CONFIG.maxFontSize
  );
}

function getStrokeWidthFromFont(fontSize, ratio) {
  if (CONFIG.strokeWidth > 0) {
    return Math.max(1, CONFIG.strokeWidth * ratio);
  }

  return clamp(
    fontSize * CONFIG.autoStrokeRatio,
    CONFIG.minStrokeWidth,
    CONFIG.maxStrokeWidth
  );
}

function getMaxTextWidth(canvasW, strokeWidth) {
  const safe = CONFIG.safePadding + strokeWidth / 2;
  const byRatio = canvasW * CONFIG.maxTextRatio;
  const bySafeZone = canvasW - safe * 2;

  return Math.max(1, Math.min(byRatio, bySafeZone));
}

function fitFontToSafeZone(ctx, text, startSize, ratio, canvasW) {
  if (!text) return startSize;

  let size = startSize;

  while (size > CONFIG.minFontSize) {
    const strokeWidth = getStrokeWidthFromFont(size, ratio);
    const maxTextWidth = getMaxTextWidth(canvasW, strokeWidth);

    ctx.font = fontCss(size);

    const textWidth = ctx.measureText(text).width + strokeWidth;

    if (textWidth <= maxTextWidth) {
      break;
    }

    size -= 2;
  }

  return Math.max(size, CONFIG.minFontSize);
}

function getFinalFontSize(ctx, text, ratio, canvasW, canvasH) {
  const startSize =
    CONFIG.fontSize > 0
      ? CONFIG.fontSize * ratio
      : getAutoFontSize(canvasW, canvasH);

  return fitFontToSafeZone(ctx, text, startSize, ratio, canvasW);
}

function getTextPosition(type, canvasW, canvasH, strokeWidth) {
  const safe = CONFIG.safePadding + strokeWidth / 2;

  if (type === "top") {
    return {
      x: canvasW / 2,
      y: safe,
      baseline: "top",
    };
  }

  return {
    x: canvasW / 2,
    y: canvasH - safe,
    baseline: "bottom",
  };
}

async function generateSmeme(options = {}) {
  await loadFonts();

  const imagePath = options.imagePath || CONFIG.imagePath;
  const top = options.top ?? CONFIG.top;
  const bottom = options.bottom ?? CONFIG.bottom;

  if (!existsSync(imagePath)) {
    throw new Error(`File gambar tidak ditemukan: ${imagePath}`);
  }

  const imageBuffer = await readFile(imagePath);
  const img = await loadImage(imageBuffer);

  const ratio = Math.min(CONFIG.maxWidth / img.width, 1);
  const canvasW = Math.round(img.width * ratio);
  const canvasH = Math.round(img.height * ratio);

  const canvas = createCanvas(canvasW, canvasH);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, canvasW, canvasH);

  let topFont = getFinalFontSize(ctx, top, ratio, canvasW, canvasH);
  let bottomFont = getFinalFontSize(ctx, bottom, ratio, canvasW, canvasH);

  if (CONFIG.sameFontSize) {
    const finalFont = Math.min(topFont, bottomFont);
    topFont = finalFont;
    bottomFont = finalFont;
  }

  const topStroke = getStrokeWidthFromFont(topFont, ratio);
  const bottomStroke = getStrokeWidthFromFont(bottomFont, ratio);

  const topPos = getTextPosition("top", canvasW, canvasH, topStroke);
  const bottomPos = getTextPosition("bottom", canvasW, canvasH, bottomStroke);

  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  if (top) {
    ctx.font = fontCss(topFont);
    ctx.lineWidth = topStroke;
    ctx.textBaseline = topPos.baseline;

    ctx.strokeText(top, topPos.x, topPos.y);
    ctx.fillText(top, topPos.x, topPos.y);
  }

  if (bottom) {
    ctx.font = fontCss(bottomFont);
    ctx.lineWidth = bottomStroke;
    ctx.textBaseline = bottomPos.baseline;

    ctx.strokeText(bottom, bottomPos.x, bottomPos.y);
    ctx.fillText(bottom, bottomPos.x, bottomPos.y);
  }

  return await canvas.encode("png");
}

export { generateSmeme };

export default {
  command: "smeme",
  run: async (ctx) => {
    try {
      const buffer = await generateSmeme();

      await ctx.replyWithPhoto(
        { source: buffer, filename: "smeme.png" },
        { caption: "" }
      );
    } catch (e) {
      console.error(e);
      await ctx.reply("Error generate gambar");
    }
  },
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSmeme()
    .then(async (buffer) => {
      if (CONFIG.output === "-") {
        process.stdout.write(buffer);
        return;
      }

      const outputPath = path.resolve(CONFIG.output);

      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, buffer);

      console.log(outputPath);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}