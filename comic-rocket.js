// ==UserScript==
// @name        Comic Rocket Tweaker
// @namespace   https://github.com/JonathanGawrych
// @updateURL   https://raw.githubusercontent.com/JonathanGawrych/comic-rocket-tweaker/master/comic-rocket.js
// @description Tweaks some minor visuals (removes "Selected Readers") and allows you to hide comics when exploring for a new one.
// @include     *://www.comic-rocket.com/*
// @version     4
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
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

a.comics-item-add {
	background-image: none;
	font-size: 0;
	cursor: pointer;
}

a.comics-item-add:before {
	content: '';
	width: 100%;
	height: 100%;
	display: block;
	transform: rotate(45deg);
	background-image: url('/media/img/icon-add.png?acfadcaf1ca4');
	background-repeat: no-repeat;
    background-position: center;
}

.comics-list[hide-user-hidden="true"] .comics-item[user-hidden="true"] {
	display: none;
}

.comics-item[user-hidden="false"] a.comics-item-add {
	background-color: #000;
}

.hide-info {
	padding: 5px;
	box-sizing: border-box;
}

.hide-info a {
	cursor: pointer;
	color: #08f;
}

.hide-info a:hover {
	color: #0af;
}
`);

document.addEventListener('DOMContentLoaded', function () {
	let comicList = document.querySelector('.comics-list');
	if (comicList == null)
		return;

	let comicItems = document.querySelectorAll('.comics-item');

	let hiddenComics = GM_getValue('hidden', []);
	let hiddenInfo = document.createElement('div');
	hiddenInfo.setAttribute('class', 'comics-item hide-info');
	let hiddenInfoText = document.createTextNode('You have hidden ' + hiddenComics.length + ' comic(s). ');
	let unhide = document.createElement('a');
	let unhideText = document.createTextNode('Unhide them.');
	unhide.addEventListener('click', toggleHiddenComics);
	unhide.appendChild(unhideText);
	hiddenInfo.appendChild(hiddenInfoText);
	hiddenInfo.appendChild(unhide);
	comicList.insertBefore(hiddenInfo, comicList.firstChild);

	function toggleHiddenComics() {
		let currentlyHidden = comicList.getAttribute('hide-user-hidden') === 'true';
		currentlyHidden = !currentlyHidden;
		comicList.setAttribute('hide-user-hidden', currentlyHidden ? 'true' : 'false');
		unhideText.textContent = (currentlyHidden ? 'Unhide' : 'Hide') + ' them.';
	}
	toggleHiddenComics();

	function toggleHideComic() {
		let parent = this.parentNode.parentNode.parentNode;
		let comic = parent.getAttribute('comic');
		let hideIndex = hiddenComics.indexOf(comic);
		if (hideIndex === -1) {
			hiddenComics.push(comic);
		} else {
			hiddenComics.splice(hideIndex, 1);
		}
		parent.setAttribute('user-hidden', hiddenComics.indexOf(comic) !== -1);
		hiddenInfoText.textContent = 'You have hidden ' + hiddenComics.length + ' comic(s). ';
		GM_setValue('hidden', hiddenComics);
	}

	function parseComics(comicItems) {
		for (let item of comicItems) {
			let add = item.querySelector('a.comics-item-add');
			if (add == null)
				continue;
			let comic = add.getAttribute('href');
			add.removeAttribute('href');
			add.addEventListener('click', toggleHideComic);
			item.setAttribute('comic', comic);
			item.setAttribute('user-hidden', hiddenComics.indexOf(comic) !== -1);
		}
	}
	parseComics(comicItems);

	// hook infinitescroll
	window.addEventListener("load", function infScrollHook() {
		var infOptions = jQuery.data(comicList, 'infinitescroll').options;
		infOptions.callback = (function patcher(oldFn) {
			return function wrap(...args) {
				parseComics(args[1]);
				return oldFn(...args);
			}
		})(infOptions.callback);
	});
});
