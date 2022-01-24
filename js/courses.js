function linkFilterItems(courseSelector) {
    $(courseSelector).each(function () {
        $(this).mouseenter(function () {
            let classes = $(this).attr("data-classifications") || ""; // data-classifications is set by php ajax request handler
            for (const cl of classes.split(" ")) {
                $(".filter-item--" + cl).addClass("filter-active");
            }
        });

        $(this).mouseleave(function () {
            $(".filter-item").removeClass("filter-active");
        });
    });
}

function linkCourses(filterSelector) {
    $(filterSelector).each(function () {
        let cl = $(this).attr("data-classification"); // data-classification is set by php ajax request handler
        $(this).mouseenter(function () {
            $(".course--" + cl).addClass("course-active");
        });

        $(this).mouseleave(function () {
            $(".course").removeClass("course-active");
        });

        $(this).click(function () {

            // This function is intended to track the number of filters selected, as well as the number of filter matches for each course.

            // In AND mode, the # of filters selected must be equal to the # of filters matched for a certain course for it to be shown, 
            // reducing the total number of matches with each added filter.

            // In OR mode, a course must have at least 1 filter match to be shown, 
            // increasing the total number of matches with each added filter.

            const delta = $(this).hasClass("filter-selected") ? -1 : 1;
            $(this).toggleClass("filter-selected");
            $(this).parent().attr("data-selected", parseInt($(this).parent().attr("data-selected")) + delta);

            $(".course--" + cl).each(function () {
                let sb = parseInt($(this).attr("data-selectedby")) + delta;
                $(this).attr("data-selectedby", sb);

                let pc = parseInt($(this).parent().attr("data-contains")) + delta;
                $(this).parent().attr("data-contains", pc);

                let mc = parseInt($("#main-course-list").attr("data-contains")) + delta;
                $("#main-course-list").attr("data-contains", mc);
            });

        })
    });
}

function toggleCourseGroup(groupHeader) {
    $(groupHeader).parent().toggleClass("course-group--collapsed");
}

$.getJSON("https://rcpope-net.000webhostapp.com/courses_json.php", function (data) {
    let last_sem = "Fall 1969";
    let courseOut = "";
    let languagesOut = "";
    let classificationOut = "";
    let group = -1;

    // This section is a little janky, and I'm okay with that for now.
    // Ideally, phase two of this redesign will involve a reactive framework, 
    // making all this DOM interpolation wizardry wholly unnecessary.
    for (const course of data.courses) {
        let group_header = "";

        if (course.semester != last_sem) {
            group++;
            group_header = `<div class="course-group-header" onclick="toggleCourseGroup(this)"><i class="fas fa-caret-down course-group-arrow"></i> ${course.semester}</div>`;
            last_sem = course.semester;
            $(".courses-list").append(`
                <div class="course-group" data-contains="0" data-group="${group}" >
                </div>
            `)
        }

        courseOut = `
        ${group_header}
        <div class="course ${course.course_classes}" data-classifications="${course.classification} ${course.languages}" data-selectedby="0">
            <span class="course-title">
                <span class="course-code">${course.course_code}</span>
                <span class="course-name">${course.course_topic || course.course_name}</span>
            </span>
            <span class="course-icons">
                <span class="course-classifications">
                    ${course.classification_icons || ""}
                </span>
                <span class="course-languages">
                    ${course.lang_icons || ""}
                </span>
            </span>
        </div>
        `;

        $(`.course-group[data-group="${group}"]`).append(courseOut);
    }

    for (const c of data.classifications) {
        classificationOut += `
        <div class="filter-item filter-item--${c.abbreviation}" data-classification="${c.abbreviation}">
            <span class="icon-wrapper">${c.icon_html}</span>
            <span class="filter-text">
                ${c.longname}
            </span>
        </div>
        `;
    }

    $(".filter-group--class").append(classificationOut);

    for (const l of data.languages) {
        languagesOut += `
        <div class="filter-item filter-item--${l.abbreviation}" data-classification="${l.abbreviation}">
            <span class="icon-wrapper">${l.icon_html}</span>
            <span class="filter-text">
                ${l.longname}
            </span>
        </div>
        `;
    }

    $(".filter-group--lang").append(languagesOut);

    linkFilterItems(".course"); // make hovering over a course highlight appropriate legend entries
    linkCourses(".filter-item"); // make overing over a legend entry highlight appropriate courses

    $(".filter-item--imp").click();
    $(".filter-item--theo").click();

    $(".filter-list").css("display", "flex");
    $("#main-course-list").attr("data-loading", "false");

    $(".loading-icon-container").css('display', 'none');


});