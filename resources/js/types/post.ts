export interface User {
    id: number;
    name: string | null;
    username: string;
    avatar_url: string | null;
}

export interface Post {
    id: number;
    caption: string | null;
    media_url: string;
    author: User;
    created_at: string;
}
