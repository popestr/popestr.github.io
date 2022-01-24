function temporaryStyle(selector, property, value, delay) {
    let temp = $(selector).css(property);
    $(selector).css(property, value);
    setTimeout(function() {
        $(selector).css(property, temp);
    }, delay);
}

function linkLegendRow(courseSelector) {
    $(courseSelector).each(function() {
        $(this).mouseenter(function() {
            $(".legend-row").removeClass("legend-active");
            let classes = $(this).attr("data-classifications"); // data-classifications is set by php ajax request handler
            if(classes !== undefined) {
                for(const cl of classes.split(" ")) {
                    $(".legend-row--"+cl).addClass("legend-active");
                }
            }
        });

        $(this).mouseleave(function() {
            $(".legend-row").removeClass("legend-active");
        });
    });
}

function linkCourses(legendSelector) {
    $(legendSelector).each(function() {
        $(this).mouseenter(function() {
            $(".course").removeClass("course-active");
            let cl = $(this).attr("data-classification"); // data-classification is set manually in courses.html
            $(".course--"+cl).addClass("course-active");
        });

        $(this).mouseleave(function() {
            $(".course").removeClass("course-active");
        });
    });
}