(function iefe(d) {
    const ua = navigator.userAgent.toLowerCase()
    const ie = (ua.indexOf('msie') != -1) ? ua.substr(ie + 5, 1) : 0;
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
