import "./Message.css";
import React from "react";
import Link from "next/link";
import {TextEntity, TGMessage} from "@/app/components/types";
import OriginalModal from "@/app/components/OriginalModal";

export default async function Message({uezd, msg, topicId, replyMessage}: { uezd: string, msg: TGMessage, topicId: number, replyMessage: TGMessage }) {
    const date = new Date(msg.date as string);
    const year = new Intl.DateTimeFormat('ru', {year: 'numeric'}).format(date);
    const month = new Intl.DateTimeFormat('ru', {month: 'short'}).format(date);
    const day = new Intl.DateTimeFormat('ru', {day: '2-digit'}).format(date);
    const timeShort = new Intl.DateTimeFormat('ru', {hour: '2-digit', minute: '2-digit'}).format(date);
    const telegramHref = `https://t.me/${uezd}${+topicId ? `/${topicId}` : ''}/${msg.id}`;

    return (
        <article className="message-card" id={String(msg.id)}>
            <div className="message-bubble">
                {replyMessage ? (
                    <a href={`#${msg.reply_to_message_id}`} className="message-reply-quote">
                        <span className="message-reply-quote__label">Ответ</span>
                        <span className="message-reply-quote__author">{replyMessage.from || 'Удалённый аккаунт'}</span>
                        <span className="message-reply-quote__text">{plainPreview(replyMessage.text)}</span>
                    </a>
                ) : null}
                <header className="message-meta">
                    <Link
                        target="_blank"
                        href={telegramHref}
                        className="message-meta__id"
                        title="Открыть в Telegram"
                    >
                        #{msg.id}
                    </Link>
                    <span className={`message-meta__author ${msg.from_id || ''}`}>{msg.from || 'Удалённый аккаунт'}</span>
                    <time dateTime={msg.date} className="message-meta__time" title={`${day} ${month} ${year}`}>
                        {timeShort}
                    </time>
                    <span className="message-meta__open" title="Оригинал в Telegram">
                        <OriginalModal>
                            <iframe id="telegram-post" src={`https://t.me/${uezd}/${msg.id}?embed=1`}/>
                        </OriginalModal>
                    </span>
                </header>
                <div className="message-body">
                    <TextJoin text={msg.text} tag="p"/>
                </div>
            </div>
        </article>
    );
}

function plainPreview(text: unknown): string {
    if (text == null) {
        return '';
    }
    if (typeof text === 'string') {
        return text;
    }
    if (!Array.isArray(text)) {
        return '';
    }
    let s = '';
    for (const part of text) {
        if (typeof part === 'string') {
            s += part;
        } else if (part && typeof part === 'object' && 'text' in part && typeof (part as TextEntity).text === 'string') {
            s += (part as TextEntity).text;
        }
    }
    return s.replace(/\s+/g, ' ').trim();
}

const TextJoin = ({text, tag, className}: { text: any; tag?: string; className?: string }) => {
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
    const innerHtml = {__html: textString};
    const baseClass = ['message-text', className].filter(Boolean).join(' ');
    if (tag === 'p') {
        return <p className={baseClass} dangerouslySetInnerHTML={innerHtml}/>
    }
    return <div className={baseClass} dangerouslySetInnerHTML={innerHtml}/>;
};
