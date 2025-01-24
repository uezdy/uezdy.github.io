import Message from "@/app/components/Message";
import React from "react";
import {TGMessage} from "@/app/components/types";
import SelectedMenu from "@/app/components/SelectedMenu";
import "./topicPage.css";
import {messages} from "@/app/services/service.data";

export async function generateStaticParams() {
    const ids = messages
        .filter((msg: any) => msg.action === 'topic_created');

    return ids.map((msg: TGMessage) => ({
        topicId: `${msg.id}`,
    }));
}

export default async function Page({params}: any) {
    const { topicId } = await params;

    return (
        <>
            <main>
                <SelectedMenu messages={messages} paramsId={topicId} />
                {
                    messages
                        .filter((msg: TGMessage) => msg && msg.reply_to_message_id && (+msg!.reply_to_message_id === +topicId))
                        .map((msg: TGMessage) => {
                            return msg.text && msg.type === 'message' && <Message topicId={topicId} key={msg.id} msg={msg} />
                        })
                }
            </main>

        </>

    )
}
