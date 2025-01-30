import Message from "@/app/components/Message";
import React from "react";
import {TGMessage} from "@/app/components/types";
import "./topicPage.css";
import {topicsPool, topics} from "@/app/services/service.data";

export async function generateStaticParams() {
    const stPropsArr: Array<any> = [];
    const ids: Array<any> = Object.values(topicsPool);

    ids.forEach(({id}: any) => {

        const pagesArr = Object.keys(topics[id]);
        pagesArr
            .forEach((v: any, index: number) => {
                stPropsArr.push({
                    topicId: `${id}`,
                    page: `${index + 1}`,
                    uezd: 'uezdy'
                })
            })
    });
    return stPropsArr;
}

export default async function Page({params}: any) {

    const {topicId, page, uezd} = await params;

    return (
        <>
            {
                topics[topicId][page - 1]
                    .map((msg: TGMessage) => {
                        return msg.text && msg.type === 'message' &&
                            <Message key={msg.id} topicId={topicId} page={page} msg={msg}/>
                    })
            }
        </>

    )
}
