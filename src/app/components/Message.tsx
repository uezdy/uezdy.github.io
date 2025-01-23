import {List, ListItem} from "@mui/joy";
import React from "react";
import Link from "next/link";
import {TGMessage} from "@/app/components/types";

export default async function Message({msg}: {msg: TGMessage}) {
    return <>
        <ListItem variant="outlined">
            <Link href={`https://t.me/uezdy/${msg.id}`}>origin</Link>
            {
                Array.isArray(msg.text) ? '' : msg.text
            }
        </ListItem>
    </>
};
