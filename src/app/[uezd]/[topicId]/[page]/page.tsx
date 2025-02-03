import path from "path";
import fs from "fs";

import Message from "@/app/components/Message";
import {Metadata} from "next";
import {TGMessage} from "@/app/components/types";
import "./topicPage.css";
import {topics, aboutGroups, topicsPool} from "@/app/services/service.data";

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const {uezd, topicId} = await params;
    return {
        title: topicsPool[uezd][topicId].title,
        description: topicsPool[uezd][topicId].description,
        icons: {
            icon: `/${uezd}/favicon.ico`,
        }
    };
}


export async function generateStaticParams() {
    const stPropsArr: Array<any> = [];

    Object
        .keys(aboutGroups)
        .forEach((uezd: string) => {
            const topicsList = Object.keys(topics[uezd]);
            topicsList.forEach((topic: any) => {

                Object.keys(topics[uezd][topic]).forEach((page: string) => {
                    stPropsArr.push({
                        uezd,
                        topicId: `${topic}`,
                        page: `${+page + 1}`
                    })
                });
            });
    });

    return stPropsArr;
}

export default async function Page({params}: any) {

    const {topicId, page, uezd} = await params;
    const pagePath = path.resolve(`public/${uezd}/src/${topicId}/0${page - 1}.json`);
    const pageJson = JSON.parse(fs.readFileSync(pagePath, 'utf8'));
    const replyPool: any = {};
    pageJson.forEach((currentValue: TGMessage) => {
        replyPool[+currentValue.id] = currentValue;
    }, {});
    return (
        <>
            {
                pageJson
                    .map((msg: TGMessage | any) => {
                        const replyMessage = msg.reply_to_message_id ? replyPool[+msg.reply_to_message_id] : null;

                        return msg.text && msg.type === 'message' &&
                            <Message key={msg.id} uezd={uezd} topicId={topicId} page={page} msg={msg} replyMessage={replyMessage}/>
                    })
            }
        </>

    )
}
