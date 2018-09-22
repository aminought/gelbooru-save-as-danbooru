// ==UserScript==
// @name Gelbooru Save As Danbooru
// @namespace Violentmonkey Scripts
// @match *://gelbooru.com/*
// @grant none
// @run-at document-start
// ==/UserScript==

function getNamesByTag(tag) {
    elements = document.getElementsByClassName(tag);
    names = []
    for (var i=0; i < elements.length; i++) {
        name = elements[i].children[1].text;
        names.push(name);
    }
    return names;
}

function getImage() {
    image = document.getElementById('image');
    return image;
}

function getImageUrl() {
    url = getImage().src;
    return url;
}

function getImageId(url) {
    ch = url.search('_') != -1 ? '_' : '/';
    id = url.split(ch).reverse()[0].split('.')[0];
    return id;
}

function getImageExt(url) {
    ext = url.split('.').pop();
    return ext;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function getDanbooruStyleName(char_names, artist_names, copyright_names, image_id, image_ext) {
    char_str = char_names.join('_and_')
    copyright_str = copyright_names.join('_and_')
    artist_str = artist_names.join('_and_')

    image_name = `__${char_str}_${copyright_str}_drawn_by_${artist_str}__${image_id}.${image_ext}`

    image_name = image_name.replace(/[,\/#!$%\^&\*;:{}=\-~()]/g, '');
    image_name = image_name.replace(/\s/g, '_');
    return image_name;
}

function addDownloadLink(image_url, image_name) {
    var link = document.createElement('a');
    link.setAttribute('href', image_url);
    link.setAttribute('download', image_name);
    image_element = getImage();
    image_element.parentNode.replaceChild(link, image_element);
    link.appendChild(image_element);
}

window.onload = function() {
    char_names = getNamesByTag('tag-type-character');
    artist_names = getNamesByTag('tag-type-artist');
    copyright_names = getNamesByTag('tag-type-copyright');

    image_url = getImageUrl();
    image_id = getImageId(url);
    image_ext = getImageExt(url);

    image_name = getDanbooruStyleName(char_names, artist_names, copyright_names, image_id, image_ext);
    addDownloadLink(image_url, image_name);
}
