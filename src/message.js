import { getChatGPTReply } from "./chatgpt.js";
import { viaChatGPT } from "./constants.js";

/**
 * @param {import("wechaty").Message} msg 
 */
export async function processMessage(msg) {
    const talker = msg.talker();
    const listener = msg.listener();
    let text = msg.text();
    const room = msg.room();
    const isMentionSelf = await msg.mentionSelf();

    if (text.length > 300) {
        return;
    }

    if (talker?.name() === listener?.name()) {
        return;
    }

    if (msg.self()) {
        return;
    }

    if (text.includes(viaChatGPT)) {
        return;
    }

    if (room && isMentionSelf) {
        listener
        let listenerName = '';
        if (listener) {
            const alias = await room.alias(listener);
            listenerName = alias || listener.name();
        }
        text = text.replace(`@${listenerName}`, '');

        if (text === "ping") {
            await room.say(`ping received`);
            return;
        }

        console.log(`group content: ${text}`);
        if (text) {
            text = text.trim();
            const reply = await getChatGPTReply(text)
            await room.say(reply);
        }
    }

    if (!room) {
        const reply = await getChatGPTReply(text)
        await talker.say(reply);
    }
}