export interface TGMessage {
    id: number
    type: string
    date: string
    date_unixtime: string
    from?: string
    from_id?: string
    reply_to_message_id?: number
    text: any
    text_entities: TextEntity[]
    edited?: string
    edited_unixtime?: string
    reactions?: Reaction[]
    actor?: string
    actor_id?: string
    action?: string
    members?: string[]
    forwarded_from?: string
    photo?: string
    width?: number
    height?: number
    file?: string
    file_name?: string
    thumbnail?: string
    mime_type?: string
    message_id?: number
}

export interface TextEntity {
    type: string
    text: string
    href?: string
    language?: string
    user_id?: number
}

export interface Reaction {
    type: string
    count: number
    emoji: string
    recent?: Recent[]
}

export interface Recent {
    from?: string
    from_id: string
    date: string
}

export interface SiteMapItem {
    url: string;
    lastModified: Date;
    changeFrequency: string;
    priority: number;
}

export interface AboutItem {
    title: string;
    description: string;
    groupNickName: number;
    noTopics: boolean;
}
