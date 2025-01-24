'use client'
import React from "react";
import {ButtonGroup} from "@mui/joy";
import Link from 'next/link'
import {TGMessage} from "@/app/components/types";

export default function TopicsMenu({messages}: { messages: Array<TGMessage> }) {
    const [tops, setTops] = React.useState<Array<TGMessage>>([]);
    React.useEffect(() => {
        if (messages) {
            const topics: any = [];
            messages.forEach((msg: TGMessage) => {
                if (msg.action === 'topic_created') {
                    topics.push(msg);
                }
            });

            setTops(topics);
        }
    }, [messages]);
    return <>
        <ButtonGroup orientation="vertical">
            {
                tops.map((top: TGMessage) => <Link key={top.id} href={`/uezdy/topic/${top.id}`}>{top.title}</Link>)
            }
        </ButtonGroup>

    </>
};
