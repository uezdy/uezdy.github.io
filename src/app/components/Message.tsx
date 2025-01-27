import "./Message.css";
import React from "react";
import Link from "next/link";
import Button from '@mui/material/Button';
import {TextEntity, TGMessage} from "@/app/components/types";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default async function Message({msg, topicId, page}: { msg: TGMessage, topicId: number, page: number }) {
    return <>
        <Card sx={{minWidth: 275}}>
            <CardContent>
                <span className="message-top">
                    <span>
                        <Button size="small" aria-label="Информация по сообщению">
                            <Link target="_blank" href={`https://t.me/uezdy/${topicId}/${msg.id}`}
                                  title="Открыть оригинальную запись в телеграм группе">
                                {msg.id}
                            </Link>
                        </Button>
                        <Button size="small" aria-label="Информация по сообщению">
                            {msg.from || 'Удаленный Аккаунт'}
                        </Button>
                    </span>
                    <span>
                        <Button size="small" aria-label="Информация по сообщению">
                            <Link href={`/uezdy/${topicId}/${page}/${msg.id}`}>##</Link>
                        </Button>
                    </span>
                </span>
                <TextJoin text={msg.text}/>
            </CardContent>
        </Card>
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
