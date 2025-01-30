'use client'

import React from 'react';
import MenuButton from '@mui/joy/MenuButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import Apps from '@mui/icons-material/Apps';
import Dropdown from '@mui/joy/Dropdown';
import {TGMessage} from "@/app/components/types";
import { useRouter } from 'next/navigation';

export default function SelectedMenu({topicsPool, topicId, uezd}: {topicsPool: any, topicId: number, uezd: string}) {
    const [selectedIndex, setSelectedIndex] = React.useState<number>(+topicId);
    const router = useRouter();

    const [tops, setTops] = React.useState<Array<TGMessage>>([]);
    React.useEffect(() => {
        if (topicId) {setSelectedIndex(+topicId);}
    }, [topicId]);

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


    const handleClose = (e: any, id: any) => {
        e.preventDefault();
        setSelectedIndex(id);
        router.push(`/${uezd}/${id}/1`);
    };

    return (
        <Dropdown>
            <MenuButton startDecorator={<Apps />}>Topics</MenuButton>
            <Menu>
                {
                    tops.map((top: TGMessage) => {
                        return <MenuItem key={top.id} selected={selectedIndex === +top.id} onClick={(e: any) => handleClose(e, +top.id)}>
                            {top.title}
                        </MenuItem>
                    })
                }
            </Menu>
        </Dropdown>
    );
}
