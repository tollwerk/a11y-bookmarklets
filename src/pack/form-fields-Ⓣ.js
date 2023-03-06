import { createError, createSuccess } from "../lib/info";

(function iefe(d, s) {
    const sel = ['input:not([type="hidden"])', 'select', 'textarea'];
    const stl = 'position:absolute;line-height:100%;z-index:2147483647';
    for (const role of ['checkbox', 'combobox', 'listbox', 'menuitemcheckbox', 'menuitemradio', 'radio', 'searchbox', 'slider', 'spinbutton', 'switch', 'textbox']) {
        sel.push(`[role="${role}"]`)
    }
    const computeForIdLabel = function computeForIdLabel(el) {
        const id = `${el.getAttribute('id')}`.trim();
        if (id.length) {
            const forLabels = d.querySelectorAll(`label[for="${id}"]`);
            if (forLabels.length) {
                return `label[for]: ${Array.from(forLabels).map(l => l.textContent).join('')}`;
            }
        }
        return '';
    }
    const computeClosestLabel = function computeClosestLabel(el) {
        const forElement = el.closest('label');
        if (forElement) {
            return `label: ${forElement.textContent}`;
        }
        return '';
    }
    const computeAttributeFormLabel = function computeAttributeFormLabel(el, attr) {
        if (el.hasAttribute(attr)) {
            const attrLabel = `${el.getAttribute(attr)}`;
            if (attrLabel.trim().length) {
                return `[${attr}]: ${attrLabel}`;
            }
        }
        return '';
    }
    const computeFormLabel = function computeFormLabel(el) {
        // For native form elements only
        if (['input', 'textarea', 'select'].indexOf(el.tagName.toLowerCase()) >= 0) {
            const label = computeForIdLabel(el) || computeClosestLabel(el);
            if (label.length) {
                return label;
            }
        }
        if (el.hasAttribute('aria-labelledby')) {
            const ariaLabelledBy = [];
            `${el.getAttribute('aria-labelledBy')}`.split(' ').forEach(i => {
                if (i.length) {
                    const iEl = d.getElementById(i);
                    if (iEl) {
                        const iElStr = iEl.textContent;
                        if (iElStr.trim().length) {
                            ariaLabelledBy.push(iElStr);
                        }
                    }
                }
            })
            if (ariaLabelledBy.length) {
                return `[aria-labelledby]: ${ariaLabelledBy.join('')}`;
            }
        }
        if (el.getAttribute('role') === 'checkbox') {
            const textContent = el.textContent;
            if (textContent.trim().length) {
                return `(content): ${textContent}`;
            }
        }

        return computeAttributeFormLabel(el, 'aria-label') || computeAttributeFormLabel(el, 'title') || computeAttributeFormLabel(el, 'placeholder');
    }
    d.querySelectorAll(sel.join(',')).forEach(e => {
        const label = computeFormLabel(e);
        (label.length ? createSuccess : createError)(e, 0, label || 'Empty accessible name', 'labelSpan', stl);
    })
}(document, 'setAttribute'));
