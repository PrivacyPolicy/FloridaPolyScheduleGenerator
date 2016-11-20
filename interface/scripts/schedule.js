const HOUR_HEIGHT = 50;
// handle canvas display of acceptable/favored times
$(function() {

    // Show the vertical day columns
    var showWeekends = getShowWeekends();
    var i = (showWeekends) ? 0 : 1;
    var end = (showWeekends) ? 7 : 6;
    var $times = $(".scheduleTimes");
    var lineTemplate = $("#vertLineTemplate").get(0);
    const TIME_MARGIN = 10;
    for (; i < end; i++) {
        // add weekdays to the top
        $times.append("<div>" + DAYS[i] + "</div>");

        // add the vertical lines
        var copy = lineTemplate.cloneNode(true);
        copy.id = "";

        var $copy = $(copy).removeClass("template");

        // calculate left position
        var left = 10 + (90/ ((showWeekends) ? 7 : 5) ) *
            (i - (showWeekends ? 0 : 1) );
        $copy.css({left: left + "%"});

        $(".scheduleBackground").append($copy);
    }

    // Show the horizontal time lines
    var end = getMaxTime() + 1;
    var template = $("#timeLineTemplate").get(0);
    var millTime = getMillitaryTimePref();
    for (var i = getMinTime(); i < end; i++) {
        var copy = template.cloneNode(true);
        copy.id = "";

        var $copy = $(copy).removeClass("template");
        $copy.find(".time").text(strFromTime({h: i, m: 0}));

        $(".scheduleBackground").append($copy);
    }

    // drawSchedule([...]);
    var data = loadTimesFromStorage();
    if (data.length == 0) {
        refreshSchedule();
    } else {
        addEventListeners();
    }
    $(document.body).keydown(keyHandler);
    var $fore = $("#scheduleInput .scheduleForeground");
    $fore.click(function(event) {
        if ($(event.originalEvent.target).is($fore)) {
            // get nearest 15 minutes to click location
            var step = HOUR_HEIGHT / 4;
            var newY = Math.round(event.offsetY / step) * step;
            var stepX = $fore.width() / (getShowWeekends() ? 7 : 5);
            var newX = Math.floor(event.offsetX / stepX) * stepX;
            var width = (100 / (getShowWeekends() ? 7 : 5));
            // place whichColor there (reset and all)
            $("#whichColor").css({
                left: (newX + 1) + "px",
                top: newY + "px",
                width: width + "%"
            });
        }
    });
    $("#whichColor").click(function(event) {
        var $elem = $(event.originalEvent.target);
        var fav = $elem.is("#chooseFavored");
        $(event.currentTarget).addClass(fav ? "favored" : "unfavored");
    }).on("transitionend", function(event) {
        $elem = $("#whichColor");
        if ($elem.hasClass("favored") || $elem.hasClass("unfavored")) {
            // get top location
            var y = parseFloat($elem.css("top"));
            var stepX = $fore.width() / (getShowWeekends() ? 7 : 5);
            var weekday = Math.floor(
                parseFloat($elem.css("left")) / stepX) +
                (getShowWeekends() ? 0 : 1);
            // add real slot at that location
            var h = Math.floor(y / HOUR_HEIGHT) + getMinTime();
            var m = (y % HOUR_HEIGHT) / HOUR_HEIGHT * 60;
            addSlot($("#scheduleInput"), weekday, {h: h, m: m},
                    {h: h + 1, m: m}, $elem.hasClass("favored"));
            saveTimesToStorage();
            loadTimesFromStorage();
            addEventListeners();
            // remove this one's class
            $elem.removeClass("favored").removeClass("unfavored");
            // hide this one
            hideWhichColor();
        }
    });
    $("#scheduleReset").click(function(event) {
        if (confirm("Are you sure you want to reset the times?")) {
            refreshSchedule();
        }
    });
});
function getMinTime() {
    return 7;
}
function getMaxTime() {
    return 12 + 9;
}
function getMillitaryTimePref() {
    return false;
}
function getShowWeekends() {
    return false;
}


function addSlot($elem, day, start, end, favored) {
    if (!getShowWeekends()) {
        if (day == 0 || day == 6) {
            return;
        } else {
            day -= 1;
        }
    }
    // calculate values
    const HEIGHT = 50;
    const WIDTH_MARGIN = 1;
    var width = (100 / (getShowWeekends() ? 7 : 5));
    var left = width * day;
    var top = HEIGHT *
        ( (start.h - getMinTime()) + start.m / 60);
    var height = HEIGHT *
        ( (end.h - start.h) + (end.m - start.m) / 60 );
    var millTime = getMillitaryTimePref();

    // copy the time slot element
    var copy = $("#timeSlotTemplate").get(0).cloneNode(true);
    copy.id = "";
    $copy = $(copy).removeClass("template");

    // set the values
    $copy.css({
        left: "calc(" + left + "% + " + WIDTH_MARGIN + "px)",
        top: top + "px",
        height: height + "px",
        width: "calc(" + width + "% - 2 * " + WIDTH_MARGIN + "px + 1px)"
    });
    updateStartTime($copy, start);
    updateEndTime($copy, end);
    $copy.addClass(favored ? "favored" : "unfavored");
    $copy.attr("data-day", getShowWeekends() ? day : day + 1);

    // add the newly created slot to the view
    $elem.find(".scheduleForeground").append($copy);
    return $copy;
}

function to2Str(number) {
    return (number < 10) ? "0" + number : "" + number;
}

function addEventListeners() {
    var initX = 0;
    var initY = 0;
    var offsetXs = 0;
    var offsetYs = 0;
    var draggingElems;
    var moveRespond;
    var endRespond;

    var origHeight = 0, origWidth = 0;
    $(".timeSlot, .handle").on("mousedown", function(event) {
        var $elem = $(event.currentTarget);
        if ($elem.is(".handle.top")) {
            moveRespond = moveHandleTopRespond;
            endRespond = endHandleTopRespond;
            event.stopPropagation();
            var parent = $elem.parent();
            var l = parseInt(parent.css("left"));
            var t = parseInt(parent.css("top"));
            origHeight = parent.height();
            origWidth = parent.width();
            down(event, l, t);
        } else if ($elem.is(".handle.bottom")) {
            moveRespond = moveHandleBtmRespond;
            endRespond = endHandleBtmRespond;
            event.stopPropagation();
            var parent = $elem.parent();
            var l = parseInt(parent.css("left"));
            var t = parent.height();
            origHeight = parent.height();
            origWidth = parent.width();
            down(event, l, t);
        } else if ($elem.is(".timeSlot")) {
            moveRespond = moveSlotRespond;
            endRespond = endSlotRespond;
            down(event);
            highlight($elem);
        }
    });

    function moveSlotRespond(elem, origX, origY, offsetX, offsetY) {
        var newY = origY + offsetY;
        if (newY < 0) newY = 0;
        var maxY = $(elem).parent().height();
        var height = $(elem).height();
        if (newY + height > maxY) newY = maxY - height;
        $(elem).css({
            top: newY + "px"
        });
        var step = HOUR_HEIGHT / 4;
        newY = Math.round(newY / step) * step;
        var start = {
            h: Math.floor(newY / HOUR_HEIGHT) + getMinTime(),
            m: (Math.floor(newY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        var endY = newY + height;
        var end = {
            h: Math.floor(endY / HOUR_HEIGHT) + getMinTime(),
            m: (Math.floor(endY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        updateStartTime(elem, start);
        updateEndTime(elem, end);
    }

    function endSlotRespond(elem, origX, origY, offsetX, offsetY) {
        var newY = origY + offsetY;
        if (newY < 0) newY = 0;
        var maxY = $(elem).parent().height();
        var height = $(elem).height();
        if (newY + height > maxY) newY = maxY - height;

        // snap to nearest 15 minutes
        var step = HOUR_HEIGHT / 4;
        newY = Math.round(newY / step) * step;
        $(elem).css({
            top: newY + "px"
        });
        var start = {
            h: Math.floor(newY / HOUR_HEIGHT) + getMinTime(),
            m: (Math.floor(newY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        var endY = newY + height;
        var end = {
            h: Math.floor(endY / HOUR_HEIGHT) + getMinTime(),
            m: (Math.floor(endY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        updateStartTime(elem, start);
        updateEndTime(elem, end);
    }

    function moveHandleTopRespond(elem, origX, origY, offsetX, offsetY){
        var newY = origY + offsetY;
        if (newY < 0) newY = 0;
        var maxY = origY + origHeight;
        if (newY > maxY) newY = maxY;
        $(elem).parent().css({
            top: newY + "px",
            height: ( origHeight + origY - newY ) + "px"
        });
        var step = HOUR_HEIGHT / 4;
        newY = Math.round(newY / step) * step;
        var start = {
            h: Math.floor(newY / HOUR_HEIGHT) + getMinTime(),
            m: (Math.floor(newY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        updateStartTime(elem.parentElement, start);
    }

    function endHandleTopRespond(elem, origX, origY, offsetX, offsetY) {
        var newY = origY + offsetY;
        if (newY < 0) newY = 0;
        var maxY = origY + origHeight;

        var step = HOUR_HEIGHT / 4;
        newY = Math.round(newY / step) * step;
        while (newY >= maxY) newY -= step;

        $(elem).parent().css({
            top: newY + "px",
            height: ( origHeight - (newY - origY) ) + "px"
        });
        var start = {
            h: Math.floor(newY / HOUR_HEIGHT) + getMinTime(),
            m: (Math.floor(newY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        updateStartTime(elem.parentElement, start);
    }

    function moveHandleBtmRespond(elem, origX, origY, offsetX, offsetY){
        var newY = origY + offsetY;
        var maxY = $("#scheduleForeground").height();
        var elemTop = parseInt($(elem).parent().css("top"));
        if (newY + elemTop > maxY) newY = maxY - elemTop;
        if (newY <= origY - origHeight) newY = origY - origHeight;
        $(elem).parent().css({
            height: (newY) + "px"
        });
        var step = HOUR_HEIGHT / 4;
        newY = Math.round(newY / step) * step;
        var endY = newY + parseInt($(elem).parent().css("top"));
        var end = {
            h: Math.floor(endY / HOUR_HEIGHT) + getMinTime(),
            m: (Math.floor(endY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        updateEndTime(elem.parentElement, end);
    }

    function endHandleBtmRespond(elem, origX, origY, offsetX, offsetY) {
        var newY = origY + offsetY;
        var maxY = $("#scheduleForeground").height();
        var elemTop = parseInt($(elem).parent().css("top"));
        if (newY + elemTop > maxY) newY = maxY - elemTop;

        var step = HOUR_HEIGHT / 4;
        newY = Math.round(newY / step) * step;
        while (newY <= origY - origHeight) newY += step;

        $(elem).parent().css({
            height: (newY) + "px"
        });
        var endY = newY + parseInt($(elem).parent().css("top"));
        var end = {
            h: Math.floor(endY / HOUR_HEIGHT) + getMinTime(),
            m: (Math.floor(endY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        updateEndTime(elem.parentElement, end);
    }

    function down(event, origX, origY) {
        // initialize offset for elem
        var elem = event.currentTarget;
        var $elem = $(elem);
        offsetXs = (origX) ? origX : parseInt($elem.css("left"));
        offsetYs = (origY) ? origY : parseInt($elem.css("top"));
        // initialize initial mouse position
        initX = event.pageX;
        initY = event.pageY;
        // add to list of objects following
        draggingElem = elem;
        // add mouse move listeners
        $(document.body)
            .on("mousemove", move)
            .on("mouseup", up);

        $(draggingElem).parentsUntil("#scheduleForeground").last()
            .addClass("dragging");
    }

    function move(event) {
        moveRespond(draggingElem,
                    offsetXs, offsetYs,
                    event.pageX - initX, event.pageY - initY);
    }

    function up(event) {
        $(draggingElem).parentsUntil("#scheduleForeground").last()
            .removeClass("dragging");
        $(document.body)
            .off("mousemove", move)
            .off("mouseup", up);
        endRespond(draggingElem,
                   offsetXs, offsetYs,
                   event.pageX - initX, event.pageY - initY);
        draggingElems = null;
        offsetXs = 0;
        offsetYs = 0;
        initX = 0;
        initY = 0;
        // save the data
        saveTimesToStorage();
    }
}

function strFromTime(object) {
    if (getMillitaryTimePref()) {
        return to2Str(object.h) + to2Str(object.m);
    } else {
        var h = object.h;
        var pm = (h % 12 != h);
        h %= 12;
        if (h == 0) h += 12;
        return h + ":" + to2Str(object.m) + (pm ? "pm" : "am");
    }
}

function updateStartTime(timeSlot, time) {
    $(timeSlot).attr("data-s-h", time.h).attr("data-s-m", time.m)
        .find(".handle.top > .text").text(strFromTime(time));
}
function updateEndTime(timeSlot, time) {
    $(timeSlot).attr("data-e-h", time.h).attr("data-e-m", time.m)
        .find(".handle.bottom > .text").text(strFromTime(time));
}

const HIGHLIGHT_CLASS = "highlight";
function highlight($timeSlot) {
    unHighlight();
    $timeSlot.addClass(HIGHLIGHT_CLASS);

    function temp() {
        setTimeout(function() {
            $("*:not(.timeSlot):not(.timeSlot *)")
                .on("click", unHighlight);
        }, 1);
        $(document.body).off("mouseup", temp);
    }
    $(document.body).on("mouseup", temp);
}
function unHighlight() {
    event.stopPropagation();
    $("." + HIGHLIGHT_CLASS).removeClass(HIGHLIGHT_CLASS);
    $("*").off("click", unHighlight);
}

function keyHandler(event) {
    //console.log(event.which);
    if (event.which === 8) { // delete
        deleteSlot($("." + HIGHLIGHT_CLASS));
    } else if (event.which == 27) { // esc
        unHighlight();
        hideWhichColor();
    }
}

function deleteSlot($elem) {
    $elem.remove();
    saveTimesToStorage();
}

function saveTimesToStorage() {
    var $slots = $(".timeSlot:not(#timeSlotTemplate)");
    var slotObjs = [];
    for (var i = 0; i < $slots.size(); i++) {
        var $slot = $slots.eq(i);
        var object = {
            pref: $slot.hasClass("favored") ?
                pref.neutral : pref.unfavored,
            time: new Time(
                parseInt($slot.attr("data-day")),
                parseInt($slot.attr("data-s-h")),
                parseInt($slot.attr("data-s-m")),
                parseInt($slot.attr("data-e-h")),
                parseInt($slot.attr("data-e-m")))
        };
        slotObjs.push(object);
    }
    localStorage[ID + "_" + STEP + "2"] = JSON.stringify(slotObjs);
}

function loadTimesFromStorage() {
    var slotObjs = getTimesFromStorage();
    if (!slotObjs) return [];
    drawSchedule(slotObjs);
    return slotObjs;
}
function getTimesFromStorage() {
    try {
        return JSON.parse(localStorage[ID + "_" + STEP + "2"]);
    } catch (e) {
        console.error(e);
        return null;
    }
}

function drawSchedule(slotObjs) {
    // set the current schedule to blank
    $(".timeSlot:not(#whichColor):not(#timeSlotTemplate)").remove();
    // draw new data
    for (var i = 0; i < slotObjs.length; i++) {
        var a = slotObjs[i];
        addSlot($("#scheduleInput"), a.time.day, a.time.start,
                a.time.end, (a.pref == pref.neutral));
    }
}

function refreshSchedule() {
    $(".timeSlot:not(#whichColor):not(#timeSlotTemplate)").remove();
    // initial schedule data
    var $schedule = $("#scheduleInput");
    addSlot($schedule, 1, {h:8, m: 00}, {h:9, m:00}, false);
    addSlot($schedule, 1, {h:9, m: 00}, {h:17, m:00}, true);
    addSlot($schedule, 1, {h:17, m: 00}, {h:18, m:30}, false);
    addSlot($schedule, 2, {h:8, m: 00}, {h:9, m:00}, false);
    addSlot($schedule, 2, {h:9, m: 00}, {h:17, m:00}, true);
    addSlot($schedule, 2, {h:17, m: 00}, {h:18, m:30}, false);
    addSlot($schedule, 3, {h:8, m: 00}, {h:9, m:00}, false);
    addSlot($schedule, 3, {h:9, m: 00}, {h:17, m:00}, true);
    addSlot($schedule, 3, {h:17, m: 00}, {h:18, m:30}, false);
    addSlot($schedule, 4, {h:8, m: 00}, {h:9, m:00}, false);
    addSlot($schedule, 4, {h:9, m: 00}, {h:17, m:00}, true);
    addSlot($schedule, 4, {h:17, m: 00}, {h:18, m:30}, false);
    addSlot($schedule, 5, {h:8, m: 00}, {h:9, m:00}, false);
    addSlot($schedule, 5, {h:9, m: 00}, {h:17, m:00}, true);
    addSlot($schedule, 5, {h:17, m: 00}, {h:18, m:30}, false);
    addEventListeners();
    saveTimesToStorage();
}

function hideWhichColor() {
    $elem.css("left", "-10000px");
}
