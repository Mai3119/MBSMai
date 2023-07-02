// ==UserScript==
// @name         MBS - Maid's Bondage Scripts
// @namespace    MBS
// @version      0.6.7
// @description  Loader of Mai's Forked "Maid's Bondage Scripts" mod
// @author       Bananarama92
// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @homepage     https://github.com/Mai3122/MBS.git#readme
// @source       https://github.com/Mai3122/MBS.git
// @downloadURL  https://github.com/Mai3122/MBS/raw/main/src/loader.user.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

// eslint-disable-next-line no-restricted-globals
setTimeout(
    () => {
        const n = document.createElement("script");
        n.language = "JavaScript";
        n.crossorigin = "anonymous";
        n.src = "https://mai3122.github.io/MBS/main/mbs.js";
        document.head.appendChild(n);
    },
    2000,
);