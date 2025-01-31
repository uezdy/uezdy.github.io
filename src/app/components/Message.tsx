import "./Message.css";
import React from "react";
import Link from "next/link";
import Button from '@mui/material/Button';
import {TextEntity, TGMessage} from "@/app/components/types";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default async function Message({msg, topicId, page}: { msg: TGMessage, topicId: number, page: number }) {
    let date = new Date(msg.date as any);
    let year = new Intl.DateTimeFormat('ru', { year: 'numeric' }).format(date);
    let month = new Intl.DateTimeFormat('ru', { month: 'short' }).format(date);
    let day = new Intl.DateTimeFormat('ru', { day: '2-digit' }).format(date);

    return <>
        <Card sx={{minWidth: 275}} className="message-card">
            <CardContent>
                <span className="message-top">
                    <span>
                        <Button size="small" aria-label="Информация по сообщению">
                            <Link target="_blank" href={`https://t.me/uezdy${+topicId ? `/${topicId}` : ''}/${msg.id}`}
                                  title="Открыть оригинальную запись в телеграм группе">
                                {msg.id}
                            </Link>
                        </Button>
                        <Button size="small" aria-label="Автор сообщения" className={msg.from_id}>
                            {msg.from || 'Удаленный Аккаунт'}
                        </Button>
                    </span>
                    <span>
                        <span aria-label="Date of message" className="date-of-message">{`${day} ${month} ${year}`}</span>
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
                if (textEntity.type === 'mention') {
                    textString += `<a target="_blank" href="${`https://t.me/${textEntity.text.replace('@', '')}`}">${textEntity.text}</a>`
                }
                if (textEntity.type === 'text_link') {
                    textString += `<a target="_blank" href="${textEntity.href}">${textEntity.text}</a>`
                }
                if (textEntity.type === 'hashtag') {
                    textString += `<a href="${textEntity.text}"><b>${textEntity.text}</b></a>`
                }
                if (textEntity.type === 'bold') {
                    textString += `<b>${textEntity.text}</b>`;
                }
                if (textEntity.type === 'underline') {
                    textString += `<u>${textEntity.text}</u>`;
                }
                if (textEntity.type === 'italic') {
                    textString += `<i>${textEntity.text}</i>`;
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
