import { colors, ErrorInfo, Info, recurse, reset, SuccessInfo, WarningInfo } from "../lib/info";

(function iefe(d, h, g, s) {
    reset();

    /**
     * Register a label relevant attribute
     *
     * @param {Element} el Element
     * @param {String} attr Attribute name
     * @return {null|String} Attribute value
     */
    function regjsterAttributeLabel(el, attr) {
        if (el[h](attr)) {
            const value = el[g](attr);
            this.push(`[${attr}="${value}"]`);
            return value;
        }
        return null;
    }

    /**
     * Register a label relevant attribute and highlight referenced elements
     *
     * @param {Element} el Element
     * @param {String} attr Attribute name
     * @return {null|String} Attribute value
     */
    function registerAttributeLabelAndHighlightIdRefs(el, attr) {
        const val = regjsterAttributeLabel.call(this, el, attr);
        const vals = [];
        if (val !== null) {
            const valByArray = val.split(' ');
            for (let i = 0; i < valByArray.length; i += 1) {
                const idRef = valByArray[i].trim();
                if (idRef.length) {
                    const idEl = document.getElementById(idRef);
                    if (idEl) {
                        idEl.setAttribute('style', 'outline:orange 2px dotted;');
                        (new Info(idEl, 2, `[id=${idRef}]`, null, 'position:absolute')).create();
                        const idVal = idEl.textContent;
                        if (idVal.trim().length) {
                            vals.unshift(idVal);
                        }
                    }
                }
            }
        }
        return vals.length ? vals.join('') : null;
    }

    /**
     * Recursively test whether an element is wrapped with a link
     *
     * @param {Element} el Element
     * @return {boolean} Is linked
     */
    function isLinked(el) {
        return el.parentNode && ((el.parentNode.tagName === 'A') || isLinked(el.parentNode));
    }

    recurse(el => {
        (new ErrorInfo(el, 2, `&amp;lt;${el.tagName.toLowerCase()}&amp;gt; with invalid <code>alt="${el.getAttribute('alt')}"</code>`, null, 'position:absolute')).create();
    }, 'a[alt],button[alt],label[alt]');
    const stl = 'position:absolute';
    const labelImages = function labelImages(el) {
        const hasAlt = el[h]('alt');
        const hasTitle = el[h]('title');
        const label = [];
        regjsterAttributeLabel.call(label, el, 'role');
        let empty = regjsterAttributeLabel.call(label, el, 'aria-label') === null;
        empty = (registerAttributeLabelAndHighlightIdRefs.call(label, el, 'aria-describedby') === null) && empty;
        empty = (registerAttributeLabelAndHighlightIdRefs.call(label, el, 'aria-labelledby') === null) && empty;
        let region = null;
        let warn = false;
        el.style.outline = `#080 2px dotted`;
        el.style.padding = '2px';
        if (hasTitle) {
            region = 'Title';
            label.push(`[title="${el[g]('title')}"]`);
        }
        if (el[h]('longdesc')) {
            region = 'Long description';
            label.push(`[longdesc="${el[g]('longdesc')}"]`);
        }
        if (!hasAlt) {
            const relevant = empty && !hasTitle;
            warn = empty && hasTitle && el[g]('title').trim().length;
            empty = relevant;
            if (isLinked(el)) {
                if (relevant) {
                    label.unshift('a [!alt]');
                }
            } else {
                label.unshift('[!alt]');
            }
            if (empty) {
                el.style['outline-color'] = colors.error;
            }
        } else {
            empty = false;
            warn = !el[g]('alt').trim().length;
            label.unshift((isLinked(el) ? 'a ' : '') + `[alt="${el[g]('alt')}"]`);
        }

        const type = empty ? ErrorInfo : (warn ? WarningInfo : SuccessInfo);
        const info = (new type(el, 0, label.join(''), null, stl)).create();
        if (region) {
            info.setAttribute('role', 'region');
            info.setAttribute('aria-label', region);
        }
    }
    const images = recurse(labelImages, 'img, [role=img]');
    (new Info(d.documentElement, 2, `Images found on page: ${images}`, null, stl)).create(true);
}(document, 'hasAttribute', 'getAttribute', 'setAttribute'));
