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
    "#ED0A3F", "#FF861F", "#FBE870", "#C5E17A", "#01A368",
    "#76D7EA", "#76D7EA", "#8359A3", "#AF593E", "#A36F40",
    "#FFAE42", "#FA9D5A", "#CD919E", "#FF3F34", "#CA3435",
    "#F653A6", "#0A6B0D", "#8B8680", "#03BB85", "#FFDF00",
    "#A78B00", "#788193", "#0095B6", "#C32148", "#01796F",
    "#E96792", "#FF91A4", "#6CDAE7", "#FFC800", "#BC6CAC",
    "#DCCCD7", "#EBE1C2", "#A6AAAE", "#B99685", "#0086A7",
    "#BC8777"
]
