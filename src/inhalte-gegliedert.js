(function () {
    var to = new Array({ n: 'H1', c: '#ff0000', p: 0 }, { n: 'H2', c: '#713939', p: 0 }, {
        n: 'H3',
        c: '#00aa00',
        p: 0
    }, { n: 'H4', c: '#054164', p: 0 }, { n: 'H5', c: '#7F0A7F', p: 0 }, { n: 'H6', c: '#01D901', p: 0 }, {
        n: 'P',
        c: '#1515C0',
        p: 0
    }, { n: 'B', c: '#00D400', p: 0 }, { n: 'I', c: '#5A005A', p: 0 }, { n: 'EM', c: '#4E6401', p: 0 }, {
        n: 'TABLE',
        c: '#365F5F',
        p: 1
    }, { n: 'LEGEND', c: '#28025D', p: 0 }, { n: 'STRONG', c: '#DE1A00', p: 0 }, { n: 'FIELDSET', c: '#800000', p: 1 });

    function hT(w, to) {
        var t = w.document.getElementsByTagName(to.n);
        for (var i = 0; i < t.length; i++) {
            if (to.p == 0) {
                t[i].insertBefore(cT(w, to, ''), t[i].firstChild);
                t[i].appendChild(cT(w, to, '/'));
            } else {
                t[i].parentNode.insertBefore(cT(w, to, ''), t[i]);
                t[i].parentNode.insertBefore(cT(w, to, '/'), t[i].nextSibling);
            }
        }
    }

    function cT(w, to, slash) {
        var s = w.document.createElement('span');
        var z = s.style;
        z.color = to.c;
        z.backgroundColor = '#fff';
        z.backgroundImage = 'none';
        z.fontSize = '14px';
        z.fontWeight = 'bold';
        var tn = w.document.createTextNode(' [' + slash + to.n + '] ');
        s.insertBefore(tn, s.firstChild);
        return s;
    }

    function traverse(w) {
        try {
            for (var i = 0; i < to.length; i++) hT(w, to[i]);
            for (var i = 0; i < w.frames.length; i++) traverse(w.frames[i]);
        } catch (e) {
        }
    }

    traverse(window);
})();
