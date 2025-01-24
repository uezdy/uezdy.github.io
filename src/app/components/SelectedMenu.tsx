'use client'

import React from 'react';
import MenuButton from '@mui/joy/MenuButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import Apps from '@mui/icons-material/Apps';
import Dropdown from '@mui/joy/Dropdown';
import {TGMessage} from "@/app/components/types";
import { useRouter } from 'next/navigation';

export default function SelectedMenu({messages, paramsId}: {messages: Array<TGMessage>, paramsId: number}) {
    const [selectedIndex, setSelectedIndex] = React.useState<number>(+paramsId);
    const router = useRouter();

    const [tops, setTops] = React.useState<Array<TGMessage>>([]);
    React.useEffect(() => {
        if (paramsId) {setSelectedIndex(+paramsId);}
    }, [paramsId]);

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


    const createHandleClose = (id: any, e: any) => () => {
        e.preventDefault();
        setSelectedIndex(id);
        router.push(`/uezdy/topic/${id}`);
        debugger;
    };

    return (
        <Dropdown>
            <MenuButton startDecorator={<Apps />}>Topics</MenuButton>
            <Menu>
                {
                    tops.map((top: TGMessage) => {
                        return <MenuItem key={top.id} selected={selectedIndex === +top.id} onClick={(e: any) => createHandleClose(+top.id, e)}>
                            {top.title}
                        </MenuItem>
                    })
                }
            </Menu>
        </Dropdown>
    );
}
