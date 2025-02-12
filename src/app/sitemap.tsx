import {aboutGroups, topics} from "@/app/services/service.data";
import {SiteMapItem} from "@/app/components/types";

export const dynamic = 'force-static';


export default async function sitemap() {
    const nestedURLs: Array<SiteMapItem> = [
        {
            url: `https://uezdy.github.io/1519967596/0/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/1847780795/0/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/Bychowski_uezd/0/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/borisov_uezd/1187/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/familio_belarus/0/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/lepelskiy/107/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/mogilevskiy_uezd/69/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/orsha_uezd/59/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/polotskiy_uezd/0/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/sennenskiy/725/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/uezdy/24122/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `https://uezdy.github.io/uezdy/24109/1`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
    ];
    Object
        .keys(aboutGroups)
        .forEach((uezd: string) => {
            const topicsList = Object.keys(topics[uezd]);
            topicsList.forEach((topic: string) => {

                Object.keys(topics[uezd][topic]).forEach((page: string) => {
/*
                    nestedURLs.push({
                        url: `https://uezdy.github.io/${uezd}/${topic}/${+page + 1}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 1,
                    })
*/
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
        ...nestedURLs
    ]
}
