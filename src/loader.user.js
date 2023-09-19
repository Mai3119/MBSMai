// ==UserScript==
// @name         MBS - Maid's Bondage Scripts
// @namespace    MBS
// @version      R94
// @description  Loader of Mai's Custom MBS
// @author       Bananarama92
// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @homepage     https://github.com/Mai3119/MBSMai.git#readme
// @source       https://github.com/Mai3119/MBSMai.git
// @downloadURL  https://github.com/Mai3119/MBSMai/raw/main/src/loader.user.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

// eslint-disable-next-line no-restricted-globals
setTimeout(
    () => {
        const n = document.createElement("script");
        n.language = "JavaScript";
        n.crossorigin = "anonymous";
        n.src = "https://Mai3119.github.io/MBSMai/main/mbs.js";
        document.head.appendChild(n);
    },
    2000,
);
