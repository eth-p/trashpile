var Trashpile = (function () {
    function Trashpile() {
    }
    Trashpile.prototype.createNode = function (text, options) {
        var opt_trashMin = (options == null || options.trashMin == null ? 5 : options.trashMin);
        var opt_trashMax = (options == null || options.trashMax == null ? 10 : options.trashMax);
        var opt_realMin = (options == null || options.realMin == null ? 5 : options.realMin);
        var opt_realMax = (options == null || options.realMax == null ? 10 : options.realMax);
        var trashCount = opt_trashMin + Math.floor(Math.random() * (opt_trashMax - opt_trashMin));
        var realCount = opt_realMax + Math.floor(Math.random() * (opt_realMax - opt_realMin));
        var fragMin = Math.max(1, Math.floor(text.length / realCount) * 0.5);
        var fragMax = Math.max(1, Math.floor(text.length / realCount) * 3);
        var fragments = this._generateFragmentArrangement(realCount, text.length, fragMin, fragMax);
        var elements = this._generateElementArrangement(realCount, trashCount);
        var container = document.createElement('container');
        var index = 0;
        for (var i = 0; i < fragments.length; i++) {
            var size = fragments[i];
            fragments[i] = text.substring(index, index + size);
            index += size;
        }
        index = 0;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] === true) {
                container.appendChild(this._createRealNode(fragments[index++]));
            }
            else {
                container.appendChild(this._createFakeNode());
            }
        }
        container.setAttribute('data-trashpile', '');
        return container;
    };
    Trashpile.prototype.createGarbage = function (length) {
        return Math.random().toString(36).substring(2);
    };
    Trashpile.prototype._generateFragmentArrangement = function (count, itemTotal, itemMin, itemMax) {
        var fragmentSizes = new Array(count);
        var remaining = itemTotal;
        for (var i = 1; i < fragmentSizes.length; i++) {
            var size = Math.min(remaining, itemMin + Math.floor(Math.random() * (itemMax - itemMin)));
            fragmentSizes[i] = size;
            remaining -= size;
        }
        fragmentSizes[0] = remaining;
        this._shuffle(fragmentSizes);
        return fragmentSizes;
    };
    Trashpile.prototype._generateElementArrangement = function (realCount, fakeCount) {
        var arrangement = new Array(realCount + fakeCount);
        for (var i = 0; i < arrangement.length; i++) {
            arrangement[i] = i < realCount;
        }
        this._shuffle(arrangement);
        return arrangement;
    };
    Trashpile.prototype._createRealNode = function (text) {
        var element = document.createElement('span');
        var shadow = this._attachShadow(element) || element;
        if (shadow !== element) {
            element.appendChild(document.createTextNode(this.createGarbage()));
        }
        shadow.appendChild(document.createTextNode(text));
        return element;
    };
    Trashpile.prototype._createFakeNode = function () {
        var element = document.createElement('span');
        element.appendChild(document.createTextNode(this.createGarbage()));
        if (this._attachShadow(element) === null) {
            this._styleFakeNode(element);
        }
        return element;
    };
    Trashpile.prototype._attachShadow = function (element) {
        if (element.attachShadow != null) {
            return element.attachShadow({ mode: 'closed' });
        }
        else if (element.createShadowRoot != null) {
            return element.createShadowRoot();
        }
        else {
            return null;
        }
    };
    Trashpile.prototype._styleFakeNode = function (element) {
        var style = element.style;
        style.userSelect = 'none';
        style.msUserSelect = 'none';
        style.mozUserSelect = 'none';
        style.MozUserSelect = 'none';
        style.webkitUserSelect = 'none';
        style.WebkitUserSelect = 'none';
        style.userSelect = 'none';
        style.fontSize = '0px';
    };
    Trashpile.prototype._shuffle = function (arr) {
        var end = arr.length;
        while (end > 0) {
            var index = Math.floor(Math.random() * end--);
            var temp = arr[end];
            arr[end] = arr[index];
            arr[index] = temp;
        }
    };
    return Trashpile;
}());
export default Trashpile;
//# sourceMappingURL=trashpile.js.map