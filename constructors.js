// schedule:
// {
//     classes: [0, 1, 2, 3],
//     ranking: 129,
//     credits: 14
// }
function Schedule(allClasses) {
    this.allClasses = allClasses;
    this.classes = new ClassList();
    this.ranking = 0;
    this.credits = 0;

    this.addClass = function(classID) {
        this.classes.add(classID);
    }

    this.removeClass = function(classID) {
        this.classes.remove(classID);
    }

    this.calculateRanking = function(options) {
        // TODO: implement a formula to determine ranking
        // from 0-infinity, higher = worse
        this.ranking = 0;
        return this.ranking;
    };
    this.calculateCredits = function() {
        var credits = 0;
        this.classes.each(function(theClass) {
            credits += allClasses.get(theClass).credits;
        });
        this.credits = credits;
        return credits;
    };

    this.copy = function() {
        var copySchedule = new Schedule(this.allClasses);
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
        id, number, name, credits, times, professor,
        campus, building, room, seatsMax, seatsLeft,
        preReqs, coReqs, electiveGroup,
        color) {
    // primary data about class
    this.id = id;
    this.number = number;
    this.name = name;
    this.credits = credits;
    this.times = times;
    this.professor = professor;

    // data about physical location
    this.campus = campus;
    this.building = building;
    this.room = room;
    this.seatsMax = seatsMax;
    this.seatsLeft = seatsLeft;

    // data about pre-/co-/post-requisites
    this.preReqs = preReqs;
    this.coReqs = coReqs;
    this.electiveGroup = electiveGroup;

    // data about the appearance of the class blocks
    this.color = color;
}
// classbuilder?

// list of classes with easy accessors/manipulators
function ClassList() {
    this._classes = [];

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

    this.remove = function(classID) {
        var ind = this.getInd(classID);
        if (ind > -1) {
            this._classes.splice(i, 1);
        }
    };

    this.each = function(func) {
        if (typeof func !== "function") {
            console.error("Invalid Argument: callback must" +
                " be a function, not a " + typeof func);
            return;
        }
        for (var i = 0; i < this._classes.length; i++) {
            func(this._classes[i]);
        }
    };

    this.copy = function() {
        var listCopy = new ClassList();
        listCopy._classes = this._classes.slice();
        return listCopy;
    };

    this.getLength = function() {
        return this._classes.length;
    };

    // TODO: use binary search/insert to speed things up a bit
}

// Calculate how many other classes depend on each class
function calculatePostReqCounts(classes) {
    // TODO: iterate through each class, find how many
    // classes depend on it (using dynamic programming,
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
}

// electiveGroups:
// [
//     [0, 1, 2, 3],
//     ...
// ]
function ElectiveGroups() {
    this.groups = [];
    this.newGroup = function() {
        this.groups.push([]);
        return this.groups.length - 1;
    };
    this.addClassToGroup = function(groupID, classID) {
        this.groups[groupID].push(classID);
    };
    this.groupIDForClass = function(classID) {
        for (var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].indexOf(classID) > -1) {
                return i;
            }
        }
        return -1;
    };
}

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
    this.classesRequired = [];
    this.classesFavored = [];
    this.classesUnfavored = [];
    this.creditRange = { // default: between 1-20, ideally 15
        minValue: 1,
        maxValue: 20,
        favoredValue: 15
    };
    this.timesNeutral = [ // default: 8:00AM-6:00PM M-F
        new Time(1, 8, 0, 18, 0),
        new Time(2, 8, 0, 18, 0),
        new Time(3, 8, 0, 18, 0),
        new Time(4, 8, 0, 18, 0),
        new Time(5, 8, 0, 18, 0)
    ];
    this.timesFavored = [ // default: 9:00AM-5:00PM M-R
        new Time(1, 9, 0, 17, 0),
        new Time(2, 9, 0, 17, 0),
        new Time(3, 9, 0, 17, 0),
        new Time(4, 9, 0, 17, 0)
    ];
    this.professors = {};

    // functions
    this.setClassPreference = function(classID, preferrence) {
        if (preferrence == pref.favored) {
            this.classesFavored.push(classID);
        } else if (preferrence == pref.unfavored) {
            this.classesUnfavored.push(classID);
        } else if (preferrence == pref.required) {
            this.classesRequired.push(classID);
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
    this.addUnfavoredTime = function(time) {
        this.timesUnfavored.push(time);
    };
    this.addFavoredTime = function(time) {
        this.timesFavored.push(time);
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

    this.hideOtherMajorClasses = true;
    this.setHideOtherMajorClasses = function(hide) {
        this.hideOtherMajorClasses = hide;
    };

    this.hideFullClasses = true;
    this.setHideFullClasses = function(hide) {
        this.hideFullClasses = hide;
    };

    this.allowHalfCoRequisites = true;
    this.setAllowHalfCoRequisites = function(allow) {
        this.allowHalfCoRequisites = allow;
    };

    // functions:

    //credit range: closer = favored, further = neutral
    this.getCreditsPreference = function(credits) {
        if (credits < range.minValue ||
            credits > range.maxValue) return pref.unacceptable;
        if (credits == range.favoredValue) return pref.favored;
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
