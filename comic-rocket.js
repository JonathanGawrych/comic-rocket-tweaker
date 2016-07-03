// ==UserScript==
// @name        Remove "Selected Readers" on Comic Rocket
// @namespace   http://userscripts.org/users/JonathanGawrych
// @description Comic Rocket adds various user's profile pictures every comic serial as "Selected Readers". This script removes them, and tidies up the empty space.
// @include     *://www.comic-rocket.com/*
// @version     3
// @grant       GM_addStyle
// @run-at      document-start
// ==/UserScript==


GM_addStyle(`
.comics-item-progressrow {
	height: 30px;
}

.comics-item-rating {
	float: left;
	display: block;
	height: 30px;
	lineHeight: 30px;
}

.comics-item-readers {
	display: none;
}

.comics-item-progress {
	top: auto;
	right: auto;
	position: static;
	float: left;
	margin: 5.5px;
	width: 465px;
}

.comics-item-date {
	top: auto;
	right: auto;
	position: static;
	float: left;
}

.comics-item-date div {
	height: 30px;
}

.comics-item-date span {
	display: none;
}

`);
