import { Info, recurse, reset, SuccessInfo } from '../lib/info';

(function iefe(d) {
    reset();
    const labelLang = function labelLang(el) {
        (new Info(
            el,
            2,
            `<code>[lang="${el.getAttribute('lang')}"]</code>`,
            null,
            stl
        )).create();
    };
    const xmlLang = d.getElementsByTagName('html')[0].getAttribute('xml:lang');
    const lang = d.documentElement.lang;
    const stl = 'position:absolute';
    const stla = 'position:fixed;top:0;left:0';
    const explicit = recurse(labelLang, '[lang]:not(html)');
    const sections = ` and ${explicit} element(s) with explicitly specified language`;
    if (xmlLang && lang) {
        (new SuccessInfo(
            d.body,
            2,
            `Document has <code>lang="${lang}"</code>, <code>xml:lang="${xmlLang}"</code>${sections}`,
            null,
            stla
        )).create(true, !!explicit);
    } else if (lang) {
        (new SuccessInfo(
            d.body,
            2,
            `Document has <code>lang="${lang}"</code>${sections}`,
            null,
            stla
        )).create(true, !!explicit);
    } else if (xmlLang) {
        (new SuccessInfo(
            d.body,
            2,
            `Document has <code>xml:lang="${xmlLang}"</code>${sections}`,
            null,
            stla
        )).create(true, !!explicit);
    } else {
        (new Info(
            d.body,
            2,
            `Document has no <code>lang</code> or <code>xml:lang</code> attribute${sections}`,
            null,
            stla
        )).create(true, !!(xmlLang || lang));
    }
}(document));
