import {topics, topicsPool} from "@/app/services/service.data";
import {TGMessage} from "@/app/components/types";

export const dynamic = 'force-static';

export default async function sitemap() {
    const nestedURLs: Array<any> = [];
    const ids: Array<any> = Object.values(topicsPool);

    ids.forEach(({id}: any) => {

        const pagesArr = Object.keys(topics[id]);
        pagesArr
            .forEach((v: any, index: number) => {
                nestedURLs.push({
                    url: `https://uezdy.github.io/uezdy/${id}/${index + 1}`,
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
