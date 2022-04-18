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

    d[q]('strong.openSpan,strong.closeSpan').forEach(e => e.remove());
    d[q]('ul,ol,dl').forEach(e => {
        e.setAttribute('style', 'outline:green 2px solid;padding:2px;list-style-position: inside;');
    });
    d[q]('ul>p,ol>p').forEach(p => {
        p.setAttribute('style', 'outline:2px solid red;');
        p.parentNode.setAttribute('style', 'outline:2px solid red;');
        wrapInner(p.parentNode, '❌NO CHILD LI');
    });
    const icons = { 'UL': '📝', 'OL': '🔢', 'DL': '📕' };
    const lists = d[q]('ul,ol,dl,li,dd,dt');
    lists.forEach(l => {
        const icon = icons[l.tagName] || '';
        wrapInner(l, `<${l.tagName.toLowerCase()}>${icon}`, `</${l.tagName.toLowerCase()}>`);
    });

    if (!lists.length) {
        const status = createSpan('', '', 'margin:0 2px;padding:2px;');
        status.setAttribute('id', 'failure');
        status.setAttribute('role', 'status');
        d.body.insertBefore(status, d.body.firstChild);
        status.textContent = `No Lists Found on Page: ${d.title}`;
        w.setTimeout(() => status.remove(), 6000);
    } else {
        const alert = d.createElement('div');
        alert.setAttribute('id', 'success');
        alert.setAttribute('role', 'alert');
        alert.setAttribute('style', 'position:absolute;width:0;height:0;clip:rect(0,0,0,0);');
        d.body.appendChild(alert);
        alert.textContent = `Success! Lists Found on Page: ${d.title}`;
        w.setTimeout(() => alert.remove(), 3000);
    }
}(window, document, 'querySelectorAll'));
