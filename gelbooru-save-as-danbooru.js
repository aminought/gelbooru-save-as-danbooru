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

function getDanbooruStyleName(char_names, artist_names, copyright_names, image_id, image_ext) {
    image_name = '__';
    if (char_names.length > 0) {
        char_str = char_names.join('_and_');
        image_name += `${char_str}_`;
    }
    if (copyright_names.length > 0) {
        copyright_str = copyright_names.join('_and_');
        image_name += `${copyright_str}_`;
    }
    if (artist_names.length > 0) {
        artist_str = artist_names.join('_and_');
        image_name += `drawn_by_${artist_str}`;
    }

    if (artist_names.length > 0 || copyright_names.length > 0 || artist_names.length > 0) {
        image_name += '__'
    }
    image_name += `${image_id}.${image_ext}`;

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

// https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
const copyToClipboard = str => {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0      // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0) // Store selection if found
            : false;                                // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
        document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
    }
};

function addCopyNameButton(image_name) {
    var btn = document.createElement('button');
    btn.innerHTML = 'Click to copy name';
    btn.addEventListener('click', function() {
        copyToClipboard(image_name);
    });
    div = document.getElementById('right-col')
    image = getImage();
    div.insertBefore(btn, image.parentNode);
}

window.onload = function() {
    char_names = getNamesByTag('tag-type-character');
    artist_names = getNamesByTag('tag-type-artist');
    copyright_names = getNamesByTag('tag-type-copyright');

    image_url = getImageUrl();
    image_id = getImageId(url);
    image_ext = getImageExt(url);

    image_name = getDanbooruStyleName(char_names, artist_names, copyright_names, image_id, image_ext);
    addCopyNameButton(image_name);
    addDownloadLink(image_url, image_name);
}
