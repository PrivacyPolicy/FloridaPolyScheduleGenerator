function ScheduleGenerator(
        courses, options,
        preProcessFilter, processFilter, postProcessFilter,
        rankingFilter) {
    this.all_courses = courses;
    this.courses = null;
    this.options = options;

    this.preProcessFilter = preProcessFilter;
    this.processFilter = processFilter;
    this.postProcessFilter = postProcessFilter;
    this.rankingFilter = rankingFilter;

    this.schedules = [];
    this.calculationTime = 0;
    this.collisionMatrix = null;

    // get how many schedules there are
    this.getScheduleCount = function() {
        return this.schedules.length;
    };

    // get how long the last calculation took
    this.getCalculationTime = function() {
        return this.calculationTime;
    };

    // user-friendly code to start the calculations
    this.generateSchedules = function(callback) {
        var progressCallback = (typeof callback == "function")
            ? callback : function() {};
        // TODO: put this code in a JS Worker
        this.calculationTime = Date.now();
        var buildSchedule = new Schedule();
        this.schedules = [];
        var preProcess = this.preProcessClasses();
        if (!preProcess) {
            this.calculationTime = (Date.now() - this.calculationTime) / 1000;
            return [];
        }
        // // (Dynamic Programming) used to remember previous
        // // calculations when two classes didn't work before
        // this.collisionMatrix = new SymmetricMatrix(
        //     this.all_courses.getLength(), collType.unknown);
        // Don't bother calculating schedules where a required class
        // isn't in the schedule
        if (options.coursesRequired.length > 0) {
            this.recGenerateSchedules(buildSchedule, 0, progressCallback);
        } else {
            this.recGenerateSchedules(buildSchedule, 0, progressCallback);
            //this.recGenerateSchedules(buildSchedule, 1, progressCallback);
        }
        this.postProcessSchedules(progressCallback);
        this.calculationTime = (Date.now() - this.calculationTime) / 1000;
        return this.schedules;
    };

    // remove any classes that would never work in the first place
    this.preProcessClasses = function() {
        this.courses = this.all_courses.copy();
        for (var c = this.courses.getLength() - 1; c >= 0; c--) {
            var classes = this.courses.at(c).getClassList();
            for (var i = classes.getLength() - 1; i >= 0; i--) {
                if (!this.preProcessFilter(this.options, classes.at(i))) {
                    classes.removeAt(i);
                }
            }
            if (classes.getLength() == 0) {
                var id = this.courses.at(c).id;
                this.courses.removeAt(c);
                if (this.options.coursesRequired.indexOf(id) > -1) {
                    if (DEBUG) console.log(
                        "A required course doesn't meet the criteria");
                    return false;
                }
            }
        }
        // sort with must-have courses first to find those
        // collisions fastest (reduces computation time)
        var lastInd = 0;
        for (var c = this.courses.getLength() - 1; c >= lastInd; c--) {
            if (this.options.coursesRequired.indexOf(
                    this.courses.at(c).id) > -1) {
                this.courses.moveToFront(c);
                lastInd++;
            }
        }
        return true;
    };

    // remove any residual classes that passed but are overall bad
    this.postProcessSchedules = function(callback) {
        var maxRank = {}, minRank = {};
        callback("startedRanking");
        // var scheduleStrs = [];
        for (var i = this.schedules.length - 1; i >= 0; i--) {
            var schedule = this.schedules[i];
            // remove duplicates, if they exist
            // var str = schedule.toString();
            // if (scheduleStrs.indexOf(str) == -1) {
            //     scheduleStrs.push(str);
            // } else { // schedule already exists
            //     this.schedules.splice(i, 1);
            //     continue;
            // }
            schedule.calculateCredits();
            var ranking = schedule.calculateRanking(
                this.options, rankingFilter);
            for (var r in ranking) {
                var oldMax = maxRank[r] || 0, oldMin = minRank[r] || 0;
                maxRank[r] = Math.max(oldMax, ranking[r]);
                minRank[r] = Math.min(oldMin, ranking[r]);
            }
        }
        // sort by ranking value
        const rankWeights = {
            totalDays: 6,
            credits: 5,
            times: 4,
            professors: 3,
            courses: 2,
            backToBack: 1
        };
        // re-calculate
        for (var i = 0; i < this.schedules.length; i++) {
            var oldRanking = this.schedules[i].ranking;
            var newRanking = 0;
            var range = 0;
            for (var r in oldRanking) {
                range = maxRank[r] - minRank[r];
                if (range == 0 || isNaN(range)) continue;
                newRanking += rankWeights[r] * (oldRanking[r] / range);
            }
            this.schedules[i].normalizedRanking = newRanking;
        }
        this.schedules = this.schedules.sort(function(a, b) {
            var aR = a.normalizedRanking,
                bR = b.normalizedRanking;
            if (aR < bR) return -1;
            if (aR > bR) return 1;
            return 0;
        });

    };

    // the core of this API, the recursive-backtracking
    // function that generates the schedules
    this.recGenerateSchedules = function(
            buildSchedule, courseInd, progressCallback) {
        // if (this.isCompleteSchedule(buildSchedule)) {
        //     this.schedules.push(buildSchedule.copy());
        // }
        // for (var i = classInd; i < this.classes.getLength(); i++) {
        //     if (this.nextStepIsValid(buildSchedule, i)) {
        //         this.addClass(buildSchedule, i);
        //         // recursive call:
        //         this.recGenerateSchedules(buildSchedule, i + 1);
        //         this.removeClass(buildSchedule, i);
        //     }
        // }
        if (this.isCompleteSchedule(buildSchedule)) {
            this.schedules.push(buildSchedule.copy());
            progressCallback(this.schedules.length);
        }
        for (var i = courseInd; i < this.courses.getLength(); i++) {
            var classList = this.courses.at(i).getClassList();
            for (var j = 0; j < classList.getLength(); j++) {
                if (this.nextStepIsValid(buildSchedule, i, j)) {
                    this.addClass(buildSchedule, i, j);
                    // recursive call:
                    this.recGenerateSchedules(
                        buildSchedule, i + 1, progressCallback);
                    this.removeClass(buildSchedule, i, j);
                }
            }
        }
    };

    // the recursive-backtracking function's internal functions

    // if the overall schedule is valid
    this.isCompleteSchedule = function(schedule) {
        return postProcessFilter(this.options, schedule);
    };

    // if, upon adding this class, the schedule would be valid
    this.nextStepIsValid = function(schedule, courseInd, classInd) {
        // add class to a copied schedule
        var scheduleCopy = schedule.copy();
        this.addClass(scheduleCopy, courseInd, classInd);

        // // determine if there's collision on the new class using the
        // // collision matrix (Dynamic Programming) or just by calculating
        // var lastInd = scheduleCopy.classes.getLength() - 1;
        // var lastID = scheduleCopy.classes.at(lastInd).id;
        // // the location of the class with id in all_classes
        // var allInd_lastInd = this.all_classes.getInd(lastID);
        // for (var i = 0; i < lastInd; i++) {
        //     var iID = scheduleCopy.classes.at(i).id;
        //     var allInd_i = this.all_classes.getInd(iID);
        //     var collision =
        //         this.collisionMatrix.get(allInd_i, allInd_lastInd);
        //     if (collision == collType.collision) {
        //         // we already calculated collision before
        //         return false;
        //     } else if (collision == collType.unknown) {
        //         // uncalculated; calculate and store the answer
        //         collision = this.checkCollision(
        //             scheduleCopy.classes.at(i).times,
        //             scheduleCopy.classes.at(lastInd).times);
        //         this.collisionMatrix.set(allInd_i, allInd_lastInd, collision);
        //         if (collision == collType.collision) return false;
        //     }
        //     // else, compatible (no collision); move on
        // }
        // Using no collision matrix: test and see if it's even worth it
        var lastInd = scheduleCopy.classes.getLength() - 1;
        for (var i = 0; i < lastInd; i++) {
            var collision = this.checkCollision(
                scheduleCopy.classes.at(i).times,
                scheduleCopy.classes.at(lastInd).times);
            if (collision == collType.collision) return false;
        }
        return processFilter(this.options, scheduleCopy);
    };

    // add the class to the schedule's class list
    this.addClass = function(schedule, courseInd, classInd) {
        var theClass = this.courses.at(courseInd).getClassList().at(classInd);
        if (theClass == null) {
            console.error("Invalid schedule course/class index: "
                + courseInd + "/" + classInd);
            return;
        } else {
            schedule.addClass(theClass);
        }
    };

    // remove the class from the schedule's class list
    this.removeClass = function(schedule, courseInd, classInd) {
        schedule.removeClass(this.courses.at(courseInd).getClassList().at(classInd));
    };

    // compute if there's collision between two classes' times
    this.checkCollision = function(aTimes, bTimes) {
        try {
            aTimes[0].start.h;
            bTimes[0].start.h;
        } catch (e) {
            console.error("checkCollision: either a non-Time object was "
                + "given or the time values don't exist");
            return collType.unknown;
        }
        for (var i = 0; i < aTimes.length; i++) {
            for (var j = Math.max(0, i - 1); j < bTimes.length; j++) {
                var aStart = aTimes[i].start.h * 100 + aTimes[i].start.m;
                var aEnd = aTimes[i].end.h * 100 + aTimes[i].end.m;
                var bStart = bTimes[j].start.h * 100 + bTimes[j].start.m;
                var bEnd = bTimes[j].end.h * 100 + bTimes[j].end.m;
                if (aTimes[i].day == bTimes[j].day) {
                    if ((aEnd > bStart && aStart < bEnd) ||
                        (aStart < bEnd && aEnd > bStart)) {
                        return collType.collision;
                    }
                }
            }
        }
        return collType.compatible;
    };
}

// recursive-backtracking template:
// function findSolutions(n, other params) {
//     if (is a solution) {
//         add one to the counter
//         add to the solutions array
//     } else {
//         for (val = all of next step's possible values) {
//             if (isValid(val, n)) {
//                 addValue(val, n);
//                 // recursive call:
//                 findSolutions(n + 1, other params);
//                 removeValue(val, n);
//             }
//         }
//     }
// }
