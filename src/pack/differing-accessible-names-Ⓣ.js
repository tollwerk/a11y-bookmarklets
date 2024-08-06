import { Info, SuccessInfo } from '../lib/info';
import { computeAccessibleName } from 'dom-accessibility-api';

(function iefe(d, s) {
    const sel = [];
    ['a[href]', 'button', 'input[type="submit"]', 'input[type="button"]', '[role="link"]', '[role="button"]'].forEach(s => {
        ['[aria-label]', '[aria-labelledby]'].forEach(l => sel.push(`${s}${l}`));
    });
    const table = [];
    d.querySelectorAll(sel.join(','))
        .forEach(e => {
            const text = e.textContent.trim();
            if (text.length) {
                table.push({
                    text,
                    accname: computeAccessibleName(e),
                    node: e
                });
            }
        });

    let msg;
    let type;
    if (!table.length) {
        type = Info;
        msg = 'No interactive elements with custom accName found on page';
    } else {
        type = SuccessInfo;
        msg = 'Interactive elements with custom accName found on page (see DevTools)';
        console.table(table);
    }

    (new type(d.body, 2, msg, null, 'position:fixed;top:0;left:0')).create(true);
}(document, 'setAttribute'));
