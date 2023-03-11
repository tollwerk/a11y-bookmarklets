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
    cursor: 'default',
    'z-index': 2147483647
};
const colors = { error: '#EB0000', success: 'lime' };
const show = function show() {
    if (document.querySelectorAll('.twa11y-toggle:checked').length == 0) {
        this.style.display = 'inline';
    }
}
const hide = function hide() {
    if (document.querySelectorAll('.twa11y-toggle:checked').length == 0) {
        this.style.display = 'none';
    }
}

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
 * Recursively reset all info bubbles
 */
const reset = function reset() {
    recurse((e) => e.remove(), '.twa11y');
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
     * @param {String} icn Icon (Unicode)
     * @param {Boolean} opn Always opened
     */
    constructor(el, pos, str, cls, stl, icn, opn) {
        this.el = el;
        this.pos = pos;
        this.str = (str || '').trim();
        this.cls = `twa11y ${cls || ''}`.trim();
        this.stl = (stl || '').trim();
        this.icn = icn || '🔍';
        this.opn = !!opn;
        this.tgl = false;
    }

    /**
     * Create and return the info element
     *
     * @param {Boolean} glb Make it a global bubble including a toggle
     * @returns {HTMLSpanElement}
     */
    create(glb) {
        const info = document.createElement(glb ? 'label' : 'button');
        if (this.cls.trim().length) {
            info.className = this.cls;
        }
        const styleObj = { ...css, ...styleToObject(this.stl) };
        if (this.el.offsetParent && (this.el.offsetParent !== document.body)) {
            styleObj.left = `${this.el.offsetLeft}px`;
            styleObj.top = `${this.el.offsetTop}px`;
        }
        const style = objectToStyle(styleObj);
        if (style.length) {
            info.setAttribute('style', style);
        }
        if (this.icn) {
            if (glb) {
                info.innerHTML = `${this.icn} ${this.str}`;
            } else {
                info.innerHTML = this.icn;
                const inner = document.createElement('span');
                inner.className = 'twa11y-details';
                inner.innerHTML = this.str;
                inner.style.marginLeft = '4px';
                info.appendChild(inner);
                if (!this.opn) {
                    inner.style.display = 'none';
                    info.addEventListener('focus', show.bind(inner));
                    info.addEventListener('mouseover', show.bind(inner));
                    info.addEventListener('blur', hide.bind(inner));
                    info.addEventListener('mouseout', hide.bind(inner));
                }
            }
        } else {
            info.innerHTML = this.str;
        }
        if (glb) {
            info.appendChild(document.createTextNode(' — show all'))
            const toggle = document.createElement('input');
            toggle.className = 'twa11y-toggle';
            toggle.setAttribute('type', 'checkbox');
            toggle.style.margin = '0 0 0 4px';
            toggle.style.verticalAlign = 'baseline';
            toggle.addEventListener('change', function () {
                Array.from(document.querySelectorAll('.twa11y-toggle')).forEach(t => {
                    if (t !== this) {
                        t.checked = this.checked;
                    }
                });
                Array.from(document.querySelectorAll('.twa11y-details')).forEach(d => {
                    d.style.display = this.checked ? 'inline' : 'none';
                });
            });
            info.appendChild(toggle);
        } else {
            info.onclick = (e) => {
                console.log(this.el);
                return false;
            };
        }
        if (this.pos === 0) {
            this.el.parentNode.insertBefore(info, this.el);
        } else if (this.pos === 1) {
            this.el.parentNode.insertBefore(info, this.el.nextSibling);
        } else if (this.pos === 2) {
            this.el.insertBefore(info, this.el.firstChild);
        } else if (this.pos === 3) {
            this.el.appendChild(info);
        }
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
     * @param {String} icn Icon (Unicode)
     * @param {Boolean} opn Always opened
     */
    constructor(el, pos, str, cls, stl, icn, opn) {
        super(el, pos, str, cls, `${stl || ''};background-color:lime;outline-color:#000`, icn || '✔', !!opn);
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
     * @param {String} icn Icon (Unicode)
     * @param {Boolean} opn Always opened
     */
    constructor(el, pos, str, cls, stl, icn, opn) {
        super(el, pos, str, cls, `${stl || ''};background-color:#EB0000;outline-color:#fff;color:#fff`, icn || '✖', !!opn);
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
     * @param {String} icn Icon (Unicode)
     * @param {Boolean} opn Always opened
     */
    constructor(el, pos, str, cls, stl, icn, opn) {
        super(el, pos, str, cls, `${stl || ''};background-color:orange;outline-color:#000`, icn || '💀', !!opn);
    }
}

exports.isVoidEl = isVoidEl;
exports.isVoidFormEl = isVoidFormEl;
exports.reset = reset;
exports.recurse = recurse;
exports.colors = colors;
exports.Info = Info;
exports.SuccessInfo = SuccessInfo;
exports.ErrorInfo = ErrorInfo;
exports.WarningInfo = WarningInfo;

