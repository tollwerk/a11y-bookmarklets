import { ErrorInfo, Info, reset, SuccessInfo, WarningInfo } from '../lib/info';
import { computeAccessibleName } from 'dom-accessibility-api';

(function iefe(d, s) {
    reset();
    const stl = 'position:absolute';
    const roleMappings = {
        header: 'banner',
        main: 'main',
        footer: 'contentinfo',
        nav: 'navigation',
        aside: 'complementary',
        search: 'search'
    };
    const roleCounter = {};

    const isElementVisible = function isElementVisible(element) {
        if (element.offsetWidth === 0 || element.offsetHeight === 0) {
            return false;
        }
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.visibility === 'hidden') {
            return false;
        }
        if (element.hasAttribute('hidden')) {
            return false;
        }
        return true;
    };

    // Find all landmark nodes
    const landmarkNodes = Array.from(d.querySelectorAll('header, main, footer, nav, aside, search,\n' +
        '[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"],\n' +
        '[role="search"], [role="form"], [role="region"]:not([aria-label=""]), [role="region"]:not([aria-labelledby=""]),\n' +
        'section[aria-label]:not([aria-label=""]), section[aria-labelledby]:not([aria-labelledby=""]),\n' +
        'article[aria-label]:not([aria-label=""]), article[aria-labelledby]:not([aria-labelledby=""])'))
        .filter(l => isElementVisible(l));

    // Filter out faux banner / complementary landmarks
    const landmarks = [];
    landmarkNodes.forEach(l => {
        const nodeName = l.nodeName.toLowerCase();
        for (let i = 0; i < landmarkNodes.length; i++) {
            if ((landmarkNodes[i] !== l) && landmarkNodes[i].contains(l)) {
                if ((nodeName === 'header') || (nodeName === 'footer')) {
                    return;
                }
                l.context = landmarkNodes[i];
            }
        }
        landmarks.push(l);
    });
    const table = [];
    const computeImplicitRole = function computeImplicitRole(landmark) {
        const nodeName = landmark.nodeName.toLowerCase();
        return roleMappings.hasOwnProperty(nodeName) ? `${roleMappings[nodeName]}` : 'region';
    };
    const processLandmark = function processLandmark(landmark) {
        landmark.roleName = landmark.getAttribute('role') || computeImplicitRole(landmark);
        landmark.roleExplicit = landmark.hasAttribute('role');
        landmark.accName = computeAccessibleName(landmark);
        if (roleCounter.hasOwnProperty(landmark.roleName)) {
            roleCounter[landmark.roleName].push(landmark);
        } else {
            roleCounter[landmark.roleName] = [landmark];
        }
        return {
            node: landmark,
            role: landmark.hasAttribute('role') ? landmark.roleName : `(${landmark.roleName})`,
            roledesc: landmark.getAttribute('aria-roledescription'),
            accname: landmark.accName,
            context: landmark.context,
            status: null
        };
    };
    const landmarkLabel = function landmarkLabel(landmark) {
        const label = [landmark.roleExplicit ? `[role=${landmark.roleName}]` : ` (${landmark.roleName}) `];
        if (landmark.hasAttribute('aria-labelledby')) {
            label.push('[aria-labelledby]');
        }
        if (landmark.hasAttribute('aria-label')) {
            label.push('[aria-label]');
        }
        return `${landmark.nodeName.toLowerCase()} ${label.join('')}`.trim() + `: "${landmark.accName}"`;
    };
    landmarks.forEach(l => table.push(processLandmark(l)));
    for (let r in roleCounter) {
        if (roleCounter[r].length == 1) {
            const info = (new SuccessInfo(roleCounter[r][0], 0, landmarkLabel(roleCounter[r][0]), null, stl)).create();
            roleCounter[r][0].style.outline = `2px solid ${info.style.backgroundColor}`;
            roleCounter[r][0].landmarkStatus = 'ok';
        } else {
            const accNames = {};
            roleCounter[r].forEach(l => {
                if (l.accName.length) {
                    if (!accNames.hasOwnProperty(l.accName)) {
                        accNames[l.accName] = 1;
                    } else {
                        accNames[l.accName]++;
                    }
                }
            });
            roleCounter[r].forEach(l => {
                const type = l.accName.length ? ((accNames[l.accName] > 1) ? WarningInfo : SuccessInfo) : ErrorInfo;
                const info = (new type(l, 0, landmarkLabel(l), null, stl)).create();
                l.style.outline = `2px solid ${info.style.backgroundColor}`;
                l.landmarkStatus = l.accName.length ? ((accNames[l.accName] > 1) ? 'warning' : 'ok') : 'error';
            });
        }
    }
    table.forEach(row => {
        row.status = row.node.landmarkStatus;
    });

    let msg;
    let type;
    if (!table.length) {
        type = Info;
        msg = 'No landmark regions found on page';
    } else {
        type = SuccessInfo;
        msg = `Landmark regions found on page: ${table.length} (see DevTools)`;
        console.table(table);
    }

    (new type(d.body, 2, msg, null, 'position:fixed;top:0;left:0')).create(true, true);
}(document, 'setAttribute'));
