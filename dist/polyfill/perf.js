"use strict";
// @license http://opensource.org/licenses/MIT
// copyright Paul Irish 2015
Object.defineProperty(exports, "__esModule", { value: true });
// Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
//   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp
// for relative values
// if you want values similar to what you'd get with real perf.now, place this towards the head
// of the page
// but in reality, you're just getting the delta between now() calls, so it's not terribly
// important where it's placed
var windowCopy = window;
(function () {
    if ('performance' in windowCopy === false) {
        windowCopy.performance = {};
    }
    Date.now = (Date.now || function () {
        return new Date().getTime();
    });
    if ('now' in windowCopy.performance === false) {
        var nowOffset_1 = Date.now();
        if (performance.timing && performance.timing.navigationStart) {
            nowOffset_1 = performance.timing.navigationStart;
        }
        windowCopy.performance.now = function now() {
            return Date.now() - nowOffset_1;
        };
    }
})();
