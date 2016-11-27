importScripts("../../algorithm/algorithm.js",
              "../../algorithm/constructors.js",
              "../../algorithm/implement.js");

var courses = [],
    options = {},
    preProcessFilter = function() {},
    processFilter = function() {},
    postProcessFilter = function() {},
    status = "generating"; // or "ranking" or "done"

onmessage = function(event) {
    console.log("Worker message received from script");
    var data = JSON.parse(event.data);
    // courses = new CourseList(data[0]._courses);
    // console.log(courses);
    // for (var i = 0; i < courses.getLength(); i++) {
    //     courses._courses =
    //     courses.at(i)._classList = new ClassList(courses.at(i)._classList._classes);
    // }
    // convert back to custom objects instead of generic 'Object's
    courses = new CourseList(data[0]._courses);
    for (var i = 0; i < courses.getLength(); i++) {
        var course = courses.at(i);
        course.__proto__ = Course.prototype;
        course.getClassList = function() {
            return this._classList;
        };
        course.addClass = function(theClass) {
            this._classList.add(theClass);
            this._classList.get(theClass.id).course = this;
        };
        course._classList = new ClassList(course._classList._classes);
        for (var j = 0; j < course._classList._classes.length; j++) {
            var theClass = course._classList._classes[j];
            theClass.__proto__ = Class.prototype;
        }
    }

    options = data[1];
    options.__proto__ = Options.prototype;
    for (var i = 0; i < options.timesUnfavored.length; i++) {
        var obj = options.timesUnfavored[i];
        options.timesUnfavored[i] = new Time(
            obj.day, obj.start.h, obj.start.m, obj.end.h, obj.end.m);
    }
    for (var i = 0; i < options.timesNeutral.length; i++) {
        var obj = options.timesNeutral[i];
        options.timesNeutral[i] = new Time(
            obj.day, obj.start.h, obj.start.m, obj.end.h, obj.end.m);
    }
    console.log(courses);
    console.log(options);

    var generator = new ScheduleGenerator(courses, options,
        preProcessFilter, processFilter, postProcessFilter);
    console.log("Calculating...");
    schedules = generator.generateSchedules(progressCallback);
    var message = "Found " + schedules.length + " schedules in " +
        generator.getCalculationTime() + " seconds";
    console.log(message);
    // show the progress dialog
    // calculate ranking, sort by ranking (lowest==better)
    status = "ranking";
    for (var i = 0; i < schedules.length; i++) {
        schedules[i].calculateRanking(options);
        progressCallback(i);
    }
    schedules.sort(function(a, b) {
        var _a = a.ranking, _b = b.ranking;
        if (_a === _b) return 0;
        return (_a < _b) ? -1 : 1;
    });
    status = "done";
    progressCallback(i);

    function progressCallback(progress) {
        postMessage(JSON.stringify([status, progress]));
    }
}
