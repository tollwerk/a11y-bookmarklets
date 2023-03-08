import { ErrorInfo, recurse, reset, SuccessInfo } from "../lib/info";

(function iefe(d) {
    reset();
    const labelLang = function labelLang(el) {
        (new SuccessInfo(el, 2, `<code>lang="${el.getAttribute('lang')}"</code>`, null, stl)).create();
    };
    const xmlLang = d.getElementsByTagName('html')[0].getAttribute('xml:lang');
    const lang = d.documentElement.lang;
    const stl = 'position:absolute';
    const sections = ` and ${recurse(labelLang, '[lang]:not(html)')} element(s) with explicitly specified language`;
    if (xmlLang && lang) {
        (new SuccessInfo(d.documentElement, 2, `Document has <code>lang="${lang}"</code>, <code>xml:lang="${xmlLang}"</code>${sections}`, null, stl)).create();
    } else if (lang) {
        (new SuccessInfo(d.documentElement, 2, `Document has <code>lang="${lang}"</code>${sections}`, null, stl)).create();
    } else if (xmlLang) {
        (new SuccessInfo(d.documentElement, 2, `Document has <code>xml:lang="${xmlLang}"</code>${sections}`, null, stl)).create();
    } else {
        (new ErrorInfo(d.documentElement, 2, `Document has no <code>lang</code> or <code>xml:lang</code> attribute${sections}`, null, stl)).create();
    }
}(document));
