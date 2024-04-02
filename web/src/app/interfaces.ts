export interface UserData {
    id: string;
    name: string;
}

export interface Message {
    id: string;
    res: {
        text: string;
    };
    user: string;
}

export interface Tags {
    id: string;
    name: string;
    emoji: string;
}

export interface SavedLink {
    id: string;
    title: string;
    url: string;
    tags: Tags[];
}

export interface AIResponse {
    id: string;
    query: string;
    response: string;
}

