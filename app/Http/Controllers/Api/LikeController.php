<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class LikeController extends Controller
{
    /**
     * Toggle like status for a specific post.
     */
    public function toggle(Request $request, Post $post)
    {
        $request->user()->likedPosts()->toggle($post->id);

        return response()->json([
            'message' => 'Like status toggled successfully',
            'likes_count' => $post->likes()->count(),
            'is_liked' => $request->user()->likedPosts()->where('post_id', $post->id)->exists(),
        ]);
    }
}
