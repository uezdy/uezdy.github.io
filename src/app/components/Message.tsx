import {List, ListItem} from "@mui/joy";
import React from "react";
import Link from "next/link";

export default async function Message({msg}: any) {
    return <>
        <ListItem variant="outlined">
            <Link href={`https://t.me/sennenskiy/${msg.id}`}>origin</Link>
            {
                Array.isArray(msg.text) ? '' : msg.text
            }
        </ListItem>
    </>
};
