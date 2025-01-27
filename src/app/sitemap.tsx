import {topicsPool} from "@/app/services/service.data";
import {TGMessage} from "@/app/components/types";

export const dynamic = 'force-static';

export default async function sitemap() {
    const nestedURLs: Array<any> = [];
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
                nestedURLs.push({
                    url: `https://uezdy.github.io/uezdy/${topicId}/${index + 1}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 1,
                })
            })
    });

    return [
        {
            url: 'https://uezdy.github.io/',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: 'https://uezdy.github.io/uezdy',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        ...nestedURLs
    ]
}
