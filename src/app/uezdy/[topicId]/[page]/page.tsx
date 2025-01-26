import Message from "@/app/components/Message";
import React from "react";
import {TGMessage} from "@/app/components/types";
import SelectedMenu from "@/app/components/SelectedMenu";
import "./topicPage.css";
import {messages} from "@/app/services/service.data";

export async function generateStaticParams() {
    const stPropsArr = [];
    const ids = messages
        .filter((msg: TGMessage) => msg.action === 'topic_created')
        .map((msg: TGMessage) => ({
            topicId: `${msg.id}`,
            page: `${1}`
        }));

    ids.forEach(({topicId}: any) => {
        const list = messages.filter((msg: TGMessage) => msg && msg.reply_to_message_id && (+msg!.reply_to_message_id === +topicId));
        new Array(Math.round(list.length/1000))
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
    const sta = +page === 1 ? 0 : (+page - 1) * 1000;
    const end = +page * 1000;

    return (
        <>
            <main>
                <SelectedMenu messages={messages} topicId={topicId}/>
                {
                    messages
                        .filter((msg: TGMessage) => msg && msg.reply_to_message_id && (+msg!.reply_to_message_id === +topicId))
                        .slice(sta, end)
                        .map((msg: TGMessage) => {
                            return msg.text && msg.type === 'message' &&
                                <Message topicId={topicId} key={msg.id} msg={msg}/>
                        })
                }
            </main>

        </>

    )
}
