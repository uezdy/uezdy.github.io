'use client'

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
    const handleClose = (event: React.MouseEvent<HTMLElement>, option: AboutItem | null) => {
        setAnchorEl(null);
        if (option) {
            setSelectedIndex(option.groupNickName);
            router.push(`/${option.groupNickName}`);
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
                {Object.values(aboutGroups).map((option: AboutItem | any) => (
                    <MenuItem key={option.groupNickName} className={option.groupNickName} selected={option.groupNickName === selectedIndex}
                              onClick={(e: React.MouseEvent<HTMLElement>) => handleClose(e, option)}>
                        {option.title}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
