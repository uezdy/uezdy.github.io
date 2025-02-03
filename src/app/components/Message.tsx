import "./Message.css";
import React from "react";
import Link from "next/link";
import Button from '@mui/material/Button';
import {TextEntity, TGMessage} from "@/app/components/types";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import OriginalModal from "@/app/components/OriginalModal";

export default async function Message({uezd, msg, topicId, replyMessage}: { uezd: string, msg: TGMessage, topicId: number, replyMessage: TGMessage }) {
    let date = new Date(msg.date as any);
    let year = new Intl.DateTimeFormat('ru', { year: 'numeric' }).format(date);
    let month = new Intl.DateTimeFormat('ru', { month: 'short' }).format(date);
    let day = new Intl.DateTimeFormat('ru', { day: '2-digit' }).format(date);
    const id: any = {id: msg.id} as any;

    return <>
        <Card sx={{minWidth: 275}} className="message-card" raised={true}>
            <>
                {
                    replyMessage ? <>
                        <Link href={`#${msg.reply_to_message_id}`} className="reply-to-message-id">
                            <div>Ответ на сообщение: {replyMessage.from}</div>
                            <TextJoin className="truncate-long-text"  text={replyMessage.text} />
                        </Link>
                    </> : <></>
                }
            </>
            <CardContent {...id}>
                <span className="message-top">
                    <span>
                        <Button size="small" aria-label="Информация по сообщению">
                            <Link target="_blank" href={`https://t.me/${uezd}${+topicId ? `/${topicId}` : ''}/${msg.id}`}
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
                            <OriginalModal>
                                <iframe id="telegram-post" src={`https://t.me/${uezd}/${msg.id}?embed=1`}></iframe>
                            </OriginalModal>
                        </Button>
                    </span>
                </span>
                <TextJoin text={msg.text} tag="p" />
            </CardContent>
        </Card>
    </>
};

const TextJoin = ({text, tag, className}: any) => {
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
                if (textEntity.type === 'mention_name') {
                    textString += `<a target="_blank" data-user-id="${textEntity.user_id}" href="${`https://t.me/${textEntity.user_id}`}">${textEntity.text}</a>`
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
                if (textEntity.type === 'pre') {
                    textString += `<code>${textEntity.text}</code>`;
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
    const innerHtml = {__html: textString.replace(/\n/g, '<br>')};
    if (tag === 'p') {
        return <p className={className} dangerouslySetInnerHTML={innerHtml}/>
    } else {
        return <div className={className} dangerouslySetInnerHTML={innerHtml}/>
    }
};
