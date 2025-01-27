import path from "path";
import fs from "fs";
import {TGMessage} from "@/app/components/types";

const messages: Array<TGMessage> = [];
const files = await fs.readdirSync(path.resolve('./public/uezdy/src'), 'utf8')

const topicsPool: any = {};
export const perChunk = 100;

files.forEach((file: string) => {
    const pathJSON = path.join('./public/uezdy/src', file);
    const fileData = fs.readFileSync(pathJSON, 'utf8');
    const data = JSON.parse(fileData);
    data.forEach((msg: TGMessage) => {
        if (msg.action === 'topic_created') {
            topicsPool[msg.id] = msg;
            topicsPool[msg.id].messages = [];
        }

    });
    messages.push(...data);
});

messages.forEach((msg: TGMessage) => {
    if (msg.reply_to_message_id) {
        if (topicsPool[msg.reply_to_message_id]) {
            topicsPool[msg.reply_to_message_id].messages.push(msg);
        }
    }
});




for (const topicsPoolKey in topicsPool) {
    const msg: TGMessage = topicsPool[topicsPoolKey];

    topicsPool[topicsPoolKey].messages = msg.messages.reduce((resultArray: any, item: any, index: number) => {
        const chunkIndex = Math.floor(index/perChunk)

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
}
export {topicsPool};
