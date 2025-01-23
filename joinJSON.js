const path = require('path');
const fs = require('fs');

const messages = [];
const files = fs.readdirSync(path.resolve('./public/uezdy/src'), 'utf8')

files.forEach((file) => {
    const pathJSON = path.join('./public/uezdy/src', file);
    const fileData = fs.readFileSync(pathJSON, 'utf8');
    const data = JSON.parse(fileData);
    messages.push(...data);
});

fs.writeFileSync(`./public/uezdy/uezdy.json`, JSON.stringify(messages, null, 4), {encoding: 'utf8', flag: 'w'});
console.log(messages.length);
