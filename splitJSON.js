const path = require('path');
const fs = require('fs');

const pathJSON = path.join('public/result.json');
const file = fs.readFileSync(pathJSON, 'utf8');
const data = JSON.parse(file);

const targetDir = path.resolve('public/uezdy');
const pool = {};
console.log(data.name, data.messages.length);

let currentChunk = [];

data.messages.forEach((message) => {
    if (!pool[message.id]) {
        currentChunk.push(message);
        pool[message.id] = true;
    }

    if (currentChunk.length > 2000) {
        const fileName = `${currentChunk[0].id}_${currentChunk[currentChunk.length - 1].id}`;
        fs.writeFileSync(`${targetDir}/${fileName}.json`, JSON.stringify(currentChunk, null, 4), {encoding: 'utf8', flag: 'w'});
        currentChunk = [];
    }
});
