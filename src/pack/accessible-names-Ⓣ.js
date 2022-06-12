import { computeAccessibleName } from "dom-accessibility-api";

(function iefe(d, s) {
    const sel = [];
    ['a[href]', 'button', '[role="link"]', '[role="button"]'].forEach(s => {
        ['[aria-label]', '[aria-labelledby]'].forEach(l => sel.push(`${s}${l}`));
    })
    const table = [];
    d.querySelectorAll(sel.join(',')).forEach(e => {
        const text = e.textContent.trim();
        if (text.length) {
            table.push({ text, accname: computeAccessibleName(e), node: e });
        }
    })
    if (!table.length) {
        const status = d.createElement('strong');
        status[s]('style', 'color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:yellow;margin:0 2px; padding:2px;');
        status[s]('id', 'failure');
        status[s]('role', 'status');
        d.body.insertBefore(status, d.body.firstChild);
        status.textContent = `No interactive elements with custom accname found on page: ${d.title}`;
        setTimeout(() => status.remove(), 6000);
    } else {
        const status = d.createElement('strong');
        // status[s]('style', 'position:absolute;width:0;height:0;clip:rect(0,0,0,0);');
        status[s]('style', 'color:black;font-weight:bold;font-family:sans-serif;font-size:small;background-color:yellow;margin:0 2px; padding:2px;');
        status[s]('id', 'success');
        status[s]('role', 'alert');
        d.body.insertBefore(status, d.body.firstChild);
        status.textContent = `Success! Interactive elements with custom accname found on page: ${d.title} (see DevTools)`;
        setTimeout(() => status.remove(), 3000);
        console.table(table);
    }
}(document, 'setAttribute'));
