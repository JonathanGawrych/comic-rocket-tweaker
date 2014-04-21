// ==UserScript==
// @name        Remove "Selected Readers" on Comic Rocket
// @namespace   http://userscripts.org/users/JonathanGawrych
// @description Comic Rocket adds various user's profile pictures every comic serial as "Selected Readers". This script removes them.
// @include     *://www.comic-rocket.com/
// @version     1
// @grant       none
// ==/UserScript==

var readers = document.getElementsByClassName('comics-item-readers');
for (var i = 0; i < readers.length; i++) {
    readers[i].style.display = "none";
}
