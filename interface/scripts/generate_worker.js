$ = function(a) {};
getShowWeekends = function() {};

importScripts("../../algorithm/algorithm.js",
              "../../algorithm/constructors.js",
              "../../algorithm/implement.js",
              "../../algorithm/common.js",
              "common.js");

var worker, workerRanking = false, schedules = [];

onmessage = function(event) {
    console.log("Worker message received from script");
    var data = JSON.parse(event.data);

    console.log("Generating Schedules");
    getShowWeekends = function() {
        return data["getShowWeekends"];
    }

    // get all of the options from the page inputs
    var options = new Options();
    // load time preferences from step 2
    var dataTimes = data["getTimesFromStorage"];
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
    var dataCoursePrefs = data["getCoursePrefsFromStorage"];
    for (var i in dataCoursePrefs) {
        var id = parseInt(i.split("-")[1]);
        var thePref = dataCoursePrefs[i];
        options.setCoursePreference(id, thePref);
    }

    // load professor preferences from step 4
    var dataProfessorPrefs = data["getProfessorPrefsFromStorage"];
    for (var i in dataProfessorPrefs) {
        var prof = i;;
        prof = prof.split("-")[1];
        options.setProfessorPreference(prof, dataProfessorPrefs[i]);
    }

    // load credit range prefs from step ?
    options.setCreditMin(parseInt(data["creditMin"]));
    options.setCreditFavoredValue(parseInt(data["creditGoal"]));
    options.setCreditMax(parseInt(data["creditMax"]));

    // set advanced settings
    var adv = data["getAdvancedFromStorage"];
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
    var dataCourses = data["getCoursesFromStorage"];
    var rawCourses = data["jsonCourseData"]
        [dataCourses.major][dataCourses.concentration];
    for (var i in dataCoursePrefs) {
        var id = parseInt(i.split("-")[1]);
        var cData = getCourseWithID(rawCourses, id);
        // get the data from the scraper
        var classList = new ClassList();
        for (var theClass in data["jsonClassData"]) {
            if (theClass.indexOf(cData.number) == 0) {
                var sections = data["jsonClassData"][theClass];
                for (var section in sections) {
                    var classObj = sectionToClass(
                        cData.number, sections[section]);
                    if (classObj != null) {
                        classList.add(classObj);
                    }
                }
            }
        }
        var course = new Course(
            cData.id, cData.number, cData.name, cData.credits,
            cData.prereqs, cData.coreq, cData.electivesInGroup,
            null,
            classList,
            cData.description
        );
        courses.add(course);
    }

    // start the generation in a worker
    start();
    // hide the cancel button because it can't be cancelled
    var generator = new ScheduleGenerator(courses, options,
        preProcessFilter, processFilter, postProcessFilter,
        rankingFilter);
    console.log("Calculating...");
    schedules = generator.generateSchedules(middle);
    var message = "Found " + schedules.length + " schedules in " +
        generator.getCalculationTime() + " seconds";
    finish(message);
}


// before the beginning of generation
function start() {
    postMessage(JSON.stringify({
        type: "start"
    }));
}
// whenever a point of progress (i.e. new schedule calculated) occurs
function middle(progress) {
    if (typeof progress == "number") {
        postMessage(JSON.stringify({
            type: "progress",
            progress: progress
        }));
    } else if (typeof progress == "string") {
        if (progress == "startedRanking") {
            postMessage(JSON.stringify({
                type: "startedRanking"
            }));
        }
    }
}
// when finished, show first, highest-ranked schedule
function finish(message) {
    // var scheduleStrs = [];
    for (var i = 0; i < schedules.length; i++) {
        // scheduleStrs.push(schedules[i].toString());
        var classes = schedules[i].classes;
        for (var j = 0; j < classes.getLength(); j++) {
            var oldCourse = classes.at(j).course;
            if (typeof oldCourse == "object") {
                classes.at(j).course = oldCourse.id;
            } // otherwise, it's already been replaced
        }
    }
    postMessage(JSON.stringify({
        type: "finish",
        message: message,
        schedules: schedules
    }));
}

function cancelWorker() {
    console.log("Cancel Generating");
    if (worker) {
        worker.terminate();
        workerRanking = false;
    }
}
