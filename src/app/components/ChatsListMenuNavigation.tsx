'use client'

import Image from 'next/image';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useRouter } from 'next/navigation';
import {AboutItem} from "@/app/components/types";

export default function ChatsListMenuNavigation({aboutGroups, uezd}: any) {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(uezd);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event: React.MouseEvent<HTMLElement>, group: AboutItem | null) => {
        setAnchorEl(null);
        if (group) {
            const href = group.noTopics ? `/${group.groupNickName}/0/1` : `/${group.groupNickName}`;
            setSelectedIndex(group.groupNickName);
            router.push(href);
        }
    };

    return (
        <>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                className="chats-list-menu-navigation-trigger-button"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                className="chats-list-menu-navigation"
                onClose={(e: React.MouseEvent<HTMLElement>) => handleClose(e, null)}
            >
                {Object.values(aboutGroups).map((group: AboutItem | any) => {

                    return (
                        <MenuItem key={group.groupNickName} className={`group-list-item ${group.groupNickName}`} selected={group.groupNickName === selectedIndex}
                                  onClick={(e: React.MouseEvent<HTMLElement>) => handleClose(e, group)}>
                            <Image className="icon" width={15} height={15} src={`/${group.groupNickName}/favicon.ico`} alt={group.title}/>
                            <span>{group.title}</span>
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    );
}
