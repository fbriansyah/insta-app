<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('posts', \App\Http\Controllers\PostController::class)->except(['update']);

    Route::post('/posts/{post}/comments', [\App\Http\Controllers\Api\CommentController::class, 'store']);
    Route::post('/posts/{post}/like', [\App\Http\Controllers\Api\LikeController::class, 'toggle']);
});
