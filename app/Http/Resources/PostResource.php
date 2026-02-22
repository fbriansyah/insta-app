<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PostResource extends JsonResource
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
            'caption' => $this->caption,
            'media_url' => asset(Storage::url($this->media_path)),
            'author' => [
                'id' => $this->whenLoaded('user')->id ?? $this->user_id,
                'name' => $this->whenLoaded('user')->name ?? null,
                'username' => $this->whenLoaded('user')->username ?? null,
                'avatar_url' => $this->whenLoaded('user', function () {
                    return $this->user->avatar_path ? asset(Storage::url($this->user->avatar_path)) : null;
                }),
            ],
            'created_at' => $this->created_at,
        ];
    }
}
