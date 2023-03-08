'use strict';

const css = {
    color: 'black',
    'font-family': 'sans-serif',
    'font-size': 'small',
    'background-color': 'yellow',
    padding: '5px',
    outline: '2px dotted #000',
    'outline-offset': '-3px',
    'border-width': 0,
    cursor: 'default'
};

/**
 * Return whether an HTML element is a void element
 *
 * @param {Element} el HTML element
 * @param {String} add Addition HTML elements
 * @returns {boolean} Is a void element
 */
const isVoidEl = function isVoidEl(el, ...add) {
    return ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', ...add].indexOf(el.tagName.toLowerCase()) >= 0;
};

/**
 * Return whether an HTML element is a void element including special form elements
 *
 * @param {Element} el HTML element
 * @param {String} add Addition HTML elements
 * @returns {boolean} Is a void element
 */
const isVoidFormEl = function isVoidFormEl(el) {
    return isVoidEl(el, 'select', 'textarea');
};

/**
 * Recursively reset all info bubbles
 */
const reset = function reset() {
    recurse((e) => e.remove(), '.twa11y');
};

/**
 * Apply a query selector callback and recurse into shadow DOMs
 *
 * @param {Function} func Callback
 * @param {String} sel Selector
 * @param {Element} root Root element (defaults to the document)
 * @return {Number} Number of occurrences
 */
const recurse = function recurse(func, sel, root = null) {
    let count = Array.from((root || document).querySelectorAll(sel)).reduce((acc, el) => {
        func(el);
        return acc + 1;
    }, 0);
    Array.from((root || document).querySelectorAll('*')).forEach((el) => {
        if (el.shadowRoot) {
            count += recurse(func, sel, el.shadowRoot);
        }
    });
    return count;
};

/**
 * Parse CSS style string
 *
 * @param {String} stl CSS style string
 * @return {Object}
 */
const styleToObject = function styleToObject(stl) {
    const stlCss = {};
    stl.split(';').forEach((sel) => {
        if (sel.trim().length) {
            const [prop, val] = sel.split(':');
            stlCss[prop] = val.trim();
        }
    });
    return stlCss;
};

/**
 * Format a CSS style string from an object
 *
 * @param {Object} elstl Style object
 * @return {string} CSS style string
 */
const objectToStyle = function objectToStyle(elstl) {
    const stl = [];
    for (const p in elstl) {
        stl.push(`${p}:${elstl[p]}`);
    }
    return stl.join(';');
};

/**
 * Info label
 */
class Info {
    /**
     * Create an info label
     *
     * @param {Element} el Reference element
     * @param {Number} pos Insertion mode (0 / 1 = before / after node, 2 / 3 = before first / after last child)
     * @param {String} str Text content
     * @param {String} cls CSS class names
     * @param {String} stl Inline CSS styles
     */
    constructor(el, pos, str, cls, stl) {
        this.el = el;
        this.pos = pos;
        this.str = (str || '').trim();
        this.cls = `twa11y ${cls}`.trim();
        this.stl = (stl || '').trim();
    }

    /**
     * Create and return the info element
     *
     * @returns {HTMLSpanElement}
     */
    create() {
        const info = document.createElement('button');
        if (this.cls.trim().length) {
            info.className = this.cls;
        }
        const styleObj = { ...css, ...styleToObject(this.stl) };
        if (this.el.offsetParent) {
            styleObj.left = `${this.el.offsetLeft}px`;
            styleObj.top = `${this.el.offsetTop}px`;
        }
        const style = objectToStyle(styleObj);
        if (style.length) {
            info.setAttribute('style', style);
        }
        info.innerHTML = this.str;
        if (this.pos === 0) {
            this.el.parentNode.insertBefore(info, this.el);
        } else if (this.pos === 1) {
            this.el.parentNode.insertBefore(info, this.el.nextSibling);
        } else if (this.pos === 2) {
            this.el.insertBefore(info, this.el.firstChild);
        } else if (this.pos === 3) {
            this.el.appendChild(info);
        }
        info.onclick = (e) => {
            console.log(this.el);
            return false;
        };
        return info;
    }
}

/**
 * Success info
 */
class SuccessInfo extends Info {
    /**
     * Create a success info
     *
     * @param {Element} el Reference element
     * @param {Number} pos Insertion mode (0 / 1 = before / after node, 2 / 3 = before first / after last child)
     * @param {String} str Text content
     * @param {String} cls CSS class names
     * @param {String} stl Inline CSS styles
     */
    constructor(el, pos, str, cls, stl) {
        super(el, pos, `✔ ${str}`, cls, `${stl || ''};background-color:lime;outline-color:#000`);
    }
}

/**
 * Error label
 */
class ErrorInfo extends Info {
    /**
     * Create an error info
     *
     * @param {Element} el Reference element
     * @param {Number} pos Insertion mode (0 / 1 = before / after node, 2 / 3 = before first / after last child)
     * @param {String} str Text content
     * @param {String} cls CSS class names
     * @param {String} stl Inline CSS styles
     */
    constructor(el, pos, str, cls, stl) {
        super(el, pos, `✖ ${str}`, cls, `${stl || ''};background-color:#EB0000;outline-color:#fff;color:#fff`);
    }
}

/**
 * Warning info
 */
class WarningInfo extends Info {
    /**
     * Create a warning info
     *
     * @param {Element} el Reference element
     * @param {Number} pos Insertion mode (0 / 1 = before / after node, 2 / 3 = before first / after last child)
     * @param {String} str Text content
     * @param {String} cls CSS class names
     * @param {String} stl Inline CSS styles
     */
    constructor(el, pos, str, cls, stl) {
        super(el, pos, `💀 ${str}`, cls, stl );
    }
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
            createInfo(el, 2, `❓id="${valByArray[i]}"`, 'inputSpan', 'outline:orange 2px dashed;padding:1px;z-index:2147483647;');
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

// exports.createAfterInfo = createAfterInfo;
// exports.createAfterInfoAndIds = createAfterInfoAndIds;
// exports.createRegion = createRegion;
exports.isVoidEl = isVoidEl;
exports.isVoidFormEl = isVoidFormEl;
exports.reset = reset;
exports.recurse = recurse;
exports.Info = Info;
exports.SuccessInfo = SuccessInfo;
exports.ErrorInfo = ErrorInfo;
exports.WarningInfo = WarningInfo;
