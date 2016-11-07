const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// handle canvas display of acceptable/favored times
$(function() {
    
    // Show the vertical day columns
    var showWeekends = getShowWeekends();
    var i = (showWeekends) ? 0 : 1;
    var end = (showWeekends) ? 7 : 6;
    var $times = $("#scheduleTimes");
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
        
        $("#scheduleBackground").append($copy);
    }
    
    // Show the horizontal time lines
    var end = getMaxTime() + 1;
    var template = $("#timeLineTemplate").get(0);
    var millTime = getMillitaryTimePref();
    for (var i = getMinTime(); i < end; i++) {
        var copy = template.cloneNode(true);
        copy.id = "";
        
        var $copy = $(copy).removeClass("template");
        $copy.find(".time").text(
            millTime ?
                (to2Str(i) + "00") :
                ((i  % 12 == 0) ? 12 : i % 12)+((i % 12 != i)?"pm":"am")
            );
        
        $("#scheduleBackground").append($copy);
    }
    
    addSlot(0, {h:8, m: 30}, {h:10, m:00}, false);
    addSlot(1, {h:8, m: 30}, {h:10, m:00}, false);
    addSlot(2, {h:8, m: 30}, {h:10, m:00}, false);
    addSlot(3, {h:8, m: 30}, {h:10, m:00}, false);
    addSlot(4, {h:8, m: 30}, {h:10, m:00}, false);
    addSlot(5, {h:8, m: 30}, {h:10, m:00}, false);
    addSlot(6, {h:8, m: 30}, {h:10, m:00}, false);
    
    addEventListeners();
});
function getMinTime() {
    return 7;
}
function getMaxTime() {
    return 12 + 8;
}
function getMillitaryTimePref() {
    return false;
}
function getShowWeekends() {
    return true;
}


function addSlot(day, start, end, favored) {
    if (!getShowWeekends()) {
        if (day == 0 || day == 6) {
            return;
        } else {
            day -= 1;
        }
    }
    // calculate values
    const HEIGHT = 50;
    const START_HOUR = 7;
    const WIDTH_MARGIN = 1;
    var width = (100 / (getShowWeekends() ? 7 : 5));
    var left = width * day;
    var top = HEIGHT *
        ( (start.h - START_HOUR) + start.m / 60);
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
    $copy.find(".handle.top > .text").text(strFromTime(start));
    $copy.find(".handle.bottom > .text").text(strFromTime(end));
    $copy.addClass(favored ? "favored" : "unfavored");
    
    // add the newly created slot to the view
    $("#scheduleForeground").append($copy);
}

function to2Str(number) {
    return (number < 10) ? "0" + number : "" + number;
}

function addEventListeners() {
    const HOUR_HEIGHT = 50;
    const START_HOUR = 7;
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
        } else {
            moveRespond = moveSlotRespond;
            endRespond = endSlotRespond;
            down(event);
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
            h: Math.floor(newY / HOUR_HEIGHT) + START_HOUR,
            m: (Math.floor(newY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        var endY = newY + height;
        var end = {
            h: Math.floor(endY / HOUR_HEIGHT) + START_HOUR,
            m: (Math.floor(endY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        $(elem).find(".handle.top > .text").text(strFromTime(start));
        $(elem).find(".handle.bottom > .text").text(strFromTime(end));
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
            h: Math.floor(newY / HOUR_HEIGHT) + START_HOUR,
            m: (Math.floor(newY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        var endY = newY + height;
        var end = {
            h: Math.floor(endY / HOUR_HEIGHT) + START_HOUR,
            m: (Math.floor(endY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        $(elem).find(".handle.top > .text").text(strFromTime(start));
        $(elem).find(".handle.bottom > .text").text(strFromTime(end));
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
            h: Math.floor(newY / HOUR_HEIGHT) + START_HOUR,
            m: (Math.floor(newY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        $(elem).find(".text").text(strFromTime(start));
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
            h: Math.floor(newY / HOUR_HEIGHT) + START_HOUR,
            m: (Math.floor(newY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        $(elem).find(".text").text(strFromTime(start));
    }
    
    function moveHandleBtmRespond(elem, origX, origY, offsetX, offsetY){
        var newY = origY + offsetY;
        var maxY = parseInt($(elem).parent().parent().css("top")) +
            newY;
        if (newY > maxY) newY = maxY;
        $(elem).parent().css({
            height: (newY) + "px"
        });
        var step = HOUR_HEIGHT / 4;
        newY = Math.round(newY / step) * step;
        var endY = newY + parseInt($(elem).parent().css("top"));
        var end = {
            h: Math.floor(endY / HOUR_HEIGHT) + START_HOUR,
            m: (Math.floor(endY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        $(elem).find(".text").text(strFromTime(end));
    }
    
    function endHandleBtmRespond(elem, origX, origY, offsetX, offsetY) {
        var newY = origY + offsetY;
        var maxY = $(elem).parent().parent().height() +
            parseFloat($(elem).css("top"));
        
        var step = HOUR_HEIGHT / 4;
        newY = Math.round(newY / step) * step;
        
        if (newY > maxY) newY = maxY;
        $(elem).parent().css({
            height: (newY) + "px"
        });
        var endY = newY + parseInt($(elem).parent().css("top"));
        var end = {
            h: Math.floor(endY / HOUR_HEIGHT) + START_HOUR,
            m: (Math.floor(endY / (HOUR_HEIGHT / 4)) % 4 * 15)
        };
        $(elem).find(".text").text(strFromTime(end));
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
    }
}

function strFromTime(object) {
    if (getMillitaryTimePref()) {
        return to2Str(object.h) + object.m;
    } else {
        var h = object.h;
        var pm = (h % 12 != h);
        h %= 12;
        if (h == 0) h += 12;
        return h + ":" + to2Str(object.m) + (pm ? "pm" : "am");
    }
}

