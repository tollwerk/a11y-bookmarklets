import { createSuccess } from "../lib/info";

(function iefe(d, s) {
    const computeFormLabel = function computeFormLabel(el) {
        return 'label';
    }

    const sel = ['input:not([type="hidden"])', 'select', 'textarea'];
    d.querySelectorAll(sel.join(',')).forEach(e => {
        createSuccess(
            e,
            0,
            computeFormLabel(),
            'labelSpan',
            'position:absolute;line-height:100%;z-index:2147483647;'
        );
    })
}(document, 'setAttribute'));
