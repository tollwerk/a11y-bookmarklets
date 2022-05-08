(function iefe(w, d) {
    w.setTimeout(() => {
        d.querySelectorAll('*[media="screen"]').forEach((e) => e.setAttribute('media', ''));
        d.querySelectorAll('*[media="print"]').forEach((e) => e.remove());
    }, 2000);
}(window, document));
