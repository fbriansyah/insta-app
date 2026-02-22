<?php

namespace App\Services;

use App\Models\Post;

class PostService
{
    /**
     * Create a new post.
     *
     * @param \App\Models\User $user
     * @param array $data
     * @return \App\Models\Post
     */
    public function createPost($user, array $data): Post
    {
        $path = $data['media']->store('posts', 'public');

        return $user->posts()->create([
            'caption' => $data['caption'] ?? null,
            'media_path' => $path,
        ]);
    }
}
