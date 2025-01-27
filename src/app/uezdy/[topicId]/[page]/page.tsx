import Message from "@/app/components/Message";
import React from "react";
import {TGMessage} from "@/app/components/types";
import SelectedMenu from "@/app/components/SelectedMenu";
import "./topicPage.css";
import {topicsPool} from "@/app/services/service.data";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Link from "next/link";

export async function generateStaticParams() {
    const stPropsArr: Array<any> = [];
    const ids: Array<any> = [];

    for (const topicsPoolKey in topicsPool) {
        const msg: TGMessage = topicsPool[topicsPoolKey];
        ids.push({
            topicId: `${msg.id}`,
            page: `${1}`
        });
    }

    ids.forEach(({topicId}: any) => {
        const pagesArr = topicsPool[topicId].messages;
        new Array(pagesArr.length)
            .fill(0)
            .forEach((v: any, index: number) => {
                stPropsArr.push({
                    topicId,
                    page: `${index + 1}`
                })
            })
    });
    return stPropsArr;
}

export default async function Page({params}: any) {

    const {topicId, page} = await params;
    const pagesCount = topicsPool[topicId].messages.length - 1;
    return (
        <>
            <main>
                <nav className="top-navigation-bar">
                    <SelectedMenu topicsPool={topicsPool} topicId={topicId}/>
                    <ButtonGroup className="pagination" variant="outlined" size="small" aria-label="Basic button group">
                        {
                            new Array(pagesCount)
                                .fill(0)
                                .map((v: number, index: number) => {
                                    return <Button key={index} disabled={+page === (index + 1)}><Link href={`/uezdy/${topicId}/${index + 1}`}>{index + 1}</Link></Button>
                                })
                        }
                    </ButtonGroup>
                </nav>
                {
                    topicsPool[topicId]
                        .messages[page - 1]
                        .map((msg: TGMessage) => {
                            return msg.text && msg.type === 'message' &&
                                <Message topicId={topicId} key={msg.id} msg={msg}/>
                        })
                }
            </main>

        </>

    )
}
