// Step 1 - Major, Concentration, and Courses
$(function() {
    const JSON_URL = "external/output.json";
    const DEFAULT_SELECT = "Select one...";
    var jsonData = {};
    var $major = $("#selectMajor"),
        $concentration = $("#selectConcentration");
    $.ajax({
        success: function(data, textStatus, jqXHR) {
            if (typeof data == "object") {
                jsonData = data;
                purgeMajor();
                for (major in data) {
                    addMajor(major);
                }
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
});


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
