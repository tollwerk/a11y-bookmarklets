(function iefe(d, h, g, s) {
    function createInfo(el, pos, str, cls, stl) {
        const info = d.createElement('span');
        info.className = cls;
        info[s]('style', `color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:yellow;speak:literal-punctuation;${stl}`);
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
        }
        return info;
    }

    function createRegion(title, el, pos, str, cls, stl) {
        const region = createInfo(el, pos, str, cls, stl);
        region[s]('role', 'region');
        region[s]('aria-label', title);
        return region;
    }

    function isLinked(el) {
        return el.parentNode && ((el.parentNode.tagName === 'A') || isLinked(el.parentNode));
    }

    d.querySelectorAll('.altSpan, .axSpan, .closeSpan').forEach(e => e.remove());
    d.querySelectorAll('a[alt], button[alt], label[alt]').forEach(e => createInfo(
        e,
        0,
        `INVALID❌alt = "${e[g]('alt')}" on " + ${e.tagName}`,
        'altSpan'
    ));
    const images = d.querySelectorAll('img, [role=img]');
    images.forEach(e => {
        if (e[h]('role')) {
            createInfo(
                e,
                1,
                `❓role="${e[g]('role')}"`,
                'closeSpan',
                'outline:orange 2px dashed;margin:0 2px;padding:2px;',
            );
        }
        if (e[h]('aria-label')) {
            createInfo(
                e,
                1,
                `❓aria-label="${e[g]('aria-label')}"`,
                'closeSpan',
                'outline:orange 2px dashed;margin:0 2px;padding:2px;',
            );
        }
        if (e[h]('aria-describedby')) {
            const describedbyValue = e[g]('aria-describedby');
            createInfo(
                e,
                1,
                `❓aria-describedby="${describedbyValue}"`,
                'axSpan',
                'outline:orange 2px dashed;margin:0 2px;padding:2px;',
            );
            const describedbyArray = describedbyValue.split(' ');
            for (let i = 0; i < describedbyArray.length; i += 1) {
                const describedby = d.getElementById(describedbyArray[i]);
                if (describedbyValue) {
                    describedby[s]('style', 'outline:orange 2px dashed;');
                    createInfo(
                        e,
                        2,
                        `❓id="${describedbyArray[i]}"`,
                        'inputSpan',
                        'outline:orange 2px dashed;padding:1px;z-index:2147483647;',
                    );
                }
            }
        }
        if (e[h]('aria-labelledby')) {
            const labelledbyValue = e[g]('aria-labelledby');
            createInfo(
                e,
                1,
                `❓aria-labelledby="${labelledbyValue}"`,
                'closeSpan',
                'outline:orange 2px dashed;margin:0 2px;padding:2px;',
            );
            const labelledbyArray = labelledbyValue.split(' ');
            for (let i = 0; i < labelledbyArray.length; i += 1) {
                const labelledby = d.getElementById(labelledbyArray[i]);
                if (labelledbyValue) {
                    labelledby[s]('style', 'outline:orange 2px dashed;');
                    createInfo(
                        e,
                        2,
                        `❓id="${labelledbyArray[i]}"`,
                        'inputSpan',
                        'outline:orange 2px dashed;padding:1px;z-index:2147483647;',
                    );
                }
            }
        }
        e[s]('style', 'outline:green 2px solid;padding:2px;');
        if (!e[h]('alt')) {
            const relevant = !e[h]('aria-label') && !e[h]('aria-labelledby')
                && !e[h]('aria-describedby') && !e[h]('title');
            if (isLinked(e)) {
                if (relevant) {
                    createInfo(
                        e,
                        0,
                        `LINK IMG❌NO ALT`,
                        'altSpan',
                        'outline:red 2px solid;padding:1px;position:absolute;line-height:100%;z-index:2147483647;border-bottom:2px solid blue;',
                    );
                }
            } else if (relevant) {
                e[s]('style', 'outline:red 2px solid;padding:2px;');
                createInfo(
                    e,
                    0,
                    `IMG❌NO ALT`,
                    'altSpan',
                    'outline:red 2px solid;padding:1px;position:absolute;line-height:100%;z-index:2147483647;',
                );
            }
        } else {
            if (isLinked(e)) {
                const decorative = e[g]('alt') === '';
                createInfo(
                    e,
                    0,
                    decorative ? 'LINK IMG❓alt=""❓' : `LINK IMG👍alt="${e[g]('alt')}"`,
                    'altSpan',
                    'outline:orange 2px dashed;padding:1px;position:absolute;line-height:100%;z-index:2147483647;border-bottom:2px solid blue;',
                );
            } else {
                createInfo(
                    e,
                    0,
                    `IMG👍alt="${e[g]('alt')}"❓`,
                    'altSpan',
                    'outline:orange 2px dashed;padding:1px;position:absolute;line-height:100%;z-index:2147483647;',
                );
            }
        }
        if (e[h]('title')) {
            createRegion(
                'Title',
                e,
                1,
                `❓title="${e[g]('title')}"`,
                'axSpan',
                'outline:orange 2px dashed;padding:1px;position:relative;line-height:100%;z-index:2147483647;',
            );
        }
        if (e[h]('longdesc')) {
            createRegion(
                'Long description',
                e,
                1,
                `❓longdesc="${e[g]('longdesc')}"`,
                'axSpan',
                'outline:orange 2px dashed;padding:1px;position:relative;line-height:100%;z-index:2147483647;',
            );
        }
    });

    if (!images.length) {
        const status = d.createElement('strong');
        status[s]('style', 'color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:yellow;margin:0 2px; padding:2px;')
        status[s]('id', 'failure');
        status[s]('role', 'status');
        d.body.insertBefore(status, d.body.firstChild);
        status.textContent = `No Images Found on Page: ${d.title}`;
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
})(document, 'hasAttribute', 'getAttribute', 'setAttribute');
