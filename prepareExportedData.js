const path = require('path');
const fs = require('fs');

const perChunk = 2000;
const targetDir = path.resolve('public/uezdy/src1');
const pathJSON = path.join('public/uezdy/result.json');
const file = fs.readFileSync(pathJSON, 'utf8');
const data = JSON.parse(file);

const pool = {
    '0': {}
};
const poolID = {};
const poolTopics = {
    '0': {
        title: 'default',
        id: 0
    }
};

const getTopicId = (id) => {
    const {reply_to_message_id} = poolID[id] || {};
    if (reply_to_message_id) {
        return getTopicId(reply_to_message_id);
    } else {
        return id;
    }
};

data.messages.forEach((message, index) => {
    if (!poolID[message.id]) {
        poolID[message.id] = message;
    }
    if (message.action === 'topic_created') {
        poolTopics[message.id] = {
            title: message.title,
            id: message.id
        };
    }
    if (message.reply_to_message_id) {
        const tID = getTopicId(message.reply_to_message_id);
        if (!pool[tID]) {
            pool[tID] = {};
        }
        pool[tID][message.id] = message;
    } else {
        pool['0'][message.id] = message;
    }
});

for (const topicId in pool) {
    let count = 2000;
    let topicChunk = {};
    const messagesObject = pool[topicId];
    for (const messageId in messagesObject) {
        topicChunk[messageId] = messagesObject[messageId];
        if (Object.keys(topicChunk).length >= (count - 1)) {
            const fileName = normalazePageNumb(`${count}`);
            if (!fs.existsSync(`${targetDir}/${topicId}`)){
                fs.mkdirSync(`${targetDir}/${topicId}`);
            }
            fs.writeFileSync(`${targetDir}/${topicId}/${fileName}.json`, JSON.stringify(topicChunk, null, 4), {encoding: 'utf8', flag: 'w'});
            topicChunk = {};
            count += 2000;
        }
    }
}

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
