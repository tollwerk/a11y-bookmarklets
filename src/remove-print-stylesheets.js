(function iefe(w, d) {
    const el = d.createElement('script');
    el.type = "text/javascript";
    el.src = "http://code.jquery.com/jquery-latest.pack.js";
    d.body.appendChild(el);

    w.setTimeout(function () {
        $('*[media="screen"]').attr('media', '');
        $('*[media="print"]').remove();
    }, 2000);
})(window, document)
