export interface User {
    id: number;
    name: string | null;
    username: string;
    avatar_url: string | null;
}

export interface Comment {
    id: number;
    content: string;
    author: User;
    can_delete: boolean;
    created_at: string;
}

export interface Post {
    id: number;
    caption: string | null;
    media_url: string;
    author: User;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    comments: Comment[];
    created_at: string;
}
