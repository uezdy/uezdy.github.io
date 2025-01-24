import {messages} from "@/app/services/service.data";
import {TGMessage} from "@/app/components/types";

export const dynamic = 'force-static';

export default async function sitemap() {
    const nestedURLs = messages
        .filter((msg: TGMessage) => msg.action === 'topic_created')
        .map((msg: TGMessage) => ({
            url: `https://uezdy.github.io/uezdy/${msg.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        }));

    return [
        {
            url: 'https://uezdy.github.io/',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://uezdy.github.io/uezdy',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://uezdy.github.io/uezdy',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        ...nestedURLs
    ]
}
