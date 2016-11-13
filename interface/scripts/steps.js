// Step 1 - Major, Concentration, and Courses
$(function() {
    var $major = $("#selectMajor"),
        $concentration = $("#selectConcentration"),
        $courses = $("#chooseCourses");
    $major.change(function(event) {
        purgeConcentration();
        var value = event.target.value;
        if (value != DEFAULT_SELECT) {
            $concentration.prop("disabled", false);
            for (conc in jsonData[event.target.value]) {
                addConcentration(conc);
            }
        } else {
            $concentration.attr("disabled", "disabled");
        }
        saveCoursesToStorage();
    });
    $concentration.change(function(event) {
        var value = event.target.value;
        purgeCourses();
        if (value != DEFAULT_SELECT) {
            var data = jsonData[$major.val()][value];
            for (var course in data) {
                addCourse(data[course]);
            }
            $(".course > input").change(selectCourse);
        }
        saveCoursesToStorage();
    });
});
function addMajor(major) {
    var $major = $("#selectMajor");
    var copy = $major.children().get(0).cloneNode(true);
    copy.id = "";
    var $copy = $(copy);
    $copy.removeClass("template");
    $copy.text(major);
    $copy.val(major);
    $major.append($copy);
}
function purgeMajor() {
    var $major = $("#selectMajor");
    $major.html($major.children().eq(0));
}
function addConcentration(concentration) {
    var $concentration = $("#selectConcentration");
    var copy = $concentration.children().get(0).cloneNode(true);
    copy.id = "";
    var $copy = $(copy);
    $copy.removeClass("template");
    $copy.text(concentration);
    $copy.val(concentration);
    $concentration.append($copy);
}
function purgeConcentration() {
    var $concentration = $("#selectConcentration");
    $concentration.html($concentration.children().eq(0));
}
function addCourse(courseObj) {
    var $courses = $("#chooseCourses");
    var copy = $courses.children().get(0).cloneNode(true);
    copy.id = "course-" + courseObj.id;
    var $copy = $(copy);
    $copy.removeClass("template");
    $copy.find(".courseName").text(courseObj.name);
    $copy.find("input").attr("name", courseObj.id);
    $copy.attr("title", courseObj.name);
//    $copy.attr("data-electives",courseObj.electivesInGroup);
    $courses.append($copy);
}
function purgeCourses() {
    var $courses = $("#chooseCourses");
    $courses.html($courses.children().eq(0));
}
function selectCourse(event) {
    // possibly select other classes in elective group?
    saveCoursesToStorage();
}

function saveCoursesToStorage() {
    var object = {
        "major": $("#selectMajor").val(),
        "concentration": $("#selectConcentration").val(),
        "courses": {}
    };
    $(".course:not(.template)").each(function(i, elem) {
        var $elem = $(elem);
        object.courses[$elem.attr("id")] =
            ($elem.find("input:checked").size() > 0);
    });
    localStorage[ID + "_" + STEP + "1"] = JSON.stringify(object);
}
function loadCoursesFromStorage() {
    try {
        var object = JSON.parse(localStorage[ID + "_" + STEP + "1"]);
        $("#selectMajor > [value='" + object.major + "']")
            .prop("selected", true).trigger("change");
        $("#selectConcentration > [value='" + object.concentration +
           "']")
            .prop("selected", true).trigger("change");
        $(".course:not(.template)").each(function(i, elem) {
            $(elem).find("input").get(0).checked =
                (object.courses[elem.id]);
        });
        saveCoursesToStorage();
        return object;
    } catch (e) {
        return {};
    }
}


// Step 3
function step3Init() {
    // find out which courses are takeable
    var data = loadCoursesFromStorage();
    if (!data.courses) {
        toStep(0);
        return;
    }
    if (data.major == DEFAULT_SELECT ||
        data.concentration == DEFAULT_SELECT) {
        toStep(0);
        return;
    }
    var takenCourses = data.courses;
    var courses = jsonData[data.major][data.concentration];
    purgeCoursePrefs();
    loop1: for (var i = 0; i < courses.length; i++) {
        var course = courses[i];
        
        // if already taken
        if (courseWasTaken(takenCourses, course.id)) continue;
        // if elective already taken
        if (!getAllowMultipleElectives()) {
            for (var elective in course.electivesInGroup) {
                var c = course.electivesInGroup[elective];
                if (courseWasTaken(takenCourses, c)) continue loop1;
            }
        }
        // if prereqs not met
        for (var prereq in course.prereqs) {
            var c = course.prereqs[prereq];
            if (!courseWasTaken(takenCourses, c)) continue loop1;
        }
        
        // must be okay
        addCoursePref(course);
    }
}
function courseWasTaken(takenCourses, id) {
    return !!takenCourses["course-" + id];
}
function getAllowMultipleElectives() {
    return false;
}
function addCoursePref(coursePrefObj) {
    var $coursePrefs = $("#coursePrefs");
    var copy = $coursePrefs.children().get(0).cloneNode(true);
    copy.id = "coursePref-" + coursePrefObj.id;
    var $copy = $(copy);
    $copy.removeClass("template");
    $copy.find(".coursePrefName").text(coursePrefObj.name);
    $copy.find("[name=coursePrefTemp]")
        .attr("name", "coursePref" + coursePrefObj.id);
    $copy.find("[id*=Temp]").each(function(i, elem) {
        elem.id = elem.id.split("Temp").join(
            coursePrefObj.id + Math.floor(i / 2));
    });
    $copy.find("[for*=Temp]").each(function(i, elem) {
        $(elem).attr("for", $(elem).attr("for").split("Temp").join(
            coursePrefObj.id + Math.floor(i / 2)));
    });
    if (coursePrefObj.pref == pref.unfavored) {
        $copy.find(".unfavored").prop("checked", true);
    } else if (coursePrefObj.pref == pref.neutral) {
        $copy.find(".neutral").prop("checked", true);
    } else if (coursePrefObj.pref == pref.favored) {
        $copy.find(".favored").prop("checked", true);
    }
    $coursePrefs.append($copy);
}
function purgeCoursePrefs() {
    var $coursePrefs = $("#coursePrefs");
    $coursePrefs.html($coursePrefs.children().eq(0));
}
