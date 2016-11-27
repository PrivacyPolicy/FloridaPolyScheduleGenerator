$(function() {
    var worker, workerRanking = false, schedules = [];
    $("#generate").click(function() {
        console.log("Generating Schedules");
        scheduleIndex = 0;

        // get all of the options from the page inputs
        var options = new Options();
        // load time preferences from step 2
        var dataTimes = getTimesFromStorage();
        for (var i in dataTimes) {
            var time = dataTimes[i].time;
            var timeObj = new Time(time.day, time.start.h,
                time.start.m, time.end.h, time.end.m);
            if (dataTimes[i].pref == pref.unfavored) {
                options.addUnfavoredTime(timeObj);
            } else if (dataTimes[i].pref == pref.neutral) {
                options.addNeutralTime(timeObj);
            }
        }
        // load course preferences from step 3
        var dataCoursePrefs = getCoursePrefsFromStorage();
        for (var i in dataCoursePrefs) {
            var id = parseInt(i.split("-")[1]);
            var thePref = dataCoursePrefs[i];
            options.setCoursePreference(id, thePref);
        }
        // load credit range prefs from step ?
        options.setCreditMin(parseInt($("#creditMin").val()));
        options.setCreditFavoredValue(
            parseInt($("#creditGoal").val()));
        options.setCreditMax(parseInt($("#creditMax").val()));

        // set advanced settings
        var adv = getAdvancedFromStorage();
        if (adv) {
            options.setAllowHalfCoRequisites(adv["checkAllowHalfCoRequisites"]);
            options.setAllowMultipleElectives(adv["checkMultipleElectives"]);
            options.setHideFullClasses(adv["checkHideFullClasses"]);
        }
        // don't even bother showing classes with Dr. Ding
        options.setHideDing(false);

        // build list of courses from available courses
        // (which has already been calculated by step 3...)
        var courses = new CourseList();
        var dataCourses = getCoursesFromStorage();
        var rawCourses = jsonCourseData
            [dataCourses.major][dataCourses.concentration];
        var colorIndex = 0;
        for (var i in dataCoursePrefs) {
            var id = parseInt(i.split("-")[1]);
            var data = getCourseWithID(rawCourses, id);
            // get the data from the scraper
            var classList = new ClassList();
            for (var theClass in jsonClassData) {
                if (theClass.indexOf(data.number) == 0) {
                    var sections = jsonClassData[theClass];
                    for (var section in sections) {
                        var classObj = sectionToClass(
                            data.number, sections[section]);
                        if (classObj != null) {
                            classList.add(classObj);
                        }
                    }
                }
            }
            var course = new Course(
                data.id, data.number, data.name, data.credits,
                data.prereqs, data.coreq, data.electivesInGroup,
                COLORS[colorIndex++],
                classList,
                data.description
            );
            courses.add(course);
        }

        // start the generation in a worker
        if (!window.Worker || true) {// if we can't run it in the background
            start();
            // hide the cancel button because it can't be cancelled
            $("#generateCancel").addClass("hidden");
            var generator = new ScheduleGenerator(courses, options,
                preProcessFilter, processFilter, postProcessFilter);
            console.log("Calculating...");
            schedules = generator.generateSchedules(middle);
            var message = "Found " + schedules.length + " schedules in " +
                generator.getCalculationTime() + " seconds";
            console.log(message);
            alert(message);
            finish();
        } else {
            // worker = new Worker("scripts/worker.js");
            // worker.postMessage(JSON.stringify([courses, options]));
            // var totalSchedules = 0,
            //     $message = $("#generateMessage");
            // worker.onmessage = function(event) {
            //     console.log("Worker message received from worker");
            //     var data = JSON.parse(event.data);
            //     // how many schedules have either been made or have been ranked
            //     var progress = parseInt(data[1]);
            //     if (data[0] === "generating") {
            //         workerRanking = false;
            //     } else if (data[0] === "ranking") {
            //         totalSchedules = progress;
            //         workerRanking = true;
            //     } else if (data[0] === "done") {
            //         workerRanking = false;
            //         finish();
            //     }
            //     if (!workerRanking) {
            //         $message.text("Schedules Generated: " + progress);
            //     } else {
            //         $message.text("Ranking Progress: "
            //             + (progress / totalSchedules).toFixed(2) + "%");
            //     }
            //     console.log(progress);
            // }
        }
        // before the beginning of generation
        var $genStatus = $("#generateStatus");
        function start() {
            $("#generate").addClass("hidden");
            $("#generateStatus").removeClass("hidden");
            $("#scheduleData").addClass("hidden");
        }
        // whenever a point of progress (e.g. new schedule calculated) occurs
        function middle(progress) {
            $("#generateStatus").text("Schedules Generated: " + progress);
        }
        // when finished, show first, highest-ranked schedule
        function finish() {
            $("#scheduleOutput").removeClass("hidden");
            $("#generateStatus").addClass("hidden");
            $("#scheduleData").removeClass("hidden");
            drawSchedule(schedules[0]);
        }
    });
    $("#generateCancel").click(function() {
        console.log("Cancel Generating");
        if (worker) {
            worker.terminate();
            workerRanking = false;
        }
    });

    function getCourseWithID(courses, courseID) {
        for (var i = 0; i < courses.length; i++) {
            if (courses[i].id == courseID) {
                return courses[i];
            }
        }
        return null;
    }

    function drawSchedule(schedule) {
        purgeSchedule();
        for (var i = 0; i < schedule.classes.getLength(); i++) {
            drawClass(schedule.classes.at(i));
        }
        // show some additional data about the schedule
        $("#scheduleData").text(
            (scheduleIndex%schedules.length + 1) + "/" + schedules.length
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
        var str = DAYS[times[0].day].charAt(0);
        var lastTime = times[0];
        for (var i = 1; i < times.length; i++) {
            lastTime = times[i - 1];
            var curTime = times[i];
            if (lastTime.start.h == curTime.start.h
                    && lastTime.start.m == curTime.start.m
                    && lastTime.end.h == curTime.end.h
                    && lastTime.end.m == curTime.end.m) {
                var d = DAYS[times[i].day];
                str += (d == "Thu") ? "R" : d.charAt(0);
            } else {
                var d = DAYS[times[i].day];
                str += " " + strFromTime(lastTime.start) + "-"
                    + strFromTime(lastTime.end) + ", "
                    + ((d == "Thu") ? "R" : d.charAt(0));
            }
        }
        str += " " + strFromTime(lastTime.start) + "-"
            + strFromTime(lastTime.end) + ", ";
        return str.substr(0, str.length - 2);
    }

    const DAY_TO_INT = {"M": 1, "T": 2, "W": 3, "R": 4, "F": 5};
    function sectionToClass(courseNumber, sectionObj) {
        courseNumber = parseInt(courseNumber.substr(3)) + "";
        var id = parseInt(courseNumber + sectionObj.section);
        var times = [];
        var professors = [], rooms = [];
        var campus = "", building = "";
        for (var m in sectionObj.meetings) {
            var meeting = sectionObj.meetings[m];
            // get some main variables out of the way
            // campus = "";
            var building = meeting.building;
            if (professors.indexOf(meeting.professor) == -1) {
                professors.push(meeting.professor);
            }
            if (rooms.indexOf(meeting.room) == -1) {
                rooms.push(meeting.room);
            }
            // convert meetings to times
            var days = meeting.days;
            loop1: while (days.length > 0) {
                var day = DAY_TO_INT[days[0]];
                days = days.substr(1);
                var timeObj = {
                    day: day,
                    start: meeting.time.start,
                    end: meeting.time.end
                };
                for (var t in times) {
                    var time = times[t];
                    if (time.day == timeObj.day
                            && time.start.h == timeObj.start.h
                            && time.start.m == timeObj.start.m
                            && time.end.h == timeObj.end.h
                            && time.end.m == timeObj.end.m) {
                        continue loop1;
                    }
                }
                times.push(timeObj);
            }
        }
        var professorsStr = professors[0];
        for (var i = 1; i < professors.length; i++) {
            professorsStr += "; " + professors[i];
        }
        var roomsStr = rooms[0];
        for (var i = 1; i < rooms.length; i++) {
            roomsStr += "; " + rooms[i];
        }
        var section = sectionObj.section;
        var seatsMax = sectionObj.seatsMax;
        var seatsLeft = sectionObj.seatsLeft;
        return new Class(id, null, times, professorsStr, section,
            campus, building, roomsStr, seatsMax, seatsLeft);
    }
});
