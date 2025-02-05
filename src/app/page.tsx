import {Metadata} from "next";
import React from "react";
import {aboutGroups} from "@/app/services/service.data";
import GroupsList from "@/app/components/GroupsList";

export const metadata: Metadata = {
    title: 'Телеграм группы по генеалогии Беларуси',
    description: 'Телеграм группы по генеалогии Беларуси',
    icons: [
        {
            url: '/favicon.svg',
            type: 'image/svg+xml',
            sizes: 'any',
            rel: 'icon'
        }
    ],
    keywords: ['Беларусь', 'генеалогия', 'поиск', 'губерния', 'уезд'],
    referrer: 'origin',
    robots: { index: true, follow: true }
};

export default async function Home() {

    return <>
        <header>
            <h1>Список телеграм групп по генеалогии Беларуси</h1>
        </header>
        <GroupsList groupsList={Object.values(aboutGroups)} />
    </>;
}
