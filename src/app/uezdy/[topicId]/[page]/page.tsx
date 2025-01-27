import Message from "@/app/components/Message";
import React from "react";
import {TGMessage} from "@/app/components/types";
import SelectedMenu from "@/app/components/SelectedMenu";
import "./topicPage.css";
import {perChunk, topicsPool} from "@/app/services/service.data";

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
        const list = topicsPool[topicId].messages;
        new Array(Math.round(list.length/perChunk))
            .fill(0)
            .forEach((v: any, index: number) => {
                stPropsArr.push({
                    topicId,
                    page: `${index + 1}`
                })
            })
    });
    console.log(stPropsArr);
    return stPropsArr;
}

export default async function Page({params}: any) {

    const {topicId, page} = await params;

    return (
        <>
            <main>
                <SelectedMenu topicsPool={topicsPool} topicId={topicId}/>
                {
                    topicsPool[topicId]
                        .messages[page]
                        .map((msg: TGMessage) => {
                            return msg.text && msg.type === 'message' &&
                                <Message topicId={topicId} key={msg.id} msg={msg}/>
                        })
                }
            </main>

        </>

    )
}
