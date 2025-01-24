import type { MetadataRoute } from 'next'

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Уезды Беларуси, Генеалогия Беларуси',
        short_name: 'Уезды Беларуси',
        description: 'Группа для общения на тему генеалогии Беларуси. Обмен опытом, поиск совета и помощи. При вступлении рекомендуется назвать ваши искомые уезды, чтобы найти единомышленников по вашим местам.',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
