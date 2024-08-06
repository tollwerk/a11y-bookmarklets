import { Info, SuccessInfo } from '../lib/info';

(function iefe(w, d, q) {
    const css = 'color:black;font-family:sans-serif;font-weight:bold;font-size:small;background-color:yellow;speak:literal-punctuation';

    function createSpan(str, cls, style) {
        const span = d.createElement('strong');
        span.className = cls;
        span.setAttribute('style', `${css}${style || ''}`);
        span.textContent = str;
        return span;
    }

    function wrapInner(el, str1, str2) {
        el.insertBefore(createSpan(str1, 'openSpan'), el.firstChild);
        el.appendChild(createSpan(str2, 'closeSpan'));
    }

    d[q]('strong.openSpan,strong.closeSpan')
        .forEach((e) => e.remove());
    d[q]('ul,ol,dl')
        .forEach((e) => {
            e.setAttribute('style', 'outline:green 2px solid;padding:2px;list-style-position: inside;');
        });
    d[q]('ul>p,ol>p')
        .forEach((p) => {
            p.setAttribute('style', 'outline:2px solid red;');
            p.parentNode.setAttribute('style', 'outline:2px solid red;');
            wrapInner(p.parentNode, '❌NO CHILD LI');
        });
    const icons = {
        UL: '📝',
        OL: '🔢',
        DL: '📕'
    };
    const lists = d[q]('ul,ol,dl,li,dd,dt');
    lists.forEach((l) => {
        const icon = icons[l.tagName] || '';
        wrapInner(l, `<${l.tagName.toLowerCase()}>${icon}`, `</${l.tagName.toLowerCase()}>`);
    });

    let msg;
    let type;
    if (!lists.length) {
        type = Info;
        msg = 'No Lists Found on page';
    } else {
        type = SuccessInfo;
        msg = `Lists found on page: ${lists.length}`;
    }

    (new type(d.body, 2, msg, null, 'position:fixed;top:0;left:0')).create(true);

}(window, document, 'querySelectorAll'));
