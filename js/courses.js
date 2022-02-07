/*
    courses.js
    Authored by Ryan Pope <ryan@rcpope.net>
    Licensed under the GNU Public License, v3.0
*/

// set up event listeners for courses
function initCourseEvents(courseSelector) {
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

// set up event listeners for filters
function initFilterEvents(filterSelector) {
    $(filterSelector).each(function () {
        let cl = $(this).attr("data-classification"); // data-classification is set by php ajax request handler

        // filter hover highlights courses
        $(this).mouseenter(function () {
            $(".course--" + cl).addClass("course-active");
        });
        $(this).mouseleave(function () {
            $(".course").removeClass("course-active");
        });

        // filter select
        $(this).click(function () {

            // This function is intended to track the number of filters selected, as well as the number of filter matches for each course.

            // In AND mode, the # of filters selected must be equal to the # of filters matched for a certain course for it to be shown, 
            // reducing the total number of matches with each added filter.

            // In OR mode, a course must have at least 1 filter match to be shown, 
            // increasing the total number of matches with each added filter.

            // check if we are selecting the filter or deselecting it by checking the existing classes
            const delta = $(this).hasClass("filter-selected") ? -1 : 1;
            $(this).toggleClass("filter-selected");

            // increment result count for filter container (total number of filters selected)
            $(this).parent().attr("data-selected", parseInt($(this).parent().attr("data-selected")) + delta);

            $(".course--" + cl).each(function () {

                // increment match count (stored in data-selectedby) for each course
                let sb = parseInt($(this).attr("data-selectedby")) + delta;
                $(this).attr("data-selectedby", sb);

                // increment result count (stored in data-contains) for parent (.course-group)
                let pc = parseInt($(this).parent().attr("data-contains")) + delta;
                $(this).parent().attr("data-contains", pc);

                // increment result count (stored in data-contains) for results container (total number of results)
                let mc = parseInt($("#main-course-list").attr("data-contains")) + delta;
                $("#main-course-list").attr("data-contains", mc);
            });

        })
    });
}

function toggleCourseGroup(groupHeader) {
    $(groupHeader).parent().toggleClass("course-group--collapsed");
}

window.onload = function () {
    $.getJSON("https://api.rcpope.net/courses_json.php", function (data) {
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

            $(`.course-group[data-group="${group}"]`).append(`

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

            `);
        }

        for (const c of data.classifications) {
            $(".filter-group--class").append(`

                <div class="filter-item filter-item--${c.abbreviation}" data-classification="${c.abbreviation}">
                    <span class="icon-wrapper">${c.icon_html}</span>
                    <span class="filter-text">
                        ${c.longname}
                    </span>
                </div>

            `);
        }

        for (const l of data.languages) {
            $(".filter-group--lang").append(`

                <div class="filter-item filter-item--${l.abbreviation}" data-classification="${l.abbreviation}">
                    <span class="icon-wrapper">${l.icon_html}</span>
                    <span class="filter-text">
                        ${l.longname}
                    </span>
                </div>
                
            `);
        }

        initCourseEvents(".course");
        initFilterEvents(".filter-item");

        // select a couple filters so the results aren't empty on pageload
        $(".filter-item--imp").click();
        $(".filter-item--theo").click();

        // unhide the filters and results
        $(".filter-list").css("display", "flex");
        $("#main-course-list").attr("data-loading", "false");

        // hide the loading icons
        $(".loading-icon-container").css('display', 'none');


    });
}