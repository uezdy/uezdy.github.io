import path from "path";
import fs from "fs";

const aboutGroups: any = {};
const topicsPool: any = {};

const topicsList = fs.readdirSync(path.resolve(`public/`), 'utf8');

topicsList.forEach((groupNickName) => {
    const aboutPath = path.resolve(`public/${groupNickName}/about.json`);
    const aboutJson = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));
    aboutGroups[groupNickName] = {...aboutJson, groupNickName};

    topicsPool[groupNickName] = JSON.parse(fs.readFileSync(path.resolve(`public/${groupNickName}/topics.json`), 'utf8'));
});

const pathUezd = path.resolve('public/uezdy');
const pathSrc = path.resolve('public/uezdy/src');

const topics: any = {};
const filesTopics = fs.readdirSync(pathSrc, 'utf8');


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

export {topicsPool, topics, aboutGroups};
