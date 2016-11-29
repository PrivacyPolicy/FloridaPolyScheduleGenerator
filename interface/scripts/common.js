const ID = "FLORIDA_POLYTECHNIC_SCHEDULE_GENERATOR";
const STEP = "STEP";
const DEFAULT_SELECT = "Select one...";
var jsonCourseData = {}, jsonClassData = {};

// Load the course data from the scraped JSON
$(function() {
    const COURSE_URL = "external/output.json";
    const CLASS_URL = "external/class_output.json";
    var $major = $("#selectMajor"),
        $concentration = $("#selectConcentration"),
        $courses = $("#chooseCourses");

    // load course data from external file
    $.ajax({
        success: function(data, textStatus, jqXHR) {
            if (typeof data == "object") {
                jsonCourseData = data;
                init();
            } else {
                console.error("Course data loaded is not JSON");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (errorThrown == "") {
                // not using a server, using a file system
                jsonCourseData = tempBackCompData;
                init();
            } else {
                console.error("JSON course data failed to load: "
                              + errorThrown + ", " + textStatus);
            }
        },
        url: COURSE_URL,
        dataType: "json"
    });

    // load class data from external file
    $.ajax({
        success: function(data, textStatus, jqXHR) {
            if (typeof data == "object") {
                jsonClassData = data;
                init();
            } else {
                console.error("Class data loaded is not JSON");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (errorThrown == "") {
                // not using a server, using a file system
                jsonClassData = tempBackCompDataClasses;
                init();
            } else {
                console.error("JSON class data failed to load: "
                                + errorThrown + ", " + textStatus)
            }
        },
        url: CLASS_URL,
        dataType: "json"
    })

    var downloadedFiles = 0;
    function init() {
        if (++downloadedFiles == 2) {
            // do some step-specific stuff at startup
            purgeMajor();
            for (major in jsonCourseData) {
                addMajor(major);
            }
            loadCoursesFromStorage();

            // remove loading from center of screen
            $("#loading").addClass("hidden");

            // Go to the url's recomended step
            if (DEBUG) {
                var hash = parseInt(document.location.hash.substr(5));
                if (isNaN(hash)) hash = 1;
                toStep(hash - 1);
            } else {
                toStep(0);
            }
        }
    }

});

const COLORS = [
    "#ED0A3F", "#FF861F", "#FBE870", "#C5E17A", "#01A368",
    "#76D7EA", "#76D7EA", "#8359A3", "#AF593E", "#A36F40",
    "#FFAE42", "#FA9D5A", "#CD919E", "#FF3F34", "#CA3435",
    "#F653A6", "#0A6B0D", "#8B8680", "#03BB85", "#FFDF00",
    "#A78B00", "#788193", "#0095B6", "#C32148", "#01796F",
    "#E96792", "#FF91A4", "#6CDAE7", "#FFC800", "#BC6CAC",
    "#DCCCD7", "#EBE1C2", "#A6AAAE", "#B99685", "#0086A7",
    "#BC8777"
]
