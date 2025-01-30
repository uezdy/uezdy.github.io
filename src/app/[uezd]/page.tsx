import {Metadata} from "next";
import React from "react";
import TopicsMenu from "@/app/components/TopicsMenu";
import {topics, topicsPool, aboutGroups} from "@/app/services/service.data";

export const metadata: Metadata = {
    title: "Уезды Беларуси (Генеалогия Беларуси)",
    description: `Группа для общения на тему генеалогии Беларуси. Обмен опытом, поиск совета и помощи. При вступлении рекомендуется назвать ваши искомые уезды, чтобы найти единомышленников по вашим местам.`,
};

export async function generateStaticParams() {
    return Object
        .keys(aboutGroups)
        .map((uezd: string) => ({uezd}));
}

export default async function Home({params}: any) {
    const {uezd} = await params;
    console.log('@uezdy', uezd)
    return <>
        {uezd}
        <TopicsMenu topicsPool={topicsPool} />
    </>;
}
