import fs from 'fs'
import sharp from 'sharp'
import { exec } from 'child_process'

export default function webpToVideo(bufferImage) {
    return new Promise(async (resolve, reject) => {
        let files = []
        let pathFile = ''
        try {
            if (!fs.existsSync('./tmp')) {
                fs.mkdirSync('./tmp', { recursive: true })
            }
            
            pathFile = "./tmp/" + Date.now() + "_" + ~~(Math.random() * 1000)
            fs.writeFileSync(pathFile + ".webp", bufferImage)
            files.push(pathFile + ".webp")
            
            const isAnimated = bufferImage.includes(Buffer.from('ANIM')) || bufferImage.includes(Buffer.from('ANMF'))
            
            if (!isAnimated) {
                const png = await sharp(bufferImage).png().toBuffer()
                cleanup()
                resolve(png)
                return
            }
            
            const meta = await sharp(bufferImage).metadata()
            const maxFrames = Math.min(meta.pages || 30, 30)
            
            const gifBuffer = await sharp(bufferImage, { 
                animated: true, 
                pages: maxFrames 
            }).gif({ 
                loop: 0 
            }).toBuffer()
            
            fs.writeFileSync(pathFile + ".gif", gifBuffer)
            files.push(pathFile + ".gif")
            
            const timeout = setTimeout(() => {
                try {
                    const gif = fs.readFileSync(pathFile + ".gif")
                    cleanup()
                    resolve(gif)
                } catch (e) {
                    cleanup()
                    reject(new Error('Timeout'))
                }
            }, 20000)
            
            exec(`ffmpeg -y -i "${pathFile}.gif" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2, fps=15" -t 10 -an "${pathFile}.mp4"`, (error) => {
                clearTimeout(timeout)
                
                if (error || !fs.existsSync(pathFile + ".mp4")) {
                    try {
                        const gif = fs.readFileSync(pathFile + ".gif")
                        cleanup()
                        resolve(gif)
                    } catch (e) {
                        cleanup()
                        reject(e)
                    }
                    return
                }
                
                try {
                    const videoBuffer = fs.readFileSync(pathFile + ".mp4")
                    cleanup()
                    resolve(videoBuffer)
                } catch (e) {
                    cleanup()
                    reject(e)
                }
            })
            
        } catch(e) {
            cleanup()
            reject(e)
        }
        
        function cleanup() {
            setTimeout(() => {
                files.forEach(f => {
                    try { if (fs.existsSync(f)) fs.unlinkSync(f) } catch {}
                })
                try { if (fs.existsSync(pathFile + ".mp4")) fs.unlinkSync(pathFile + ".mp4") } catch {}
            }, 5000)
        }
    })
}