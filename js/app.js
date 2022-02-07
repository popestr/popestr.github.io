/*
    app.js
    Authored by Ryan Pope <ryan@rcpope.net>
    Licensed under the GNU Public License, v3.0
*/

// change a CSS property, for a set of elements, for a specified period of time
function temporaryStyle(selector, property, value, delay) {
    let temp = $(selector).css(property);
    $(selector).css(property, value);
    setTimeout(function () {
        $(selector).css(property, temp);
    }, delay);
}