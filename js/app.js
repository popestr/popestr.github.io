function temporaryStyle(selector, property, value, delay) {
    let temp = $(selector).css(property);
    $(selector).css(property, value);
    setTimeout(function () {
        $(selector).css(property, temp);
    }, delay);
}