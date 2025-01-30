import {aboutGroups, topics} from "@/app/services/service.data";
import {SiteMapItem} from "@/app/components/types";

export const dynamic = 'force-static';


export default async function sitemap() {
    const nestedURLs: Array<SiteMapItem> = [];
    Object
        .keys(aboutGroups)
        .forEach((uezd: string) => {
            const topicsList = Object.keys(topics[uezd]);
            topicsList.forEach((topic: string) => {

                Object.keys(topics[uezd][topic]).forEach((page: string) => {
                    nestedURLs.push({
                        url: `https://uezdy.github.io/${uezd}/${topic}/${+page + 1}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 1,
                    })
                });
            });
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
