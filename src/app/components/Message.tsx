import Chip from '@mui/joy/Chip';
import "./Message.css";
import React from "react";
import Link from "next/link";
import {TextEntity, TGMessage} from "@/app/components/types";

export default async function Message({msg, topicId}: { msg: TGMessage, topicId: number }) {
    return <>
        <span className="message-top">
            <span>
                <Link href={`https://t.me/uezdy/${topicId}/${msg.id}`}>
                    <Chip size="sm">{msg.id}</Chip>
                </Link>
                <Chip
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >{msg.from || 'Удаленный Аккаунт'}</Chip>
            </span>
            <Chip size="sm">
                <Link href={`/uezdy/topic/${topicId}/${msg.id}`}>##</Link>
            </Chip>
        </span>
        <TextJoin text={msg.text}/>
    </>
};

const TextJoin = ({text}: any) => {
    let textString = '';
    if (Array.isArray(text)) {
        text.map((textEntity: TextEntity | string) => {
            if (typeof textEntity === 'string') {
                textString += textEntity;
            } else {
                if (textEntity.type === 'link') {
                    textString += `<a target="_blank" href="${textEntity.text}">${textEntity.text}</a>`
                }
                if (textEntity.type === 'text_link') {
                    textString += `<a target="_blank" href="${textEntity.href}">${textEntity.text}</a>`
                }
                if (textEntity.type === 'bold') {
                    textString += `<b>${textEntity.text}</b>`;
                }
                if (textEntity.type === 'underline') {
                    textString += `<u>${textEntity.text}</u>`;
                }
                if (textEntity.type === 'plain') {
                    textString += textEntity.text;
                }
            }
        })
    } else {
        textString = text;
    }
    return <p className="tgme_widget_message_bubble tgme_widget_message_text js-message_text"
                 dangerouslySetInnerHTML={{__html: textString.replace(/\n/g, '<br>')}}/>
};
