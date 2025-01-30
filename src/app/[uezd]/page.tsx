import {Metadata} from "next";
import React from "react";
import TopicsMenu from "@/app/components/TopicsMenu";
import {topicsPool, aboutGroups} from "@/app/services/service.data";

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const {uezd} = await params;
    const f = {
        icons: {
            icon: `/${uezd}/favicon.ico`,
        }
    };
    return {...aboutGroups[uezd], ...f};
}

export async function generateStaticParams() {
    return Object
        .keys(aboutGroups)
        .map((uezd: string) => ({uezd}));
}

export default async function Home({params}: any) {
    const {uezd} = await params;

    return <>
        <TopicsMenu topicsPool={topicsPool[uezd]} />
    </>;
}
