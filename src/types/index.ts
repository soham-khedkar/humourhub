export interface Meme {
  id: string;
  title: string;
  url: string;
  type: 'meme' | 'template';
  created_at: string;
  user_id: string;
  likes: number;
  tags: string[];
}

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}