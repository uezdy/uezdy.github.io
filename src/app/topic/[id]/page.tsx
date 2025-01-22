import Message from "@/app/components/Message";
import React from "react";
import path from "path";
import {promises as fs} from "fs";
import {List} from "@mui/joy";

const pathJSON = path.join('public/result.json');
const file = await fs.readFile(pathJSON, 'utf8');
const data = JSON.parse(file);

export async function generateMetadata({ params }: any): Promise<any> {
    const currtopMsg = data.messages.find((msg: any) => +msg.id === +params.id);
    return {
        title: currtopMsg.title
    };
}

export default function Page({params}: any) {
    return (
        <>
            {params.id}
            <List>
                {
                    data
                        .messages
                        .filter((msg: any) => +msg.reply_to_message_id === +params.id)
                        .map((msg: any) => {
                            return msg.text && msg.type === 'message' ? <Message key={msg.id} msg={msg}/> : <></>
                        })
                }
            </List>

        </>

    )
}

export function generateStaticParams({params}: any) {
    return [ { id: params.id } ]
}
