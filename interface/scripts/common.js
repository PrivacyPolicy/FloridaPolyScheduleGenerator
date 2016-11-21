const ID = "FLORIDA_POLYTECHNIC_SCHEDULE_GENERATOR";
const STEP = "STEP";
const DEFAULT_SELECT = "Select one...";
var jsonData = {};

// Load the course data from the scraped JSON
$(function() {
    const JSON_URL = "external/output.json";
    var $major = $("#selectMajor"),
        $concentration = $("#selectConcentration"),
        $courses = $("#chooseCourses");
    $.ajax({
        success: function(data, textStatus, jqXHR) {
            if (typeof data == "object") {
                jsonData = data;
                init();
            } else {
                console.error("Data loaded is not JSON");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (errorThrown == "") {
                // not using a server, using a file system
                jsonData = tempBackCompData;
                init();
            } else {
                console.error("JSON course data failed to load: "
                              + errorThrown + ", " + textStatus);
            }
        },
        url: JSON_URL,
        dataType: "json"
    });

    function init() {
        // do some step-specific stuff at startup
        purgeMajor();
        for (major in jsonData) {
            addMajor(major);
        }
        loadCoursesFromStorage();

        // remove loading from center of screen
        $("#loading").addClass("hidden");

        // Go to the url's recomended step
        var hash = parseInt(document.location.hash.substr(5));
        if (isNaN(hash)) hash = 1;
        toStep(hash - 1);
    }

});

const COLORS = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "lightgray",
    "magenta",
    "maroon",
    "cyan",
    "skyblue",
    "aquamarine",
    "violet"
]
