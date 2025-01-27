'use client'
import React from "react";
import {ButtonGroup} from "@mui/joy";
import Link from 'next/link'

export default function TopicsMenu({topicsPool}: any) {
    const [tops, setTops] = React.useState<any>([]);
    React.useEffect(() => {
        if (topicsPool) {
            const topics: any = [];

            for (const topicsPoolKey in topicsPool) {
                const msg: any = topicsPool[topicsPoolKey];
                topics.push({
                    id: msg.id,
                    title: msg.title
                });
            }

            setTops(topics);
        }
    }, [topicsPool]);
    return <>
        <ButtonGroup orientation="vertical">
            {
                tops.map((top: any) => <Link key={top.id} href={`/uezdy/${top.id}/1`}>{top.title}</Link>)
            }
        </ButtonGroup>

    </>
};
