'use client'
import React from "react";
import {Button, ButtonGroup} from "@mui/joy";

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
                tops.map((top: any) => <Button key={top.id}>{top.title}</Button>)
            }
        </ButtonGroup>

    </>
};
