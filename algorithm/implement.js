// var courses = [
//     new Course(0, "XYZ", "Applied Cryptography", 3,
//         [], [], [], "red"),
//     new Course(1, "XYZ", "Computer Architecture and Organization", 3,
//         [], [], [], "orange"),
//     new Course(2, "XYZ", "Computer Programming 2", 3,
//         [], [], [], "yellow"),
//     new Course(3, "XYZ", "Database 1", 3,
//         [], [], [], "green"),
//     new Course(4, "XYZ", "Design I", 3,
//         [], [], [], "blue"),
//     new Course(5, "XYZ", "Engineering & Technology Project Management", 3,
//         [], [], [], "purple"),
//     new Course(6, "XYZ",
//         "Legal, Ethical, and Management Issues in Technology", 3,
//         [], [], [], "darkgrey"),
//     new Course(7, "XYZ", "Machine Learning", 3,
//         [], [], [], "#DDD"),
//     new Course(8, "XYZ", "Programming Languages", 3,
//         [], [], [], "violet"),
//     new Course(9, "XYZ", "Software Security Testing", 3,
//         [], [], [], "aquamarine"),
//     new Course(10, "XYZ", "Physics 1", 3,
//         [], [11], [], "magenta"),
//     new Course(11, "XYZ", "Physics 1 Lab", 3,
//         [], [10], [], "pink")
// ];
//
// var classes = [
//     new Class(0, courses[0],
//         [
//             new Time(1, 15, 0, 16, 15),
//             new Time(3, 15, 0, 16, 15)
//         ],
//         "Kettani, Houssain",
//         "", "", "", 30, 10
//     ),
//     new Class(1, courses[0],
//         [
//             new Time(2, 15, 0, 16, 15),
//             new Time(4, 15, 0, 16, 15)
//         ],
//         "Kettani, Houssain",
//         "", "", "", 30, 10
//     ),
//     new Class(2, courses[1],
//         [
//             new Time(1, 10, 0, 11, 50),
//             new Time(3, 10, 0, 11, 50)
//         ],
//         "Foster, David",
//         "", "", "", 30, 10
//     ),
//     new Class(3, courses[1],
//         [
//             new Time(1, 16, 0, 17, 50),
//             new Time(3, 16, 0, 17, 50)
//         ],
//         "Foster, David",
//         "", "", "", 30, 10
//     ),
//     new Class(4, courses[2],
//         [
//             new Time(1, 8, 0, 9, 50),
//             new Time(3, 10, 0, 11, 50)
//         ],
//         "Bushey, Dean",
//         "", "", "", 30, 10
//     ),
//     new Class(5, courses[2],
//         [
//             new Time(1, 12, 0, 13, 50),
//             new Time(3, 12, 0, 13, 50)
//         ],
//         "Bushey, Dean",
//         "", "", "", 30, 10
//     ),
//     new Class(6, courses[2],
//         [
//             new Time(1, 18, 0, 19, 50),
//             new Time(3, 18, 0, 19, 50)
//         ],
//         "Staff",
//         "", "", "", 30, 10
//     ),
//     new Class(7, courses[3],
//         [
//             new Time(1, 10, 30, 11, 45),
//             new Time(3, 10, 30, 11, 45)
//         ],
//         "Staab, Jennifer",
//         "", "", "", 30, 10
//     ),
//     new Class(8, courses[3],
//         [
//             new Time(2, 10, 30, 11, 45),
//             new Time(4, 10, 30, 11, 45)
//         ],
//         "Yang, Feng Jen",
//         "", "", "", 30, 10
//     ),
//     new Class(9, courses[3],
//         [
//             new Time(2, 12, 00, 13, 15),
//             new Time(4, 12, 00, 13, 15)
//         ],
//         "Samarah, Mohammad",
//         "", "", "", 30, 10
//     ),
//     new Class(10, courses[4],
//         [
//             new Time(2, 16, 30, 17, 20),
//             new Time(5, 10, 30, 13, 50)
//         ],
//         "Elish, Karim",
//         "", "", "", 30, 10
//     ),
//     new Class(11, courses[5],
//         [
//             new Time(2, 18, 0, 19, 15),
//             new Time(4, 18, 00, 19, 15)
//         ],
//         "Mennie, Jim",
//         "", "", "", 30, 10
//     ),
//     new Class(12, courses[5],
//         [
//             new Time(2, 16, 30, 17, 45),
//             new Time(4, 16, 30, 17, 45)
//         ],
//         "Mennie, Jim",
//         "", "", "", 30, 10
//     ),
//     new Class(13, courses[5],
//         [
//             new Time(1, 12, 0, 14, 30)
//         ],
//         "Shaikh, Shoaib",
//         "", "", "", 30, 10
//     ),
//     new Class(14, courses[5],
//         [
//             new Time(2, 16, 30, 17, 45),
//             new Time(4, 16, 30, 17, 45)
//         ],
//         "Staff",
//         "", "", "", 30, 10
//     ),
//     new Class(15, courses[6],
//         [
//             new Time(2, 8, 0, 9, 15),
//             new Time(4, 8, 0, 9, 15)
//         ],
//         "Mennie, Jim",
//         "", "", "", 30, 10
//     ),
//     new Class(16, courses[7],
//         [
//             new Time(2, 10, 30, 11, 45),
//             new Time(4, 10, 30, 11, 45)
//         ],
//         "Rashad, Sherif Said",
//         "", "", "", 30, 10
//     ),
//     new Class(17, courses[8],
//         [
//             new Time(2, 13, 30, 14, 45),
//             new Time(4, 13, 30, 14, 45)
//         ],
//         "Jaimes, Luis",
//         "", "", "", 30, 10
//     ),
//     new Class(18, courses[8],
//         [
//             new Time(1, 15, 0, 16, 15),
//             new Time(3, 15, 00, 16, 15)
//         ],
//         "Bushey, Dean",
//         "", "", "", 30, 10
//     ),
//     new Class(19, courses[9],
//         [
//             new Time(2, 9, 0, 10, 15),
//             new Time(4, 9, 00, 10, 15)
//         ],
//         "Bushey, Dean",
//         "", "", "", 30, 10
//     ),
//     new Class(20, courses[10],
//         [
//             new Time(2, 9, 0, 10, 15),
//             new Time(4, 9, 00, 10, 15)
//         ],
//         "Austin, Robert",
//         "", "", "", 30, 10
//     ),
//     new Class(21, courses[11],
//         [
//             new Time(1, 9, 0, 10, 50)
//         ],
//         "Austin, Robert",
//         "", "", "", 30, 10
//     )
// ];

// construct electiveGroups
var options = new Options();
options.setCoursePreference(2, pref.required);
// options.setCoursePreference(4, pref.required);
options.setCoursePreference(5, pref.unfavored);
options.setCreditMin(12);
options.setCreditMax(18);
options.setCreditFavoredValue(15);
options.setHideDing(true);

var preProcessFilter = function(theClass) {
    // contains an unacceptable professor
    if (options.professors[theClass.professor] == pref.unacceptable &&
            options.professors[theClass.professor] != null) {
        report("Class", "it had a bad professor");
        return false;
    }
    // is during an unacceptable time
    for (var i = 0; i < theClass.times.length; i++) {
        for (var j = 0; j < options.timesNeutral.length; j++) {
            var aTime = theClass.times[i],
                bTime = options.timesNeutral[j],
                aStart = aTime.start.h * 100 + aTime.start.m,
                aEnd = aTime.end.h * 100 + aTime.end.m,
                bStart = bTime.start.h * 100 + bTime.start.m,
                bEnd = bTime.end.h * 100 + bTime.end.m;
            if (aTime.day == bTime.day) {
                if (aStart < bStart || aEnd > bEnd) {
                    report("Class", "it's during a bad time");
                    return false;
                }
            }
        }
    }
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
var processFilter = function(schedule) {
    // not over the credit limit
    if (schedule.calculateCredits() >
            options.creditRange.maxValue) {
        report("Schedule", "it is over the credit limit");
        return false;
    }
    // ensure there are no two electives together
    for (var i = 0; i < schedule.classes.getLength(); i++) {
        var electiveGroup = schedule.classes.at(i).course.electivesInGroup;
        for (var j = 0; j < electiveGroup.length; j++) {
            if (schedule.classes.exists(electiveGroup[j])) {
                report("Schedule", "it has two electives in the same group");
                return false;
            }
        }
    }
    return true;
};
var postProcessFilter = function(schedule) {
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

//// Testing ClassList object
//// var allClassLength = classes.length;
//t = new ClassList();
//t._classes = classes.slice(0, 30);
//g = new ScheduleGenerator(t, options,
//    preProcessFilter, processFilter, postProcessFilter);
//console.log("Calculating...");
//var schedules = g.generateSchedules();
//var message = "Found " + schedules.length + " schedules in " +
//    g.getCalculationTime() + " seconds";
//alert(message);
//console.log(message);
//console.log(schedules);
//
//$(function() {
//    displaySchedules(schedules, 0, 200);
//});
