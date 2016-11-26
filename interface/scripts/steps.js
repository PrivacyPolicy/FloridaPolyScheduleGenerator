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
            for (conc in jsonCourseData[event.target.value]) {
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
            var data = jsonCourseData[$major.val()][value];
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
    var object = getCoursesFromStorage();
    if (!object) return {};
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
}
// get the data from the storage
function getCoursesFromStorage() {
    try {
        return JSON.parse(localStorage[ID + "_" + STEP + "1"]);
    } catch (e) {
        console.error(e);
        return null;
    }
}

// advanced settings
$(function() {
    loadAdvancedFromStorage();
    $("#advancedSettings > input").change(function(event) {
        saveAdvancedToStorage();
    });

    // controls to show/hide advanced settings
    var $advLink = $("#showAdvancedOption");
    $advLink.click(function(event) {
        if ($advLink.hasClass("show")) {
            $advLink.removeClass("show").addClass("hide");
            $("#advancedSettings").removeClass("show");
        } else {
            $advLink.removeClass("hide").addClass("show");
            $("#advancedSettings").addClass("show");
            // scroll to bottom to show settings
            $("#step1").scrollTop(700000);
        }
    });
});
function saveAdvancedToStorage() {
    var $advanced = $("#advancedSettings");
    var $checks = $advanced.find("input[type=checkbox]");
    var object = {};
    for (var i = 0; i < $checks.size(); i++) {
        var $check = $checks.eq(i);
        var value = $check[0].checked;
        value = $check.hasClass("negate") ? !value : value;
        object[$check.attr("id")] = value;
    }
    localStorage[ID + "_" + STEP + "_ADVANCED"] = JSON.stringify(object);
}
function getAdvancedFromStorage() {
    try {
        return JSON.parse(localStorage[ID + "_" + STEP + "_ADVANCED"]);
    } catch (e) {
        console.error(e);
        return null;
    }
}
function loadAdvancedFromStorage() {
    var object = getAdvancedFromStorage();
    if (!object) return {};
    for (var id in object) {
        var $check = $("#" + id);
        var neg = $check.hasClass("negate");
        $check[0].checked = (neg) ? !object[id] : object[id];
    }
}




// Step 3
function step3Init() {
    // find out which courses are takeable
    var data = getCoursesFromStorage();
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
    var courses = jsonCourseData[data.major][data.concentration];
    purgeCoursePrefs();
    // get advanced settings
    var advanced = getAdvancedFromStorage();

    loop1: for (var i = 0; i < courses.length; i++) {
        var course = courses[i];

        // if already taken
        if (courseWasTaken(takenCourses, course.id)) {
            continue loop1;
        }
        // if elective already taken
        if (!advanced["checkMultipleElectives"]) {
            for (var elective in course.electivesInGroup) {
                var c = course.electivesInGroup[elective];
                if (courseWasTaken(takenCourses, c)) {
                    continue loop1;
                }
            }
        }
        // if prereqs not met
        if (!advanced["checkAllowHalfCoRequisites"]) {
            loop2: for (var prereq in course.prereqs) {
                var c = course.prereqs[prereq];
                if (typeof c == "number") {
                    if (!courseWasTaken(takenCourses, c)) {
                        continue loop1;
                    }
                } else { // array, so OR them
                    // if at least one is being taken, we're good
                    for (var orPrereq in c) {
                        if (courseWasTaken(takenCourses, c[orPrereq])) {
                            continue loop2;
                        }
                    }
                    continue loop1;
                }
            }
        }

        // must be okay
        addCoursePref(data, course);
    }
    loadCoursePrefsFromStorage();
    saveCoursePrefsToStorage();
    $("#step3 input[type=radio]").click(function(event) {
        saveCoursePrefsToStorage();
    });
}
function courseWasTaken(takenCourses, id) {
    return !!takenCourses["course-" + id];
}
function addCoursePref(data, coursePrefObj) {
    var courses = jsonCourseData[data.major][data.concentration];
    for (var course in courses) {
        if (courses[course].id == coursePrefObj.id) break;
    }
    course = courses[course];
    var $coursePrefs = $("#coursePrefs");
    var copy = $coursePrefs.children().get(0).cloneNode(true);
    copy.id = "coursePref-" + coursePrefObj.id;
    var $copy = $(copy);
    $copy.removeClass("template");
    $copy.find(".coursePrefName").text(course.name)
        .attr("title", course.name + "\n" +
              course.description);
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
    $coursePrefs.append($copy);
}
function purgeCoursePrefs() {
    var $coursePrefs = $("#coursePrefs");
    $coursePrefs.html($coursePrefs.children().eq(0));
}

function saveCoursePrefsToStorage() {
    var object = {};
    $(".coursePref:not(.template)").each(function(i, elem) {
        var $elem = $(elem);
        object[$elem.attr("id")] =
            pref[$elem.find(":checked + label")[0].classList[0]];
    });
    localStorage[ID + "_" + STEP + "3"] = JSON.stringify(object);
}
function loadCoursePrefsFromStorage() {
    var data = getCoursePrefsFromStorage();
    if (!data) return {};
    $(".coursePref:not(.template)").each(function(i, elem) {
        var $elem = $(elem);
        var thePref = data[$elem.attr("id")];
        if (thePref == undefined) return;
        if (thePref == pref.unacceptable) {
            $elem.find(".unacceptable").click();
        } else if (thePref == pref.unfavored) {
            $elem.find(".unfavored").click();
        } else if (thePref == pref.favored) {
            $elem.find(".favored").click();
        } else if (thePref == pref.required) {
            $elem.find(".required").click();
        } else { // pref == pref.neutral
            $elem.find(".neutral").click();
        }
    });
    return data;
}
function getCoursePrefsFromStorage() {
    try {
        return JSON.parse(localStorage[ID + "_" + STEP + "3"]);
    } catch (e) {
        console.error(e);
        return null;
    }
}



// Step 5
function step5Init() {
    $("#generate").removeClass("hidden");
    $("#scheduleOutput").addClass("hidden");
    $("#generateStatus").addClass("hidden");
}
