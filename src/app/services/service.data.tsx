import path from "path";
import fs from "fs";
import {TGMessage} from "@/app/components/types";

const messages: Array<TGMessage> = [];
const files = await fs.readdirSync(path.resolve('./public/uezdy/src'), 'utf8')

files.forEach((file: string) => {
    const pathJSON = path.join('./public/uezdy/src', file);
    const fileData = fs.readFileSync(pathJSON, 'utf8');
    const data = JSON.parse(fileData);
    messages.push(...data);
});

fs.writeFileSync(`./public/uezdy/uezdy.json`, JSON.stringify(messages), {encoding: 'utf8', flag: 'w'});
console.log(messages.length);

export {messages};
