import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import "./Message.css";
import React from "react";
import Link from "next/link";
import {TextEntity, TGMessage} from "@/app/components/types";

export default async function Message({msg, topicId}: { msg: TGMessage, topicId: number }) {
    return <Typography className="tgme_widget_message_bubble">
        <span>
            <Link href={`https://t.me/uezdy/${topicId}/${msg.id}`}>
                <Chip component="span" size="sm">{msg.id}</Chip>
            </Link>
            <Chip
                variant="outlined"
                color="neutral"
                size="sm"
                component="span"
            >{msg.from || 'Удаленный Аккаунт'}</Chip>
        </span>
        <Divider component="span" />
        <TextJoin text={msg.text}/>
    </Typography>
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
    return <span className="tgme_widget_message_text js-message_text"
                 dangerouslySetInnerHTML={{__html: textString.replace(/\n/g, '<br>')}}/>
};
