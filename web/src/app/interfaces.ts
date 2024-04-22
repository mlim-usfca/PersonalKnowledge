export interface UserData {
    id: string;
    name: string;
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
    category: string;
}

export interface Category {
    id: string;
  name: string;
  links: string[];
}
