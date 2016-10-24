function ScheduleGenerator(
        classes, options,
        preProcessFilter, processFilter, postProcessFilter) {
    this.all_classes = classes;
    this.classes = null;//classes.copy();
    this.options = options;

    this.preProcessFilter = preProcessFilter;
    this.processFilter = processFilter;
    this.postProcessFilter = postProcessFilter;

    this.schedules = [];
    this.collisionMatrix = null;

    // get how many schedules there are
    this.getScheduleCount = function() {
        return this.schedules.length;
    };

    // user-friendly code to start the calculations
    this.generateSchedules = function() {
        // TODO: put this code in a JS Worker
        var buildSchedule = new Schedule(this.all_classes);
        this.schedules = [];
        this.preProcessClasses();
        // (Dynamic Programming) used to remember previous
        // calculations when two classes didn't work before
        this.collisionMatrix =
            new SymmetricMatrix(this.classes.getLength(), 0);
        this.recGenerateSchedules(buildSchedule, 0);
        this.postProcessSchedules();
        return this.schedules;
    };

    // remove any classes that would never work in the first place
    this.preProcessClasses = function() {
        this.classes = this.all_classes.copy();
        var classes = this.classes._classes;
        for (var i = classes.length - 1; i >= 0; i--) {
            if (!this.preProcessFilter(classes[i])) {
                classes.splice(i, 1);
            }
        }
        // sort with must-have classes first to find those
        // collisions fastest (reduces computation time)
        for (var i = classes.length - 1; i >= 0; i--) {
            if (this.options.classesRequired.indexOf(classes[i].id) > -1) {
                // move to the start of the array
                classes.unshift(classes.splice(i, 1)[0]);
            }
        }
    };

    // remove any residual classes that passed but are still bad
    this.postProcessSchedules = function() {
        for (var i = 0; i < this.schedules.length; i++) {
            this.schedules[i].calculateCredits();
            this.schedules[i].calculateRanking(this.options);
        }
        // sort by ranking value
        this.schedules = this.schedules.sort(function(a, b) {
            if (a.ranking > b.ranking) return -1;
            if (a.ranking < b.ranking) return 1;
            return 0;
        });
    };

    // the core of this API, the recursive-backtracking
    // function that generates the schedules
    this.recGenerateSchedules = function(buildSchedule, classID) {
        if (this.isCompleteSchedule(buildSchedule)) {
            this.schedules.push(buildSchedule);
        }
        for (var i = classID + 1; i < this.classes._classes.length; i++) {
            if (this.nextStepIsValid(buildSchedule, i)) {
                this.addClass(buildSchedule, i);
                // recursive call:
                this.recGenerateSchedules(buildSchedule, i);
                this.removeClass(buildSchedule, i);
            }
        }
    };

    // the recursive-backtracking function's internal functions

    // if the overall schedule is valid
    this.isCompleteSchedule = function(schedule) {
        return postProcessFilter(this.classes, schedule);
    };

    // if, upon adding this class, the schedule wouldn't be invalid
    this.nextStepIsValid = function(schedule, classID) {
        // determine if there's collision using the collision
        // matrix (Dynamic Programming)
        // var collision = collType.unknown;
        // for (var i = 0; i < schedule.classes.length; i++) {
        //     for (var j = i + 1; j < schedule.classes.length; j++) {
        //         var row = schedule.classes[i].classID;
        //         var col = schedule.classes[j].classID;
        //         var collision = this.collisionMatrix.get(row, col);
        //         if (collision == collType.collision) {
        //             // we already calculated collision
        //             return false;
        //         } else if (collision == collType.unknown) {
        //             // uncalculated; do so now
        //             collision = this.checkCollision(
        //                 this.clients[row].times,
        //                 this.clients[col].times);
        //             this.collisionMatrix.set(row, col, collision);
        //             if (collision == collType.collision) return false;
        //         }
        //         // else, compatible (no collision); move on
        //     }
        // }
        var collision = collType.unknown;
        schedule.classes.each(function(row) {
            if (collision == collType.collision) return;
            schedule.classes.each(function(col) {
                if (collision == collType.collision) return;
                var rowID = schedule.classes.getInd(row.id);
                var colID = schedule.classes.getInd(col.id);
                var collision = this.collisionMatrix.get(row, col);
                if (collision == collType.collision) {
                    // we already calculated collision
                    return;
                    //return false;
                } else if (collision == collType.unknown) {
                    // uncalculated; do so now
                    collision = this.checkCollision(
                        this.clients[row].times,
                        this.clients[col].times);
                    this.collisionMatrix.set(row, col, collision);
                    if (collision == collType.collision) return;
                }
                // else, compatible (no collision); move on
            });
        });
        if (collision == collType.collision) {
            return false;
        }
        // add class to a copied schedule
        //var copy = new Schedule(schedule.classes.copy());
        var copy = schedule.copy();
        console.log(schedule);
        this.addClass(copy, classID);
        return processFilter(this.classes, copy);
    };

    // add the class to the schedule's class list
    this.addClass = function(schedule, classID) {
        schedule.addClass(classID);
    };

    // remove the class from the schedule's class list
    this.removeClass = function(schedule, classID) {
        schedule.removeClass(classID);
    };

    // compute if there's collision between two classes' times
    this.checkCollision = function(aTimes, bTimes) {
        for (var i = 0; i < aTimes.length; i++) {
            for (var j = 0; j < bTimes.length; j++) {
                var aStart = aTimes[i].start.h * 100 + aTimes[i].start.m;
                var aEnd = aTimes[i].end.h * 100 + aTimes[i].end.m;
                var bStart = bTimes[j].start.h * 100 + bTimes[j].start.m;
                var bEnd = bTimes[j].end.h * 100 + bTimes[j].end.m;
                if (aTimes.day == bTimes.day &&
                        aEnd > bStart && aStart < bEnd) {
                    return collTypes.collision;
                }
            }
        }
        return collTypes.compatible;
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
