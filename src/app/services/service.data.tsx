import path from "path";
import fs from "fs";

const topics: any = {};
const aboutGroups: any = {};
const topicsPool: any = {};

const topicsList = fs.readdirSync(path.resolve(`public/`), 'utf8');

topicsList.forEach((groupNickName) => {
    if (!topics[groupNickName]) {
        topics[groupNickName] = {};
    }
    const aboutPath = path.resolve(`public/${groupNickName}/about.json`);
    const aboutJson = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));
    aboutGroups[groupNickName] = {...aboutJson, groupNickName};

    topicsPool[groupNickName] = JSON.parse(
        fs.readFileSync(
            path.resolve(`public/${groupNickName}/topics.json`), 'utf8')
    );

    const pathSrc = path.resolve(`public/${groupNickName}/src`);
    const filesTopics = fs.readdirSync(pathSrc, 'utf8');

    filesTopics.forEach((topicID: string) => {
        if (!topics[groupNickName][topicID]) {
            topics[groupNickName][topicID] = [];
        }
        const pathTopic = path.join(pathSrc, topicID);
        const filesMsgs = fs.readdirSync(pathTopic, 'utf8');
        topics[groupNickName][topicID].push(...filesMsgs);
    });
});

export {topicsPool, topics, aboutGroups};
