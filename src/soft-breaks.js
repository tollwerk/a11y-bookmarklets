(function (els) {
    function highlight(el, col) {
        if (el.querySelectorAll('*').length || el.textContent.trim().length) {
            return;
        }
        const span = document.createElement('span');
        span.title = el.tagName;
        el.parentNode
            .insertBefore(span, el)
            .setAttribute('style', 'border-radius:50%;background-color:' + col + ';display:inline-block;width:1rem;height:1rem');
    };
    for (const s in els) {
        document.querySelectorAll(s).forEach(el => highlight(el, els[s]));
    }
})({ br: '#f00', p: '#0f0', 'ul,ol,dl': '#00f' });
