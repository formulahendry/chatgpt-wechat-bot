import {
    WechatyBuilder,
    ScanStatus,
    log,
} from 'wechaty'
import qrcodeTerminal from 'qrcode-terminal'
import { processMessage } from './message.js'

const initializedAt = Date.now()

function onScan(qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('')

        log.info('ChatGPTBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    } else {
        log.info('ChatGPTBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
}

function onLogin(user) {
    log.info('ChatGPTBot', '%s login', user)
}

function onLogout(user) {
    log.info('ChatGPTBot', '%s logout', user)
}

async function onMessage(msg) {
    log.info('ChatGPTBot', msg.toString())

    if (msg.date().getTime() < initializedAt || msg.type() != bot.Message.Type.Text) {
        return;
    }

    await processMessage(msg);
}

const bot = WechatyBuilder.build({
    name: 'chatgpt-bot',
    puppet: "wechaty-puppet-wechat",
    puppetOptions: {
        uos: true // 开启 UOS 协议
    }
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
    .then(() => log.info('ChatGPTBot', 'Starter Bot Started.'))
    .catch(e => log.error('ChatGPTBot', e))