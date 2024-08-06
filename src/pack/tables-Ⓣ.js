import { Info, SuccessInfo } from '../lib/info';

(function iefe(d, q, h, g, s) {
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

    d[q]('span.openSpan,span.closeSpan,span.inputSpan')
        .forEach((e) => e.remove());
    d[q]('table,[role=grid]')
        .forEach((e) => {
            e[s]('style', 'outline:2px solid olive;');
        });
    d[q]('caption')
        .forEach((e) => {
            e[s]('style', 'outline:green 2px solid;padding:2px');
            createInfo(e, 2, `<caption>🎓`, 'openSpan', 'padding:1px;z-index:2147483647');
            createInfo(e, 3, `</caption>`, 'closeSpan');
        });
    d[q]('th')
        .forEach((e) => {
            e[s]('style', 'outline:green 2px solid;padding:2px');
            const attrs = [];
            let suffix = '♿';
            if (e[h]('scope')) {
                suffix = '';
                const scope = e[g]('scope');
                attrs.push(`♿scope="${scope}"${(scope === 'row' ? '🚣' : '👇')}`);
                if (e[h]('id')) {
                    attrs.push(` id="${e[g]('id')}"`);
                } else if (e[h]('role')) {
                    attrs.push(`♿role="${e[g]('role')}"`);
                }
            } else if (e[h]('headers')) {
                suffix = '';
                attrs.push(`♿headers="${e[g]('headers')}"`);
                if (e[h]('id')) {
                    attrs.push(` id="${e[g]('id')}"`);
                }
            } else if (e[h]('id')) {
                attrs.push(` id="${e[g]('id')}"`);
            } else if (e[h]('role')) {
                suffix = '';
                attrs.push(`♿role="${e[g]('role')}"`);
            }
            createInfo(e, 2, `<th${attrs.join(' ')}>${suffix}`, 'closeSpan', 'margin:0 2px;padding:2px');
        });
    d[q]('td')
        .forEach((e) => {
            e[s]('style', 'outline:orange 2px dashed;padding:2px;');
            const attrs = [];
            if (e[h]('headers')) {
                attrs.push(`♿headers="${e[g]('headers')}"`);
                if (e[h]('role')) {
                    attrs.push(`♿role="${e[g]('role')}"`);
                }
            } else if (e[h]('role')) {
                attrs.push(`♿role="${e[g]('role')}"`);
            }
            createInfo(e, 2, `<td${attrs.join(' ')}>`, 'closeSpan', 'margin:0 2px;padding:2px');
        });
    d[q]('table')
        .forEach((e) => {
            const attrs = [];
            if (e[h]('summary')) {
                attrs.push(`♿summary="${e[g]('summary')}"`);
            } else if (e[h]('aria-label')) {
                attrs.push(`♿aria-label="${e[g]('aria-label')}"`);
            } else if (e[h]('aria-labelledby')) {
                attrs.push(`♿aria-labelledby="${e[g]('aria-labelledby')}"`);
                const labelledbyValue = e[g]('aria-labelledby');
                const labelledbyArray = labelledbyValue.split(' ');
                for (let i = 0; i < labelledbyArray.length; ++i) {
                    d[q](`[id="${labelledbyArray[i]}"]`)
                        .forEach((id) => {
                            id[s]('style', 'outline:orange 2px dashed');
                            createInfo(id, 2, `id="${labelledbyArray[i]}"`, 'inputSpan', 'padding:1px;outline:orange 2px dashed;z-index:2147483647');
                        });
                }
            } else if (e[g]('role') === 'presentation') {
                attrs.push('♿role="presentation"');
            }
            createInfo(e, 0, `<table${attrs.join(' ')}>`, 'closeSpan', 'margin:0 2px;padding:2px');
        });
    d[q]('[role=grid]')
        .forEach((e) => {
            const attrs = ['♿role="grid"'];
            if (e[h]('aria-readonly')) {
                if (e[h]('aria-labelledby')) {
                    attrs.push(`♿aria-labelledby="${e[g]('aria-labelledby')}"`);
                } else if (e[h]('aria-label')) {
                    attrs.push(`♿aria-label="${e[g]('aria-label')}"`);
                }
                attrs.push(`♿aria-readonly="${e[g]('aria-readonly')}"`);
            }
            createInfo(e, 0, attrs.join(' '), 'closeSpan', 'margin:0 2px;padding:2px');
        });
    d[q]('tr[role]')
        .forEach((e) => {
            createInfo(e, 0, `<tr♿role="${e[g]('role')}">`, 'closeSpan', 'margin:0 2px;padding:2px');
        });
    d[q]('td[headers],th[headers]')
        .forEach((e) => {
            const describedbyValue = e[g]('headers');
            const describedbyArray = describedbyValue.split(' ');
            for (let i = 0; i < describedbyArray.length; ++i) {
                if (!d.getElementById(describedbyArray[i])) {
                    e[s]('style', 'outline:red 2px dotted;padding:2px');
                    createInfo(e, 3, '❌NO ID MATCH', 'closeSpan');
                    break;
                }
            }
        });

    const tables = d.querySelectorAll('table').length;
    if (tables) {
        (new SuccessInfo(d.body, 2, `Tables found on page: ${tables}`, null, 'position:fixed;top:0;left:0')).create(true);
    } else {
        (new Info(d.body, 2, 'No tables found on page', null, 'position:fixed;top:0;left:0')).create(true);
    }

})(document, 'querySelectorAll', 'hasAttribute', 'getAttribute', 'setAttribute');
