import { ErrorInfo, Info, recurse, reset, SuccessInfo, WarningInfo } from '../lib/info';

(function iefe(d, s) {
    reset();
    const sel = ['input:not([type="hidden"]):not([type="submit"]):not([type="reset"])', 'select', 'textarea'];
    const stl = 'position:absolute;line-height:100%;z-index:2147483647';
    for (const role of ['checkbox', 'combobox', 'listbox', 'menuitemcheckbox', 'menuitemradio', 'radio', 'searchbox', 'slider', 'spinbutton', 'switch', 'textbox']) {
        sel.push(`[role="${role}"]`);
    }
    const isNativeFormElement = function isNativeFormElement(el) {
        return ['input', 'textarea', 'select'].indexOf(el.tagName.toLowerCase()) >= 0;
    };
    const appendGlobalAttributes = function appendGlobalAttributes(el, str) {
        const strArray = [str];
        if (el.hasAttribute('autocomplete')) {
            strArray.push(`[autocomplete]: ${el.getAttribute('autocomplete')}`);
        }
        return strArray.join(' ⏵ ');
    };
    const computeIdRefsLabel = function computeIdRefsLabel(el, attrs) {
        for (const attr in attrs) {
            if (el.hasAttribute(attr)) {
                const attrVals = [];
                `${el.getAttribute(attr)}`.split(' ')
                    .forEach(i => {
                        if (i.length) {
                            const iEl = d.getElementById(i);
                            if (iEl) {
                                const iElStr = iEl.textContent;
                                if (iElStr.trim().length) {
                                    attrVals.push(iElStr);
                                }
                            }
                        }
                    });
                throw attrVals.length ?
                    new attrs[attr](el, 0, appendGlobalAttributes(el, `[${attr}]: ${attrVals.join('')}`), '', stl) :
                    new ErrorInfo(el, 0, appendGlobalAttributes(el, `Empty [${attr}]`), 'labelSpan', stl);
            }
        }
    };
    const computeForIdLabel = function computeForIdLabel(el) {
        const id = `${el.getAttribute('id')}`.trim();
        if (id.length) {
            const forLabels = d.querySelectorAll(`label[for="${id}"]`);
            if (forLabels.length) {
                const forLabelsStr = [];
                Array.from(forLabels)
                    .forEach(f => {
                        if (f.textContent.trim().length) {
                            forLabelsStr.push(f.textContent);
                        }
                    });
                throw forLabelsStr.length ?
                    new SuccessInfo(el, 0, appendGlobalAttributes(el, `label[for]: ${forLabelsStr.join('')}`), '', stl) :
                    new ErrorInfo(el, 0, appendGlobalAttributes(el, `Empty label[for]`), 'labelSpan', stl);
            }
        }
    };
    const computeClosestLabel = function computeClosestLabel(el) {
        const label = el.closest('label');
        if (label) {
            throw label.textContent.trim().length ?
                new SuccessInfo(el, 0, appendGlobalAttributes(el, `label: ${label.textContent}`), '', stl) :
                new ErrorInfo(el, 0, appendGlobalAttributes(el, `Empty label`), 'labelSpan', stl);
        }
    };
    const computeAttributeFormLabel = function computeAttributeFormLabel(el, attrs) {
        for (const attr in attrs) {
            if (el.hasAttribute(attr)) {
                const attrLabel = `${el.getAttribute(attr)}`;
                if (attrLabel.trim().length) {
                    throw new attrs[attr](el, 0, appendGlobalAttributes(el, `[${attr}]: ${attrLabel}`), '', stl);
                }
            }
        }
    };
    const computeFormLabel = function computeFormLabel(el) {
        // Test aria-labelledby & aria-describedby
        computeIdRefsLabel(el, {
            'aria-labelledby': SuccessInfo,
            'aria-describedby': SuccessInfo
        });
        // For native form elements only
        if (isNativeFormElement(el)) {
            computeForIdLabel(el);
            computeClosestLabel(el);
        }
        if (el.getAttribute('role') === 'checkbox') {
            const textContent = el.textContent;
            if (textContent.trim().length) {
                throw new SuccessInfo(el, 0, appendGlobalAttributes(el, `(content): ${textContent}`), '', stl);
            }
        }

        computeAttributeFormLabel(el, {
            'aria-label': SuccessInfo,
            title: WarningInfo,
            placeholder: WarningInfo
        });
    };
    const labelInfo = function labelInfo(el) {
        try {
            computeFormLabel(el);
            (new ErrorInfo(el, 0, appendGlobalAttributes(el, 'Empty accessible name'), 'labelSpan', stl)).create();
        } catch (info) {
            info.create();
        }
    };
    const count = recurse(labelInfo, sel.join(','));
    (new Info(
        d.documentElement,
        2,
        `Form fields found: ${count}`,
        null,
        'position:absolute',
    )).create(true);
}(document, 'setAttribute'));
