import Message from "@/app/components/Message";
import React from "react";
import path from "path";
import {promises as fs} from "fs";
import {List} from "@mui/joy";
import {TGMessage} from "@/app/components/types";

const pathJSON = path.join('public/result.json');
const file = await fs.readFile(pathJSON, 'utf8');
const data = JSON.parse(file);

export async function generateMetadata({params}: any) {
    const { id: paramsId } = await params;
    const currtopMsg = data.messages.find((msg: TGMessage) => +msg.id === +paramsId);
    return {
        title: currtopMsg.title
    };
}

export async function generateStaticParams() {
    const ids = data
        .messages
        .filter((msg: any) => msg.action === 'topic_created');

    return ids.map((msg: TGMessage) => ({
        id: `${msg.id}`,
    }));
}
export default async function Page({params}: any) {
    const { id: paramsId } = await params;

    return (
        <>
            {paramsId}
            <List>
                {
                    data
                        .messages
                        .filter((msg: TGMessage) => msg && msg.reply_to_message_id && (+msg!.reply_to_message_id === +paramsId))
                        .map((msg: TGMessage) => {
                            return msg.text && msg.type === 'message' ? <Message key={msg.id} msg={msg}/> : <></>
                        })
                }
            </List>

        </>

    )
}
