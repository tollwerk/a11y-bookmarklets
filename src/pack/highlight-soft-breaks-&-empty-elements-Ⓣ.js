import { Info, SuccessInfo } from '../lib/info';

(function iefe(els) {
    /**
     * Highlight an element if it's empty or a softbreak
     *
     * @param {Element} el Element
     * @param {String} col Colour
     * @returns {number} Highlighted elements
     */
    function highlight(el, col) {
        if (el.querySelectorAll('*').length || el.textContent.trim().length) {
            return 0;
        }
        const span = document.createElement('span');
        span.title = el.tagName;
        const style = `border-radius:50%;background-color:${col};display:inline-block;width:1rem;height:1rem`;
        el.parentNode.insertBefore(span, el).setAttribute('style', style);
        return 1;
    }

    let matches = 0;
    for (const s in els) {
        if ({}.hasOwnProperty.call(els, s)) {
            const m = document.querySelectorAll(s);
            m.forEach((el) => matches += highlight(el, els[s]));
        }
    }
    if (matches) {
        (new SuccessInfo(document.body, 2, `Softbreaks and empty elements on page: ${matches}`, null, 'position:fixed;top:0;left:0')).create(true);
    } else {
        (new Info(document.body, 2, 'No softbreaks or empty elements found on page', null, 'position:fixed;top:0;left:0')).create(true);
    }

}({ br: '#f00', p: '#0f0', 'ul,ol,dl': '#00f' }));
