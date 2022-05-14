(function iefe(w, d, q, h, g, s) {
    const css = 'color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:yellow;speak:literal-punctuation';

    function createInfo(el, pos, str, cls, stl) {
        const info = d.createElement('span');
        info.className = cls;
        info[s]('style', `${css};${stl}`);
        info.textContent = str;
        switch (pos) {
            case 0:
                el.parentNode.insertBefore(info, el);
                break;
            case 1:
                el.parentNode.insertBefore(info, el.nextSibling);
                break;
            case 2:
                el.insertBefore(info, el.firstChild);
                break;
            case 3:
                el.appendChild(info);
                break;
        }
        return info;
    }

    d[q]('span.openSpan,span.closeSpan,span.inputSpan').forEach((e) => e.remove());
    d[q]('table,[role=grid]').forEach((e) => {
        e.setAttribute('style', 'outline:2px solid olive;');
    });
    d[q]('caption').forEach((e) => {
        e.setAttribute('style', 'outline:green 2px solid;padding:2px');
        createInfo(e, 2, `<caption>🎓`, 'openSpan', 'padding:1px;z-index:2147483647');
        createInfo(e, 3, `</caption>`, 'closeSpan');
    });
    d[q]('th').forEach((e) => {
        e.setAttribute('style', 'outline:green 2px solid;padding:2px');
        const attrs = [];
        let suffix = '♿';
        if (e.hasAttribute('scope')) {
            suffix = '';
            const scope = e.getAttribute('scope');
            attrs.push(`♿scope="${scope}"${(scope === 'row' ? '🚣' : '👇')}`);
            if (e.hasAttribute('id')) {
                attrs.push(` id="${e.getAttribute('id')}"`);
            } else if (e.hasAttribute('role')) {
                attrs.push(`♿role="${e.getAttribute('role')}"`);
            }
        } else if (e.hasAttribute('headers')) {
            suffix = '';
            attrs.push(`♿headers="${e.getAttribute('headers')}"`);
            if (e.hasAttribute('id')) {
                attrs.push(` id="${e.getAttribute('id')}"`);
            }
        } else if (e.hasAttribute('id')) {
            attrs.push(` id="${e.getAttribute('id')}"`);
        } else if (e.hasAttribute('role')) {
            suffix = '';
            attrs.push(`♿role="${e.getAttribute('role')}"`);
        }
        createInfo(e, 2, `<th${attrs.join(' ')}>${suffix}`, 'closeSpan', 'margin:0 2px;padding:2px');
    });
    d[q]('td').forEach((e) => {
        e.setAttribute('style', 'outline:orange 2px dashed;padding:2px;');
        const attrs = [];
        if (e.hasAttribute('headers')) {
            attrs.push(`♿headers="${e.getAttribute('headers')}"`);
            if (e.hasAttribute('role')) {
                attrs.push(`♿role="${e.getAttribute('role')}"`);
            }
        } else if (e.hasAttribute('role')) {
            attrs.push(`♿role="${e.getAttribute('role')}"`);
        }
        createInfo(e, 2, `<td${attrs.join(' ')}>`, 'closeSpan', 'margin:0 2px;padding:2px');
    });
    d[q]('table').forEach((e) => {
        const attrs = [];
        if (e.hasAttribute('summary')) {
            attrs.push(`♿summary="${e.getAttribute('summary')}"`);
        } else if (e.hasAttribute('aria-label')) {
            attrs.push(`♿aria-label="${e.getAttribute('aria-label')}"`);
        } else if (e.hasAttribute('aria-labelledby')) {
            attrs.push(`♿aria-labelledby="${e.getAttribute('aria-labelledby')}"`);
            const labelledbyValue = e.getAttribute('aria-labelledby');
            const labelledbyArray = labelledbyValue.split(' ');
            for (let i = 0; i < labelledbyArray.length; ++i) {
                d[q](`[id="${labelledbyArray[i]}"]`).forEach((id) => {
                    id.setAttribute('style', 'outline:orange 2px dashed');
                    createInfo(id, 2, `id="${labelledbyArray[i]}"`, 'inputSpan', 'padding:1px;outline:orange 2px dashed;z-index:2147483647');
                });
            }
        } else if (e.getAttribute('role') === 'presentation') {
            attrs.push('♿role="presentation"');
        }
        createInfo(e, 0, `<table${attrs.join(' ')}>`, 'closeSpan', 'margin:0 2px;padding:2px');
    });
    d[q]('[role=grid]').forEach((e) => {
        const attrs = ['♿role="grid"'];
        if (e.hasAttribute('aria-readonly')) {
            if (e.hasAttribute('aria-labelledby')) {
                attrs.push(`♿aria-labelledby="${e.getAttribute('aria-labelledby')}"`);
            } else if (e.hasAttribute('aria-label')) {
                attrs.push(`♿aria-label="${e.getAttribute('aria-label')}"`);
            }
            attrs.push(`♿aria-readonly="${e.getAttribute('aria-readonly')}"`);
        }
        createInfo(e, 0, attrs.join(' '), 'closeSpan', 'margin:0 2px;padding:2px');
    });
    d[q]('tr[role]').forEach((e) => {
        createInfo(e, 0, `<tr♿role="${e.getAttribute('role')}">`, 'closeSpan', 'margin:0 2px;padding:2px');
    });
    d[q]('td[headers],th[headers]').forEach((e) => {
        const describedbyValue = e.getAttribute('headers');
        const describedbyArray = describedbyValue.split(' ');
        for (let i = 0; i < describedbyArray.length; ++i) {
            if (!d.getElementById(describedbyArray[i])) {
                e.setAttribute('style', 'outline:red 2px dotted;padding:2px');
                createInfo(e, 3, '❌NO ID MATCH', 'closeSpan');
                break;
            }
        }
    });

    if (!d.querySelectorAll('table').length) {
        const status = d.createElement('strong');
        status[s]('style', 'color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:yellow;margin:0 2px; padding:2px;');
        status[s]('id', 'failure');
        status[s]('role', 'status');
        d.body.insertBefore(status, d.body.firstChild);
        status.textContent = `No Tables Found on Page: ${d.title}`;
        setTimeout(() => status.remove(), 6000);
    } else {
        const status = d.createElement('div');
        status[s]('style', 'position:absolute;width:0;height:0;clip:rect(0,0,0,0);');
        status[s]('id', 'success');
        status[s]('role', 'alert');
        d.body.appendChild(status);
        status.textContent = `Success! Images Found on Page: ${d.title}`;
        setTimeout(() => status.remove(), 3000);
    }

}(window, document, 'querySelectorAll', 'hasAttribute', 'getAttribute', 'setAttribute'));
