(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('prepend')) {
            return;
        }
        Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
                var argArr = Array.prototype.slice.call(arguments), docFrag = document.createDocumentFragment();
                argArr.forEach(function (argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });
                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
(function () {
    var css = 'html{background-color:#333;color:#ddd;}a{color:#cde;}';
    frame(document);

    function frame(d) {
        var style = d.createElement('style');
        style.className = 'wcagstyle';
        styleContent = d.createTextNode(css);
        style.appendChild(styleContent);
        d.getElementsByTagName('head')[0].prepend(style);
        var elem = d.querySelectorAll('iframe,frame');
        for (var i = 0; i < elem.length; i++) {
            d = elem[i].contentWindow.document;
            frame(d);
        }
    }
})();
