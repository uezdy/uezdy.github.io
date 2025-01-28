const path = require('path');
const fs = require('fs');

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


