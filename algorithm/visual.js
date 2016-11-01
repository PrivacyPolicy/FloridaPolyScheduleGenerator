function displaySchedules(schedules, start, end) {
    if (!start) start = 0;
    if (!end) end = schedules.length;
    for (var i = start; i < end; i++) {
        displaySchedule(schedules[i], i);
    }
}
function displaySchedule(schedule, offset) {
    for (var i = 0; i < schedule.classes.getLength(); i++) {
        displayClass(schedule.classes.at(i), offset);
    }
}
function displayClass(theClass, offset) {
    const mult = .5;
    const hourHeight = 50;
    const hourWidth = 100;
    const startHour = 7;
    const endHour = 22;
    for (var i = 0; i < theClass.times.length; i++) {
        var time = theClass.times[i];
        var left = time.day * hourWidth;
        var right = left + hourWidth;
        var top = (time.start.h + (time.start.m / 60) - startHour) * hourHeight
            + offset * hourHeight * (endHour - startHour);
        var bottom = (time.end.h + (time.end.m / 60) - startHour) * hourHeight
            + offset * hourHeight * (endHour - startHour);
        displayBlock(left, top, right, bottom, theClass.course.name);
    }
}

function displayBlock(left, top, right, bottom, text) {
    var clone = $(".block.template")[0].cloneNode(true);
    clone.id = "";
    var $clone = $(clone).removeClass("template");
    $(document.body).append($clone);
    return $clone
        .css({left: left + "px", top: top + "px",
            width: (right - left) + "px", height: (bottom - top) + "px"})
        .text(text);
}
