const ID = "FLORIDA_POLYTECHNIC_SCHEDULE_GENERATOR";
const STEP = "STEP";
// Step 1 - Major, Concentration, and Courses
$(function() {
    const JSON_URL = "external/output.json";
    const DEFAULT_SELECT = "Select one...";
    var jsonData = {};
    var $major = $("#selectMajor"),
        $concentration = $("#selectConcentration"),
        $courses = $("#chooseCourses");
    $.ajax({
        success: function(data, textStatus, jqXHR) {
            if (typeof data == "object") {
                jsonData = data;
                purgeMajor();
                for (major in data) {
                    addMajor(major);
                }
                loadCoursesFromStorage();
                
                // remove loading from center of screen
                $("#loading").addClass("hidden");
            } else {
                console.error("Data loaded is not JSON");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("JSON course data failed to load: "
                          + errorThrown + ", " + textStatus);
        },
        url: JSON_URL,
        dataType: "json"
    });
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
    function addMajor(major) {
        var copy = $major.children().get(0).cloneNode(true);
        copy.id = "";
        var $copy = $(copy);
        $copy.removeClass("template");
        $copy.text(major);
        $copy.val(major);
        $major.append($copy);
    }
    function purgeMajor() {
        $major.html($major.children().eq(0));
    }
    function addConcentration(concentration) {
        var copy = $concentration.children().get(0).cloneNode(true);
        copy.id = "";
        var $copy = $(copy);
        $copy.removeClass("template");
        $copy.text(concentration);
        $copy.val(concentration);
        $concentration.append($copy);
    }
    function purgeConcentration() {
        $concentration.html($concentration.children().eq(0));
    }
    function addCourse(courseObj) {
        var copy = $courses.children().get(0).cloneNode(true);
        copy.id = "course-" + courseObj.id;
        var $copy = $(copy);
        $copy.removeClass("template");
        $copy.find(".courseName").text(courseObj.name);
        $copy.find("input").attr("name", courseObj.id);
        $copy.attr("title", courseObj.name);
//        $copy.attr("data-electives",courseObj.electivesInGroup);
        $courses.append($copy);
    }
    function purgeCourses() {
        $courses.html($courses.children().eq(0));
    }
    function selectCourse(event) {
        // possibly select other classes in elective group?
        saveCoursesToStorage();
    }
});

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
function addClasses(courses) {
    var $course = $(".courseOption").first();
    $course.parent().html($course);
    for (var i = courses.length - 1; i >= 0; i--) {
        var newCourse = $course.get(0).cloneNode(true);
        newCourse.getElementsByClassName("courseName")[0].innerHTML =
            courses[i].name;
        newCourse.children[1].id = "courseNum" + courses[i].id;
        $course.after(newCourse);
    }
    if (courses.length > 0) $(".courseOption").first().remove();
}

$(function() {
    addClasses([
        {id: "01", name:"Course1"},
        {id: "02", name:"Course2"},
        {id: "03", name:"Course3"},
        {id: "04", name:"Course4"},
        {id: "05", name:"Course5"},
        {id: "06", name:"Course6"}]);
});
