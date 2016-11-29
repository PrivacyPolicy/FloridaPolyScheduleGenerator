$(function() {
    var worker, workerRanking = false, schedules = [],
        colorForCourse = {}, colorIndex = 0;
    $("#generate").click(function() {
        scheduleIndex = 0;
        colorForCourse = {};
        colorIndex = 0;

        start();
        $("#generateMessage").text("Initializing...");
        if (window.Worker) {
            worker = new Worker("scripts/generate_worker.js");
            // pass the worker all the data it will need
            worker.postMessage(
                JSON.stringify({
                    getTimesFromStorage: getTimesFromStorage(),
                    getCoursePrefsFromStorage: getCoursePrefsFromStorage(),
                    creditMin: $("#creditMin").val(),
                    creditGoal: $("#creditGoal").val(),
                    creditMax: $("#creditMax").val(),
                    getAdvancedFromStorage: getAdvancedFromStorage(),
                    getCoursesFromStorage: getCoursesFromStorage(),
                    jsonCourseData: jsonCourseData,
                    jsonClassData: jsonClassData,
                    getShowWeekends: getShowWeekends(),
                    getProfessorPrefsFromStorage: getProfessorPrefsFromStorage()
                })
            );
            // listen for changes in the worker's state
            worker.onmessage = function(event) {
                var data = JSON.parse(event.data);
                if (data.type == "start") {
                } else if (data.type == "progress") {
                    middle(data.progress);
                } else if (data.type == "startedRanking") {
                    middle("startedRanking");
                } else if (data.type == "finish") {
                    schedules = data.schedules;
                    console.log(data.message);
                    finish();
                }
            };
        } else {
            alert("Your browser does not support JSWorkers");
        }
    });
    function start() {
        $("#generate").addClass("hidden");
        $("#generateStatus").removeClass("hidden");
        $("#scheduleData").addClass("hidden");
        $("#generateCancel").text("Cancel");
    }
    // whenever a point of progress (e.g. new schedule calculated) occurs
    function middle(progress) {
        if (typeof progress == "number") {
            $("#generateMessage").text("Schedules Generated: " + progress);
        } else if (typeof progress == "string") {
            if (progress == "startedRanking") {
                $("#generateMessage").text("Ranking...");
            }
        }
    }
    // when finished, show first, highest-ranked schedule
    function finish() {
        if (schedules.length > 0) {
            $("#scheduleOutput").removeClass("hidden");
            $("#generateStatus").addClass("hidden");
            $("#scheduleData").removeClass("hidden");
            for (var i = 0; i < schedules.length; i++) {
                schedules[i] = scheduleFromObj(schedules[i]);
            }
            drawSchedule(schedules[0]);
        } else {
            // alert("No schedules found that mach your criteria.");
            $("#generateMessage").text("No schedules found that match your "
                + "criteria.");
            $("#generateCancel").text("Okay");
        }
    }
    $("#generateCancel").click(function() {
        console.log("Cancel Generating");
        if (worker) {
            worker.terminate();
            workerRanking = false;
            step5Init();
        }
    });

    function drawSchedule(schedule) {
        purgeSchedule();
        for (var i = 0; i < schedule.classes.getLength(); i++) {
            drawClass(schedule.classes.at(i));
        }
        // show some additional data about the schedule
        $("#scheduleData").text(
            (scheduleIndex % schedules.length + 1) + "/" + schedules.length
            + ", Credits: " + schedule.credits
            + ", Ranking: " + schedule.normalizedRanking + "<br>"
            + JSON.stringify(schedule.ranking)
        );
    }
    function drawClass(theClass) {
        for (var i = 0; i < theClass.times.length; i++) {
            drawClassTimeSlot(theClass.times[i], theClass.course.color,
                theClass, timesToStr(theClass.times));
        }
    }
    function drawClassTimeSlot(time, color, theClass, timeStr) {
        var slot = $("#outputTimeSlotTemplate").get(0).cloneNode(true);
        slot.id = "";
        var $slot = $(slot);
        $slot.removeClass("template");

        // calculate the values
        var day = time.day;
        if (!getShowWeekends()) {
            if (day == 0 || day == 6) {
                return;
            } else {
                day -= 1;
            }
        }
        // calculate values
        var start = time.start;
        var end = time.end;
        const HEIGHT = 50;
        const WIDTH_MARGIN = 1;
        var width = (100 / (getShowWeekends() ? 7 : 5));
        var left = width * day;
        var top = HEIGHT *
            ( (start.h - getMinTime()) + start.m / 60);
        var height = HEIGHT *
            ( (end.h - start.h) + (end.m - start.m) / 60 );
        var millTime = getMillitaryTimePref();

        // set the values
        $slot.css({
            left: "calc(" + left + "% + " + WIDTH_MARGIN + "px)",
            top: top + "px",
            height: height + "px",
            width: "calc(" + width + "% - 2 * " + WIDTH_MARGIN + "px + 1px)",
            backgroundColor: color
        });
        var course = theClass.course;
        $slot.html(course.number + theClass.section + "&nbsp;" + course.name + "<br>"
            + timeStr + "<br>Credits: " + course.credits + "<br>"
            + theClass.professor);
        $slot.attr("title", course.number + " " + course.name + "\n"
            + timeStr + "\nCredits: " + course.credits + "\n"
            + theClass.professor + "\n\n"
            + course.description);

        $("#scheduleOutput > .scheduleForeground").append($slot);
    }
    function purgeSchedule() {
        $("#scheduleOutput > .scheduleForeground").html(
            $("#outputTimeSlotTemplate"));
    }

    var scheduleIndex = 0;
    function nextSchedule() {
        scheduleIndex = Math.min(++scheduleIndex, schedules.length - 1);
        drawSchedule(schedules[scheduleIndex]);
    }
    function prevSchedule() {
        scheduleIndex = Math.max(0, --scheduleIndex);
        drawSchedule(schedules[scheduleIndex]);
    }
    $(document.body).keydown(function(event) {
        // console.log("event.which = " + event.which);
        if (event.which == 39) { // right arrow
            nextSchedule();
        } else if (event.which == 37) {
            prevSchedule();
        }
    });
    function timesToStr(times) {
        var str = DAY_CHARS[times[0].day] + " "
            + strFromTime(times[0].start) + "-"
            + strFromTime(times[0].end);
        if (times.length == 1) return str;
        // else:
        var lastTime = times[0];
        for (var i = 1; i < times.length; i++) {
            if (lastTime.start.h == times[i].start.h
                    && lastTime.start.m == times[i].start.m
                    && lastTime.end.h == times[i].end.h
                    && lastTime.end.m == times[i].end.m) {
                str = str.split(" ")[0]
                    + DAY_CHARS[times[i].day] + " "
                    + str.split(" ")[1];
            } else {
                str += ", " + DAY_CHARS[times[i].day] + " "
                    + strFromTime(times[i].start) + "-"
                    + strFromTime(times[i].end);
            }
        }
        return str;
    }

    function scheduleFromObj(scheduleObj) {
        // convert back to custom objects
        var d = getCoursesFromStorage();
        var rawCourses = jsonCourseData[d.major][d.concentration];
        var newSchedule = new Schedule();
        var rawClasses = scheduleObj.classes._classes;
        for (var i = 0; i < rawClasses.length; i++) {
            var c = rawClasses[i];
            var theCourse = getCourseWithID(rawCourses, c.course);
            // set color
            if (!colorForCourse[theCourse.id]) {
                colorForCourse[theCourse.id] = COLORS[colorIndex++];
            }
            theCourse.color = colorForCourse[theCourse.id];
            // condense all of the newly made variables into a class object
            var newClass = new Class(
                c.id, theCourse, c.times, c.professor, c.section,
                c.campus, c.building, c.room, c.seatsMax, c.seatsLeft
            );
            newSchedule.addClass(newClass);
        }
        newSchedule.credits = scheduleObj.credits;
        newSchedule.ranking = scheduleObj.ranking;
        newSchedule.normalizedRanking = scheduleObj.normalizedRanking;
        return newSchedule;
    }
});
