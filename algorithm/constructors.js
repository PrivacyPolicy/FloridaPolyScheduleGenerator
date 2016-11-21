// schedule:
// {
//     classes: [0, 1, 2, 3],
//     ranking: 129,
//     credits: 14
// }
function Schedule() {
    this.classes = new ClassList();
    this.ranking = 0;
    this.credits = 0;

    this.addClass = function(classObj) {
        this.classes.add(classObj);
    };

    this.removeClass = function(classObj) {
        this.classes.remove(classObj.id);
    };

    this.calculateRanking = function(options) {
        // TODO: implement a formula to determine ranking
        // from 0-infinity, higher = worse
        this.ranking = 0;
        return this.ranking;
    };
    this.calculateCredits = function() {
        this.credits = 0;
        for (var i = 0; i < this.classes.getLength(); i++) {
            this.credits += this.classes.at(i).course.credits;
        }
        return this.credits;
    };

    this.copy = function() {
        var copySchedule = new Schedule();
        copySchedule.classes = this.classes.copy();
        return copySchedule;
    };
}

// class:
// {
//     id: 3,
//     number: "CIS4362.01 I&T"
//     name: "Applied Cryptography",
//     preReqs: [0, 1, 2, 3],
//     coReqs: [1, 2],
//     postReqCount: 20,
//     credits: 3,
//     color: "?",
//     campus: "FLPoly",
//     building: "IST",
//     room: "1068",
//     times: [],
//     professor: "Freeman, Heather",
//     seatsMax: 20,
//     seatsLeft: 10,
//     electiveGroup: -1,
// }
function Class(
        id, course, times, professor, section,
        campus, building, room, seatsMax, seatsLeft) {
    // primary data about class
    this.id = id;
    this.course = course;
    this.times = times;
    this.professor = professor;
    this.section = section;

    // data about physical location
    this.campus = campus;
    this.building = building;
    this.room = room;
    this.seatsMax = seatsMax;
    this.seatsLeft = seatsLeft;
}

function Course(
        id, number, name, credits,
        preReqs, coReqs, electivesInGroup,
        color,
        classList) {
    // primary data about course
    this.id = id;
    this.number = number;
    this.name = name;
    this.credits = credits;

    // data about pre-/co-post-requisites and electives
    this.preReqs = preReqs;
    this.coReqs = coReqs;
    this.electivesInGroup = electivesInGroup;

    // data about the appearance of the class blocks
    this.color = color;

    this._classList = classList;
    if (classList !== undefined) {
        for (var i = 0; i < this._classList.getLength(); i++) {
            this._classList.at(i).course = this;
        }
    }

    this.getClassList = function() {
        return this._classList;
    };

    this.addClass = function(theClass) {
        this._classList.add(theClass);
        this._classList.get(theClass.id).course = this;
    };
}

// list of classes with easy accessors/manipulators
function ClassList(defaultClasses) {
    this._classes = defaultClasses || [];

    this.add = function(classObj) {
        this._classes.push(classObj);
    };

    this.getInd = function(classID) {
        for (var i = 0; i < this._classes.length; i++) {
            if (this._classes[i].id == classID) {
                return i;
            }
        }
        console.error("Invalid ClassList ID: " + classID);
        console.error(new Error().stack);
        return -1;
    };

    this.get = function(classID) {
        var ind = this.getInd(classID);
        return (ind > -1) ? this._classes[ind] : null;
    };

    this.at = function(ind) {
        return this._classes[ind];
    };

    this.remove = function(classID) {
        var ind = this.getInd(classID);
        if (ind > -1) {
            this.removeAt(ind);
        }
    };

    this.removeAt = function(ind) {
        this._classes.splice(ind, 1);
    };

    this.moveToFront = function(ind) {
        this._classes.unshift(this._classes.splice(ind, 1)[0]);
    };

    this.getLastItem = function() {
        return this._classes[this._classes.length - 1];
    };

    this.exists = function(classID) {
        for (var i = 0; i < this._classes.length; i++) {
            if (this._classes[i].id == classID) {
                return true;
            }
        }
        return false;
    };

    this.copy = function() {
        var listCopy = new ClassList();
        listCopy._classes = this._classes.slice();
        return listCopy;
    };

    this.getLength = function() {
        return this._classes.length;
    };

    this.toString = function() {
        var str = "[";
        for (var i = 0; i < this._classes.length; i++) {
            str += "Class{id:" + this._classes[i].id + "}";
            if (i < this._classes.length - 1) {
                str += ", ";
            }
        }
        return str + "]";
    };

    // TODO: consider using binary search/insert to speed things up a bit
    // May not be possible now with moveToFront()...
}

// list of classes with easy accessors/manipulators
function CourseList(defaultCourses) {
    this._courses = defaultCourses || [];

    this.add = function(courseObj) {
        this._courses.push(courseObj);
    };

    this.getInd = function(courseID) {
        for (var i = 0; i < this._courses.length; i++) {
            if (this._courses[i].id == courseID) {
                return i;
            }
        }
        console.error("Invalid CourseList ID: " + courseID);
        console.error(new Error().stack);
        return -1;
    };

    this.get = function(courseID) {
        var ind = this.getInd(courseID);
        return (ind > -1) ? this._courses[ind] : null;
    };

    this.at = function(ind) {
        return this._courses[ind];
    };

    this.remove = function(courseID) {
        var ind = this.getInd(courseID);
        if (ind > -1) {
            this.removeAt(ind);
        }
    };

    this.removeAt = function(ind) {
        this._courses.splice(ind, 1);
    };

    this.moveToFront = function(ind) {
        this._courses.unshift(this._courses.splice(ind, 1)[0]);
    };

    this.getLastItem = function() {
        return this._courses[this._courses.length - 1];
    };

    this.exists = function(courseID) {
        for (var i = 0; i < this._courses.length; i++) {
            if (this._courses[i].id == courseID) {
                return true;
            }
        }
        return false;
    };

    this.copy = function() {
        var listCopy = new CourseList();
        listCopy._courses = this._courses.slice();
        return listCopy;
    };

    this.getLength = function() {
        return this._courses.length;
    };

    this.toString = function() {
        var str = "[";
        for (var i = 0; i < this._courses.length; i++) {
            str += "Course{id:" + this._courses[i].id + "}";
            if (i < this._courses.length - 1) {
                str += ", ";
            }
        }
        return str + "]";
    };
}

// Calculate how many other courses depend on each course
function calculatePostReqCounts(courses) {
    // TODO: iterate through each course, find how many
    // courses depend on it (using dynamic programming,
    // recursive backtracking)
    // Note: coReqs do not count toward the postReqCount
}

// time:
// {
//     day: 1,
//     start: {
//         h: 13,
//         m: 30
//     },
//     end: {
//         h: 14,
//         m: 45
//     }
// }
function Time(day, startH, startM, endH, endM) {
    this.day = day;
    this.start = {
        h: startH,
        m: startM
    };
    this.end = {
        h: endH,
        m: endM
    };
    this.toString = function() {
        return DAYS[this.day] + ": " +
            ("0" + this.start.h).slice(-2) +
            ("0" + this.start.m).slice(-2) + "-" +
            ("0" + this.end.h).slice(-2) +
            ("0" + this.end.m).slice(-2);
    };
}

// electiveGroups:
// [
//     [0, 1, 2, 3],
//     ...
// ]
// function ElectiveGroups() {
//     this.groups = [];
//     this.newGroup = function() {
//         this.groups.push([]);
//         return this.groups.length - 1;
//     };
//     this.addClassToGroup = function(groupInd, classID) {
//         this.groups[groupInd].push(classID);
//     };
//     this.groupIDForClassID = function(classID) {
//         for (var i = 0; i < this.groups.length; i++) {
//             if (this.groups[i].indexOf(classID) > -1) {
//                 return i;
//             }
//         }
//         return -1;
//     };
//     this.at = function(groupInd) {
//         return this.groups[groupInd];
//     };
//     this.getLength = function() {
//         return this.groups.length;
//     };
// }

// options:
// {
//     classes: [// default: pref.neutral
//         pref.unacceptable, pref.unfavored, ...
//     ],
//     creditRange: {// default: pref.unacceptable
//         minValue: 12,
//         maxValue: 16,
//         favoredValue: 15
//     },
//     timesUnfavored: [// default: pref.unacceptable
//         ...
//     ],
//     timesFavored: [// default: pref.unacceptable
//         ...
//     ],
//     professors: {// default: pref.neutral
//         "Ding, Wei": pref.unfavored,
//         "Huber, Thomas": pref.favored,
//         ...
//     }
// }
// otherOptions:
// {
//     backToBack: pref.favored/pref.unfavored,
//     multipleElectives: false,
//     hideDing: false,
//     hideOtherMajors: true
// }
function Options() {
    this.coursesRequired = [];
    this.coursesFavored = [];
    this.coursesUnfavored = [];
    this.creditRange = { // default: between 1-20, ideally 15
        minValue: 1,
        maxValue: 20,
        favoredValue: 15
    };
    this._defaultTimes = true;
    this.timesUnfavored = [ // default: 8:00AM-6:00PM M-F
        new Time(1, 8, 0, 9, 0),
        new Time(1, 17, 0, 18, 0),
        new Time(2, 8, 0, 9, 0),
        new Time(2, 17, 0, 18, 0),
        new Time(3, 8, 0, 9, 0),
        new Time(3, 17, 0, 18, 0),
        new Time(4, 8, 0, 9, 0),
        new Time(4, 17, 0, 18, 0),
        new Time(5, 8, 0, 9, 0),
        new Time(5, 17, 0, 18, 0)
    ];
    this.timesNeutral = [ // default: 9:00AM-5:00PM M-R
        new Time(1, 9, 0, 17, 0),
        new Time(2, 9, 0, 17, 0),
        new Time(3, 9, 0, 17, 0),
        new Time(4, 9, 0, 17, 0)
    ];
    this.professors = {};

    // functions
    this.setCoursePreference = function(courseID, preferrence) {
        if (preferrence == pref.favored) {
            this.coursesFavored.push(courseID);
        } else if (preferrence == pref.unfavored) {
            this.coursesUnfavored.push(courseID);
        } else if (preferrence == pref.required) {
            this.coursesRequired.push(courseID);
        }
    }
    this.setCreditMin = function(value) {
        this.creditRange.minValue = value;
    };
    this.setCreditMax = function(value) {
        this.creditRange.maxValue = value;
    };
    this.setCreditFavoredValue = function(value) {
        this.creditRange.favoredValue = value;
    };
    this.addNeutralTime = function(time) {
        if (this._defaultTimes) {
            this._defaultTimes = false;
            this.timesUnfavored = [];
            this.timesNeutral = [];
        }
        this.timesNeutral.push(time);
    };
    this.addUnfavoredTime = function(time) {
        if (this._defaultTimes) {
            this._defaultTimes = false;
            this.timesUnfavored = [];
            this.timesNeutral = [];
        }
        this.timesUnfavored.push(time);
    };
    this.setProfessorPreference = function(professor, preferrence) {
        this.professors[professor] = preferrence;
    };

    // Other, less commonly altered options
    this.backToBack = pref.favored; // or pref.unfavored
    this.setFavorBackToBack = function(favor) {
        this.backToBack = (favor) ? pref.favored : pref.unfavored;
    };

    this.multipleElectives = false;
    this.setAllowMultipleElectives = function(allow) {
        this.multipleElectives = allow;
    };

    this.setHideDing = function(hide) {
        const dingName = "Ding, Wei";
        this.setProfessorPreference(dingName,
            (hide) ? pref.unacceptable : pref.neutral);
    };

    this.hideOtherMajorCourses = true;
    this.setHideOtherMajorCourses = function(hide) {
        this.hideOtherMajorCourses = hide;
    };

    this.hideFullClasses = true;
    this.setHideFullClasses = function(hide) {
        this.hideFullClasses = hide;
    };

    this.allowHalfCoRequisites = false;
    this.setAllowHalfCoRequisites = function(allow) {
        this.allowHalfCoRequisites = allow;
    };

    // functions:

    //credit range: closer = favored, further = neutral
    this.getCreditsPreference = function(credits) {
        if (credits < this.creditRange.minValue ||
            credits > this.creditRange.maxValue) return pref.unacceptable;
        if (credits == this.creditRange.favoredValue) return pref.favored;
        return pref.neutral;
    };
}

// collisionMatrix: (0 = unknown, 1 = OK, -1 = collision)
// [
//     [0],
//     [0, 0],
//     ...
//     [0, 0, 0, 0, 0, ..., 0],
//     [0, 0, 0, 0, 0, ..., 0, 0]
// ]
// Note: a collision matrix is, in this case, symmetrical.
// So, here's a non-redundant symmetric matrix implementation
function SymmetricMatrix(size) {
    // initialize the matrix
    this._matrix = [];
    for (var i = 0; i < size; i++) {
        this._matrix.push(
            Array(i + 1).fill(collType.unknown));
    }

    this._access = function(row, col) {
        if (col > row) {
            // accessed in the wrong order; let's fix that
            return this._access(col, row);
        } else {
            if (row >= this._matrix.length) return null;
            return {row: row, col: col};
        }
    };
    this.get = function(row, col) {
        var loc = this._access(row, col);
        if (loc == null) {
            console.error("Invalid matrix location: [" +
                row + ", " + col + "]");
            return null;
        } else {
            return this._matrix[loc.row][loc.col];
        }
    };
    this.set = function(row, col, value) {
        var loc = this._access(row, col);
        if (loc == null) {
            console.error("Invalid matrix location: [" +
                row + ", " + col + "]");
        } else {
            this._matrix[loc.row][loc.col] = value;
        }
    };
}

// // activeSchedule:
// {
//     classes: [0, 1, 2, 3],
//     score: -1,
//     credits: 3
// }
//
// // major:
// {
//     id: 0,
//     concentrations: [0, 1, 2],
// }
// // concentration:
// {
//     id: 0,
//     major: 0,
//     name: "Information Assurance & Cyber Security",
//     classes: [
//         ...
//     ]
// }
// // studentStatus:
// {
//     major: "",
//     concentration: "",
//     taken: ["...", "...", "..."], // classes
// }
