$(function() {
    $("#generate").click(function() {
        console.log("Generating Schedules");
        // get all of the options from the page inputs
        // start the generation in a worker
        // show the progress dialog
        // calculate ranking
        // when finished, show first, highest-ranked schedule
    });
    $("#generateCancel").click(function() {
        console.log("Cancel Generating");
    });
});
