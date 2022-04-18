(function iefe(d) {
    const ua = navigator.userAgent.toLowerCase();
    const iepos = ua.indexOf('msie');
    const ie = (iepos !== -1) ? ua.substr(iepos + 5, 1) : 0;
    const outlineProp = (ie < 8) ? 'border' : 'outline';
    let activeItem = null;

    function styleFocus(e) {
        if (activeItem && activeItem.style) {
            activeItem.style[outlineProp] = '';
        }
        activeItem = e.target || e.srcElement;
        if (activeItem && activeItem.style) {
            activeItem.style[outlineProp] = 'solid 2px red';
        }
    }

    if (d.addEventListener) {
        d.addEventListener('focus', styleFocus, true);
    } else {
        d.attachEvent('onfocusin', styleFocus);
    }
}(document));
