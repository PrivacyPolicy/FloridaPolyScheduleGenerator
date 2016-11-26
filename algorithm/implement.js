var preProcessFilter = function(options, theClass) {
    // contains an unacceptable professor
    if (options.professors[theClass.professor] == pref.unacceptable &&
            options.professors[theClass.professor] != null) {
        report("Class", "it had a bad professor");
        return false;
    }
    // is during an unacceptable time
    // build a "matrix" of times that are covered,
    var timeCoverage = [];
    for (var i = 0; i < options.timesNeutral.length; i++) {
        var time = options.timesNeutral[i];
        var start = time.start.h * 100 + time.start.m;
        var end = time.end.h * 100 + time.end.m;
            if (!timeCoverage[time.day]) {
                timeCoverage[time.day] = [];
            }
        while (start < end) {
            timeCoverage[time.day][start] = true;
            start += 15;
            if (start % 100 == 60) start += 40;
        }
    }
    // Test against time coverage matrix
    for (var i = 0; i < theClass.times.length; i++) {
        var time = theClass.times[i];
        var start = time.start.h * 100 + time.start.m;
        var end = time.end.h * 100 + time.end.m;
        while (start < end) {
            if (!timeCoverage[time.day][start]) {
                report("Class", "it's during a bad time");
                return false;
            }
            start += 15;
            if (start % 100 == 60) start += 40;
        }
    }
    // for (var i = 0; i < theClass.times.length; i++) {
    //     for (var j = 0; j < options.timesNeutral.length; j++) {
    //         var aTime = theClass.times[i],
    //             bTime = options.timesNeutral[j],
    //             aStart = aTime.start.h * 100 + aTime.start.m,
    //             aEnd = aTime.end.h * 100 + aTime.end.m,
    //             bStart = bTime.start.h * 100 + bTime.start.m,
    //             bEnd = bTime.end.h * 100 + bTime.end.m;
    //         if (aTime.day == bTime.day) {
    //             if (aStart < bStart || aEnd > bEnd) {
    //                 report("Class", "it's during a bad time");
    //                 return false;
    //             }
    //         }
    //     }
    // }
    // is an unnaceptable class (currently disabled)

    // not in major/concentration (currently disabled)

    // prerequisites haven't been taken (currently disabled)

    // already taken (currently disabled)

    // on an unacceptable campus (currently disabled)

    // in an unacceptable class room (currently disabled)

    // TODO: check if a past elective was taken
    if (!options.multipleElectives) {
        // ...
    }

    // class is full
    if (options.hideFullClasses && theClass.seatsLeft < 1) {
        return false;
    }
    // if it gets this far, the class is fine
    return true;
};



var processFilter = function(options, schedule) {
    // not over the credit limit
    if (schedule.calculateCredits() >
            options.creditRange.maxValue) {
        report("Schedule", "it is over the credit limit");
        return false;
    }
    // ensure there are no two electives together
    if (!options.multipleElectives) {
        for (var i = 0; i < schedule.classes.getLength(); i++) {
            var electiveGroup = schedule.classes.at(i).course.electivesInGroup;
            for (var j = 0; j < electiveGroup.length; j++) {
                if (schedule.classes.exists(electiveGroup[j])) {
                    report("Schedule", "it has elective conflicts");
                    return false;
                }
            }
        }
    }
    return true;
};



var postProcessFilter = function(options, schedule) {
    // doesn't meet the credit minimum
    if (schedule.calculateCredits() <
            options.creditRange.minValue) {
        report("Schedule", "it did not meet the credit minimum");
        return false;
    }
    // doesn't contain the required classes
    for (var i = 0; i < options.coursesRequired.length; i++) {
        var reqID = options.coursesRequired[i];
        var hasRequired = false;
        for (var j = 0; j < schedule.classes.getLength(); j++) {
            if (schedule.classes.at(j).course.id == reqID) {
                hasRequired = true;
                break;
            }
        }
        if (!hasRequired) {
            report("Schedule", "it doesn't contain required class");
            return false;
        }
    }
    // if co-requisite classes don't both exist
    if (!options.allowHalfCoRequisites) {
        var classes = schedule.classes;
        for (var i = 0; i < classes.getLength(); i++) {
            var coreqsMetCount = 0;
            var coreqs = classes.at(i).course.coReqs;
            if (coreqs.length == 0) continue;
            for (var j = 0; j < coreqs.length; j++) {
                if (classes.exists(coreqs[j])) {
                    coreqsMetCount++;
                }
            }
            if (coreqsMetCount < coreqs.length) {
                report("Schedule", "it has one co req but not the other");
                return false;
            }
        }
    }
    return true;
};



function report(type, message) {
    if (DEBUG) console.log(type + " removed because " + message);
}
