'use client'
import React from "react";
import Link from 'next/link'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CommentIcon from '@mui/icons-material/Comment';

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
    return <nav>
        <List orientation="vertical">
            {
                tops.map((top: any) => <ListItem key={top.id}>
                    <CommentIcon className="comment-icon"/>
                    <Link className="topic-list-item" href={`/uezdy/${top.id}/1`}>
                        {top.title}
                    </Link>
                </ListItem>)
            }
        </List>

    </nav>
};
