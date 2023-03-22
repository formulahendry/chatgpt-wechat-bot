import dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt';
import { viaChatGPT } from './constants.js';

dotenv.config()

let parentMessageId;

const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @param {string} text 
 * @returns {string}
 */
export async function getChatGPTReply(prompt) {
    console.log('🚀🚀🚀 /prompt: ', prompt)

    const response = await api.sendMessage(prompt, {
        parentMessageId
    });
    const reply = response.text

    parentMessageId = response.id;

    console.log('🚀🚀🚀 /reply: ', reply)

    return `${reply}\n\n${viaChatGPT}`;
}
