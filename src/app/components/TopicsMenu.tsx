'use client'
import React from "react";
import {ButtonGroup} from "@mui/joy";
import Link from 'next/link'

export default function TopicsMenu({messages}: any) {
    const [tops, setTops] = React.useState([]);
    React.useEffect(() => {
        if (messages) {
            const topics: any = [];
            messages.forEach((msg: any) => {
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
                tops.map((top: any) => <Link key={top.id} href={`/topic/${top.id}`}>{top.title}</Link>)
            }
        </ButtonGroup>

    </>
};
