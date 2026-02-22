<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'author' => [
                'id' => $this->whenLoaded('user')->id ?? $this->user_id,
                'name' => $this->whenLoaded('user')->name ?? null,
                'username' => $this->whenLoaded('user')->username ?? null,
                'avatar_url' => $this->whenLoaded('user', function () {
                    return $this->user->avatar_path ? asset(\Illuminate\Support\Facades\Storage::url($this->user->avatar_path)) : null;
                }),
            ],
            'created_at' => $this->created_at,
        ];
    }
}
