export interface TGMessage {
    id:                   number;
    type?:                string;
    date?:                Date;
    date_unixtime?:       string;
    edited?:              Date;
    edited_unixtime?:     string;
    title?:               string;
    action?:              string;
    from?:                string;
    from_id?:             string;
    reply_to_message_id?: number;
    text?:                string;
    text_entities?:       TextEntity[];
    name?:                string;
    founded?:             number;
    members?:             string[];
    messages:             string[];
}

export interface TextEntity {
    type: string;
    text: string;
    href?: string;
}
