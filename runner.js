import { spawn } from 'child_process'
import chalk from 'chalk'

function startBot() {
    console.log(chalk.cyan('[BOT] Starting bot...'))
    const child = spawn('node', ['index.js'], { stdio: 'inherit' })
    
    child.on('exit', (code) => {
        console.log(chalk.yellow(`[BOT] Bot exit (code: ${code}), restart in 3s...`))
        setTimeout(startBot, 3000)
    })
    
    child.on('error', (err) => {
        console.error(chalk.red('[BOT] Error:'), err.message)
        setTimeout(startBot, 3000)
    })
}

startBot()