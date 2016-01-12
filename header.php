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

    <div class="ui simple dropdown item">
        YouTube
        <i class="dropdown icon"></i>

        <div class="menu">
            <a href="/YouTubePlayer"
               class="item<?= $_SERVER['REQUEST_URI'] == '/YouTubePlayer' ? ' active' : ''; ?>">YouTubePlayer</a>
            <a href="/YouTubePlayerList"
               class="item<?= $_SERVER['REQUEST_URI'] == '/YouTubePlayerList' ? ' active' : ''; ?>">YouTubePlayerList</a>
        </div>
    </div>
    <a href="/VimeoPlayer" class="item<?= $_SERVER['REQUEST_URI'] == '/VimeoPlayer' ? ' active' : ''; ?>">
        VimeoPlayer
    </a>


    <div class="ui simple dropdown item">
        GoogleMaps
        <i class="dropdown icon"></i>

        <div class="menu">
            <a href="/GoogleMapsOffsetLeft"
               class="item<?= $_SERVER['REQUEST_URI'] == '/GoogleMapsOffsetLeft' ? ' active' : ''; ?>">GoogleMapsOffsetLeft</a>
            <a href="/GoogleMapsOffsetTop"
               class="item<?= $_SERVER['REQUEST_URI'] == '/GoogleMapsOffsetTop' ? ' active' : ''; ?>">GoogleMapsOffsetTop</a>
        </div>
    </div>
    <a href="/SimpleSlider" class="item<?= $_SERVER['REQUEST_URI'] == '/SimpleSlider' ? ' active' : ''; ?>">
        SimpleSlider
    </a>
    <a href="/SimpleForm" class="item<?= $_SERVER['REQUEST_URI'] == '/SimpleForm' ? ' active' : ''; ?>">
        SimpleForm
    </a>
    <a href="/FormStyler" class="item<?= $_SERVER['REQUEST_URI'] == '/FormStyler' ? ' active' : ''; ?>">
        FormStyler
    </a>
</div>
