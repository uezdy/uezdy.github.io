const path = require('path');
const fs = require('fs');

const pathJSON = path.join('public/uezdy/result.json');
const file = fs.readFileSync(pathJSON, 'utf8');
const data = JSON.parse(file);

const targetDir = path.resolve('public/uezdy/src');
const pool = {};
console.log(data.name, data.messages.length);

let currentChunk = [];

let count = 2000;

data.messages.forEach((message, index) => {
    if (!pool[message.id]) {
        currentChunk.push(message);
        pool[message.id] = true;
    }

    if (+message.id >= (count - 1)) {
        const fileName = normalazePageNumb(`${count}`);
        fs.writeFileSync(`${targetDir}/${fileName}.json`, JSON.stringify(currentChunk, null, 4), {encoding: 'utf8', flag: 'w'});
        currentChunk = [];
        count += 2000;
    }

    if (index === (data.messages.length - 1)) {
        count += 2000;
        const fileName = normalazePageNumb(`${count}`);
        fs.writeFileSync(`${targetDir}/${fileName}.json`, JSON.stringify(currentChunk, null, 4), {encoding: 'utf8', flag: 'w'});
    }
});

function normalazePageNumb(page) {
    let additional = '';
    switch (page.length) {
        case 1:
            additional = '000000';
            break;
        case 2:
            additional = '00000';
            break;
        case 3:
            additional = '0000';
            break;
        case 4:
            additional = '000';
            break;
        case 5:
            additional = '00';
            break;
        default:
            additional = '0';
    }
    return `${additional}${page}`;
}
