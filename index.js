var classes = [
    new Class(0, "", "Applied Cryptogrphy", 3,
        [
            new Time(1, 15, 0, 16, 15),
            new Time(3, 15, 0, 16, 15)
        ],
        "Kettani, Houssain",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(1, "", "Applied Cryptogrphy", 3,
        [
            new Time(2, 15, 0, 16, 15),
            new Time(4, 15, 0, 16, 15)
        ],
        "Kettani, Houssain",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(2, "", "Computer Architecture and Organization", 3,
        [
            new Time(1, 10, 0, 11, 50),
            new Time(3, 10, 0, 11, 50)
        ],
        "Foster, David",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(3, "", "Computer Architecture and Organization", 3,
        [
            new Time(1, 16, 0, 17, 50),
            new Time(3, 16, 0, 17, 50)
        ],
        "Foster, David",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(4, "", "Computer Programming 2", 3,
        [
            new Time(1, 8, 0, 9, 50),
            new Time(3, 10, 0, 11, 50)
        ],
        "Bushey, Dean",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(5, "", "Computer Programming 2", 3,
        [
            new Time(1, 12, 0, 13, 50),
            new Time(3, 12, 0, 13, 50)
        ],
        "Bushey, Dean",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(6, "", "Computer Programming 2", 3,
        [
            new Time(1, 18, 0, 19, 50),
            new Time(3, 18, 0, 19, 50)
        ],
        "Staff",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(7, "", "Database 1", 3,
        [
            new Time(1, 10, 30, 11, 45),
            new Time(3, 10, 30, 11, 45)
        ],
        "Staab, Jennifer",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(8, "", "Database 1", 3,
        [
            new Time(2, 10, 30, 11, 45),
            new Time(4, 10, 30, 11, 45)
        ],
        "Yang, Feng Jen",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(9, "", "Database 1", 3,
        [
            new Time(2, 12, 00, 13, 15),
            new Time(4, 12, 00, 13, 15)
        ],
        "Samarah, Mohammad",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(10, "", "Design I", 3,
        [
            new Time(2, 16, 30, 17, 20),
            new Time(5, 10, 30, 13, 50)
        ],
        "Elish, Karim",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(11, "", "Engineering & Technology Project Management", 3,
        [
            new Time(2, 18, 0, 19, 15),
            new Time(4, 18, 00, 19, 15)
        ],
        "Mennie, Jim",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(12, "", "Engineering & Technology Project Management", 3,
        [
            new Time(2, 16, 30, 17, 45),
            new Time(4, 16, 30, 17, 45)
        ],
        "Mennie, Jim",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(13, "", "Engineering & Technology Project Management", 3,
        [
            new Time(1, 12, 0, 14, 30)
        ],
        "Shaikh, Shoaib",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(14, "", "Engineering & Technology Project Management", 3,
        [
            new Time(2, 16, 30, 17, 45),
            new Time(4, 16, 30, 17, 45)
        ],
        "Staff",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(15, "", "Legal, Ethical, and Management Issues in Technology", 3,
        [
            new Time(2, 8, 0, 9, 15),
            new Time(4, 8, 0, 9, 15)
        ],
        "Mennie, Jim",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(16, "", "Machine Learning", 3,
        [
            new Time(2, 10, 30, 11, 45),
            new Time(4, 10, 30, 11, 45)
        ],
        "Rashad, Sherif Said",
        "", "", "", 30, 10, [], [], [], ""
    ),
    new Class(17, "", "Programming Languages", 3,
        [
            new Time(2, 13, 30, 14, 45),
            new Time(4, 13, 30, 14, 45)
        ],
        "Jaimes, Luis",
        "", "", "", 30, 10, [], [], [18], ""
    ),
    new Class(18, "", "Programming Languages", 3,
        [
            new Time(1, 15, 0, 16, 15),
            new Time(3, 15, 00, 16, 15)
        ],
        "Bushey, Dean",
        "", "", "", 30, 10, [], [], [17], ""
    ),
    new Class(19, "", "Software Security Testing", 3,
        [
            new Time(2, 9, 0, 10, 15),
            new Time(4, 9, 00, 10, 15)
        ],
        "Bushey, Dean",
        "", "", "", 30, 10, [], [20, 21], [], ""
    ),
    new Class(20, "", "Physics 1", 3,
        [
            new Time(2, 9, 0, 10, 15),
            new Time(4, 9, 00, 10, 15)
        ],
        "Austin, Robert",
        "", "", "", 30, 10, [], [21, 19], [], ""
    ),
    new Class(21, "", "Physics 1 Lab", 1,
        [
            new Time(1, 9, 0, 10, 50)
        ],
        "Austin, Robert",
        "", "", "", 30, 10, [], [20, 19], [], ""
    )
];

// construct electiveGroups
var options = new Options();
options.setClassPreference(2, pref.required);
// options.setClassPreference(4, pref.required);
options.setClassPreference(5, pref.unfavored);
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
        var electiveGroup = schedule.classes.at(i).electivesInGroup;
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
    for (var i = 0; i < options.classesRequired.length; i++) {
        var reqID = options.classesRequired[i];
        if (!schedule.classes.exists(reqID)) {
            report("Schedule", "it doesn't contain required class");
            return false;
        }
    }
    // if co-requisite classes don't both exist
    if (!options.allowHalfCoRequisites) {
        var classes = schedule.classes;
        for (var i = 0; i < classes.getLength(); i++) {
            var coreqsMetCount = 0;
            var coreqs = classes.at(i).coReqs;
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
    // IF there are redundant schedules, this is where they'd disappear
    return true;
};

function report(type, message) {
    if (DEBUG) console.log(type + " removed because " + message);
}

// Testing ClassList object
// var allClassLength = classes.length;
t = new ClassList();
t._classes = classes.slice();
g = new ScheduleGenerator(t, options,
    preProcessFilter, processFilter, postProcessFilter);
console.log("Calculating...");
var schedules = g.generateSchedules();
var message = "Found " + schedules.length + " schedules in " +
    g.getCalculationTime() + " seconds";
alert(message);
console.log(message);
console.log(schedules);

$(function() {
    displaySchedules(schedules, 0, 200);
});