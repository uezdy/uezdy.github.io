import Message from "@/app/components/Message";
import React from "react";
import {TGMessage} from "@/app/components/types";
import "./topicPage.css";
import {topicsPool} from "@/app/services/service.data";

export async function generateStaticParams() {
    const stPropsArr: Array<any> = [];
    const ids: Array<any> = [];

    for (const topicsPoolKey in topicsPool) {
        const msg: TGMessage = topicsPool[topicsPoolKey];
        ids.push({
            topicId: `${msg.id}`,
            page: `${1}`
        });
    }

    ids.forEach(({topicId}: any) => {
        const pagesArr = topicsPool[topicId].messages;
        new Array(pagesArr.length)
            .fill(0)
            .forEach((v: any, index: number) => {
                stPropsArr.push({
                    topicId,
                    page: `${index + 1}`
                })
            })
    });
    return stPropsArr;
}

export default async function Page({params}: any) {

    const {topicId, page} = await params;

    return (
        <>
            {
                topicsPool[topicId]
                    .messages[page - 1]
                    .map((msg: TGMessage) => {
                        return msg.text && msg.type === 'message' &&
                            <Message key={msg.id} topicId={topicId} page={page} msg={msg}/>
                    })
            }
        </>

    )
}
