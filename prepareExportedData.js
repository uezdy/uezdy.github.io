const path = require('path');
const fs = require('fs');

const publicPath = path.resolve(`public/`);

const groupsList = fs.readdirSync(publicPath, 'utf8');

const getExistingMessagesOfGroup = (groupName) => {

    const result = {};
    const groupPath = path.join(publicPath, groupName, '/src');
    const topicsList = fs.readdirSync(groupPath, 'utf8');
    topicsList.forEach((topic) => {
        const topicPath = path.join(groupPath, topic);
        const pageFileItems = fs.readdirSync(topicPath, 'utf8');
        pageFileItems.forEach((pageItem) => {
            const messagesPageJSONFile = path.join(topicPath, pageItem);
            const file = fs.readFileSync(messagesPageJSONFile, 'utf8');
            const data = JSON.parse(file);
            if (!result[topic]) {
                result[topic] = {};
            }
            result[topic] = {...result[topic], ...data};
        });
    });

    return result;
};

groupsList.forEach((groupNickName) => {
    if (~groupNickName.indexOf('.')) {
        return;
    }
    const pool = getExistingMessagesOfGroup(groupNickName);
    const perChunk = 2000;
    const targetUezd = path.resolve(`public/${groupNickName}`);
    const targetDir = path.resolve(`public/${groupNickName}/src`);
    const pathJSON = path.join(`public/${groupNickName}/result.json`);
    const file = fs.readFileSync(pathJSON, 'utf8');
    const data = JSON.parse(file);

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
            if (!pool[tID] && poolTopics[tID]) {
                pool[tID] = {};
            }
            if (poolTopics[tID]) {
                if (!pool[tID][message.id]) {
                    pool[tID][message.id] = message;
                }
            } else {
                if (!pool['0'][message.id]) {
                    pool['0'][message.id] = message;
                }
            }
        } else {
            if (!pool['0'][message.id]) {
                pool['0'][message.id] = message;
            }
        }
    });

    if (!fs.existsSync(`${targetDir}`)){
        fs.mkdirSync(`${targetDir}`);
    }

    for (const topicId in pool) {
        if (!fs.existsSync(`${targetDir}/${topicId}`)){
            fs.mkdirSync(`${targetDir}/${topicId}`);
        }
        const messagesArray = Object.values(pool[topicId]);

        const chunckObjects = messagesArray.reduce((resultObject, item, index) => {
            const chunkIndex = Math.floor(index/perChunk)

            if(!resultObject[chunkIndex]) {
                resultObject[chunkIndex] = {};
            }

            resultObject[chunkIndex][item.id] = item;

            return resultObject
        }, []);

        chunckObjects.forEach((chunck, index) => {
            fs.writeFileSync(`${targetDir}/${topicId}/${normalazePageNumb(index)}.json`, JSON.stringify(chunck, null, 4), {encoding: 'utf8', flag: 'w'});
        });
    }

    const topicsPath = `${targetUezd}/topics.json`;
    if (!fs.existsSync(topicsPath)){
        fs.writeFileSync(topicsPath, JSON.stringify(poolTopics, null, 4), {encoding: 'utf8', flag: 'w'});
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
