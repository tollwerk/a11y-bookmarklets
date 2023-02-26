"use strict";

const css = {
    color: 'black',
    'font-family': 'sans-serif',
    'font-size': 'small',
    'background-color': 'yellow',
    speak: 'literal-punctuation',
    padding: '2px'
};

/**
 * Parse CSS style string
 *
 * @param {String} stl CSS style string
 * @return {Object}
 */
const parseStyleString = function parseStyleString(stl) {
    const stlCss = {};
    stl.split(';').forEach(sel => {
        if (sel.trim().length) {
            const [prop, val] = sel.split(':');
            stlCss[prop] = val;
        }
    });
    return stlCss;
}

/**
 * Format a CSS style string from an object
 *
 * @param {Object} elstl Style object
 * @return {string} CSS style string
 */
const makeStyleString = function makeStyleString(elstl) {
    let stl = '';
    for (const p in elstl) {
        stl += `${p}:${elstl[p]};`;
    }
    return stl;
}

/**
 * Create an info label
 *
 * @param {Element} el Reference element
 * @param {Number} pos Insertion mode (0 / 1 = before / after node, 2 / 3 = before first / after last child)
 * @param {String} str Text content
 * @param {String} cls CSS class names
 * @param {string} stl Inline CSS styles
 * @returns {HTMLSpanElement}
 */
function createInfo(el, pos, str, cls, stl) {
    const info = document.createElement('span');
    info.className = cls || '';
    info.setAttribute('style', makeStyleString({ ...css, ...parseStyleString(stl) }));
    info.textContent = str;
    if (pos === 0) {
        el.parentNode.insertBefore(info, el);
    } else if (pos === 1) {
        el.parentNode.insertBefore(info, el.nextSibling);
    } else if (pos === 2) {
        el.insertBefore(info, el.firstChild);
    } else if (pos === 3) {
        el.appendChild(info);
    }
    return info;
}


/**
 * Create an info label
 *
 * @param {Element} el Reference element
 * @param {Number} pos Insertion mode (0 / 1 = before / after node, 2 / 3 = before first / after last child)
 * @param {String} str Text content
 * @param {String} cls CSS class names
 * @param {string} stl Inline CSS styles
 * @returns {HTMLSpanElement}
 */
function createSuccess(el, pos, str, cls, stl) {
    return createInfo(el, pos, str, cls, `${stl};background-color:lime`);
}

/**
 * Create a closing info label
 *
 * @param {Element} el Reference element
 * @param {String} str Text content
 * @returns {HTMLSpanElement}
 */
function createAfterInfo(el, str) {
    return createInfo(el, 1, str, 'closeSpan', 'outline:orange 2px dashed;margin:0 2px;padding:2px;');
}

/**
 * Create a closing info label and highlight elements referenced by ID
 *
 * @param {Element} el Reference element
 * @param {String} str Text content
 * @param {String} val IDREFs
 * @returns {HTMLSpanElement}
 */
function createAfterInfoAndIds(el, str, val) {
    const valByArray = val.split(' ');
    for (let i = 0; i < valByArray.length; i += 1) {
        const idEl = document.getElementById(valByArray[i]);
        if (idEl) {
            idEl.setAttribute('style', 'outline:orange 2px dashed;');
            createInfo(
                el,
                2,
                `❓id="${valByArray[i]}"`,
                'inputSpan',
                'outline:orange 2px dashed;padding:1px;z-index:2147483647;'
            );
        }
    }
    return createAfterInfo(el, str);
}

/**
 * Create an info label and make it a named region
 *
 * @param {String} title Region title
 * @param {Element} el Reference element
 * @param {Number} pos Insertion mode (0 / 1 = before / after parent node, 2 / 3 = before first / after last child)
 * @param {String} str Text content
 * @param {String} cls CSS class names
 * @param {string} stl Inline CSS styles
 * @returns {HTMLSpanElement}
 */
function createRegion(title, el, pos, str, cls, stl) {
    const region = createInfo(el, pos, str, cls, stl);
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', title);
    return region;
}

exports.createInfo = createInfo;
exports.createSuccess = createSuccess;
exports.createAfterInfo = createAfterInfo;
exports.createAfterInfoAndIds = createAfterInfoAndIds;
exports.createRegion = createRegion;
