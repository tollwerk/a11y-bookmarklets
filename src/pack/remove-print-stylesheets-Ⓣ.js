import { Info, SuccessInfo } from '../lib/info';

(function iefe(w, d) {
    d.querySelectorAll('*[media="screen"]')
        .forEach((e) => e.setAttribute('media', ''));
    const printStylesheets = d.querySelectorAll('*[media="print"]');
    if (printStylesheets.length) {
        printStylesheets.forEach((e) => e.remove());
        (new SuccessInfo(d.body, 2, `Print stylesheets removed: ${printStylesheets.length}`, null, 'position:fixed;top:0;left:0')).create(true);
    } else {
        (new Info(d.body, 2, 'No print stylesheets found on page', null, 'position:fixed;top:0;left:0')).create(true);
    }
}(window, document));
