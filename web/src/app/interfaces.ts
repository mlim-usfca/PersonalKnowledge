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

export interface SavedCategory {
    id: number;
    name: string;
    links: SavedLink[];
}

export interface SavedLink {
    id: string;
    title: string;
    url: string;
    tags: Tags[];
    category: string;
}

export interface Category {
    id: string;
  name: string;
}

export interface Chat {
    id: string;
    messages: Message[];
    category: Category;
}
