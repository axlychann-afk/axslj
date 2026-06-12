import { spawn } from 'child_process'

function mulai() {
    console.log('[BOT] Bot dimulai...')
    const bot = spawn('node', ['index.js'], { stdio: 'inherit' })
    
    bot.on('exit', (code) => {
        console.log('[BOT] Bot mati, restart 3 detik...')
        setTimeout(mulai, 3000)
    })
}

mulai()
