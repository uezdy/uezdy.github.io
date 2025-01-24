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
        id: `${msg.id}`,
    }));
}

export default async function Page({params}: any) {
    const { id: paramsId } = await params;

    return (
        <>
            <main>
                <SelectedMenu messages={messages} paramsId={paramsId} />
                {
                    messages
                        .filter((msg: TGMessage) => msg && msg.reply_to_message_id && (+msg!.reply_to_message_id === +paramsId))
                        .map((msg: TGMessage) => {
                            return msg.text && msg.type === 'message' && <Message topicId={paramsId} key={msg.id} msg={msg} />
                        })
                }
            </main>

        </>

    )
}
