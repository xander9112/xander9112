<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Modal</title>

    <link rel="stylesheet" href="./site/assets/css/style.css"/>
</head>
<body>
<div class="ui top fixed menu">
    <div class="item">
        AlexZander
    </div>
    <a href="/" class="item<?= $_SERVER['REQUEST_URI'] == '/' ? ' active' : ''; ?>">
        Главная
    </a>
    <a href="/YouTubePlayer" class="item<?= $_SERVER['REQUEST_URI'] == '/YouTubePlayer' ? ' active' : ''; ?>">
        YouTubePlayer
    </a>
    <a href="/VimeoPlayer" class="item<?= $_SERVER['REQUEST_URI'] == '/VimeoPlayer' ? ' active' : ''; ?>">
        VimeoPlayer
    </a>

    <div class="ui simple dropdown item">
        GoogleMaps
        <i class="dropdown icon"></i>

        <div class="menu">
            <a href="/GoogleMapsOffsetLeft" class="item<?= $_SERVER['REQUEST_URI'] == '/GoogleMapsOffsetLeft' ? ' active' : ''; ?>">GoogleMapsOffsetLeft</a>
            <a href="/GoogleMapsOffsetTop" class="item<?= $_SERVER['REQUEST_URI'] == '/GoogleMapsOffsetTop' ? ' active' : ''; ?>">GoogleMapsOffsetTop</a>
        </div>
    </div>
</div>
