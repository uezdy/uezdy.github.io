import Message from "@/app/components/Message";
import {Metadata} from "next";
import {TGMessage} from "@/app/components/types";
import "./topicPage.css";
import {topics, aboutGroups} from "@/app/services/service.data";

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const {uezd, topicId} = await params;
    return {
        icons: {
            icon: `/${uezd}/favicon.ico`,
        }
    };
}


export async function generateStaticParams() {
    const stPropsArr: Array<any> = [];

    Object
        .keys(aboutGroups)
        .forEach((uezd: string) => {
            const topicsList = Object.keys(topics[uezd]);
            topicsList.forEach((topic: any) => {

                Object.keys(topics[uezd][topic]).forEach((page: string) => {
                    // console.log('uezd/topic/page', `${uezd}/${topic}/${page}`);
                    stPropsArr.push({
                        uezd,
                        topicId: `${topic}`,
                        page: `${+page + 1}`
                    })
                });
            });
    });

    return stPropsArr;
}

export default async function Page({params}: any) {

    const {topicId, page, uezd} = await params;
    console.log('topicId, page, uezd', Object.keys(topics[uezd][topicId]), page)
    return (
        <>
            {
                topics[uezd][topicId][+page - 1]
                    .map((msg: TGMessage) => {
                        return msg.text && msg.type === 'message' &&
                            <Message key={msg.id} topicId={topicId} page={page} msg={msg}/>
                    })
            }
        </>

    )
}
