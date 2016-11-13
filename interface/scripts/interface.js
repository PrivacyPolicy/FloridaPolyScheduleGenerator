const STEP_COUNT = 6;

// TODO fix tab indexes so that users can't half-scroll using tab

$(function() {
    if (DEBUG) {
        $("nav > div").click(function(event) {
            console.log("For testing: be sure to remove");
            toStep($(event.originalEvent.target).index());
        });
    }
    $("button#next").click(nextStep);
    $("button#back").click(prevStep);
});

function toStep(step) {
    // prevent invalid input
    step = Math.min(Math.max(step, 0), STEP_COUNT - 1);
    
    // highlight nav bar correctly
    var $links = $("nav > div");
    for (var i = 0; i < $links.length; i++) {
        if (i <= step) {
            $links.eq(i).addClass("done");
        } else {
            $links.eq(i).removeClass("done");
        }
    }
    
    // slide to the correct step div
    $("#steps")
        .css("left", (-100 * step) + "%")
        .attr("data-page", step + 1);
    
    // handle the end of the transition
    $("#steps").bind("transitionend", handleTransitionEnd);
    function handleTransitionEnd(event) {
        document.location.hash = "step" + (getCurStep() + 1);
        $("#steps").unbind("transitionend", handleTransitionEnd);
    }
    
    // update buttons
    $("button#next").prop("disabled", (step >= STEP_COUNT - 1));
    $("button#back").prop("disabled", (step < 1));
    
    // call specific step's visibliity functions
    switch (step + 1) {
        case 3:
            step3Init();
            break;
        default:
            break;
    }
}

function nextStep() {
    var curPage = getCurStep();
    (!isNaN(curPage)) ? toStep(curPage + 1) :
        console.error("Failed to navigate to next step");
}

function prevStep() {
    var curPage = getCurStep();
    (!isNaN(curPage)) ? toStep(curPage - 1) :
        console.error("Failed to navigate to prev step");
}

function getCurStep() {
    return parseInt($("#steps").attr("data-page")) - 1;
}