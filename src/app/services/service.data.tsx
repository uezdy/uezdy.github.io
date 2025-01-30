import path from "path";
import fs from "fs";

const aboutTopics: any = {};

const topicsList = fs.readdirSync(path.resolve(`public/`), 'utf8');

topicsList.forEach((groupNickName) => {
    const aboutPath = path.resolve(`public/${groupNickName}/about.json`);
    const aboutJson = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));
    aboutTopics[groupNickName] = {...aboutJson, groupNickName};
});


const pathUezd = path.resolve('public/uezdy');
const pathSrc = path.resolve('public/uezdy/src');

const topics: any = {};
const filesTopics = fs.readdirSync(pathSrc, 'utf8');

const topicsPool = JSON.parse(fs.readFileSync(path.resolve(`${pathUezd}/topics.json`), 'utf8'));

filesTopics.forEach((topicID: string) => {
    if (!topics[topicID]) {
        topics[topicID] = [];
    }
    const pathTopic = path.join(pathSrc, topicID);
    const filesMsgs = fs.readdirSync(pathTopic, 'utf8');
    filesMsgs.forEach((msgsPoolFile: string, index: number) => {
        const mesagesObj = JSON.parse(fs.readFileSync(path.join(pathTopic, msgsPoolFile), 'utf8'));
        if (topicID === '0' && index === 0) {

        }
        topics[topicID].push(Object.values(mesagesObj));
    });
});

export {topicsPool, topics, aboutTopics};
