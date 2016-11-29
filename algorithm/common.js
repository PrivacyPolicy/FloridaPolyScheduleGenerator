const DEBUG = true;

// days:
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_CHARS = ["Su", "M", "T", "W", "R", "F", "Sa"];

// pref (of preferrence setting):
var pref = {
    unacceptable: -2,
    unfavored: -1,
    neutral: 0,
    favored: 1,
    required: 2
};
var collType = {
    collision: -1,
    unknown: 0,
    compatible: 1
};

const DAY_TO_INT = {"M": 1, "T": 2, "W": 3, "R": 4, "F": 5};
function sectionToClass(courseNumber, sectionObj) {
    var id = courseNumber + sectionObj.section;
    var times = [], professors = [], rooms = [];
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

function getCourseWithID(courses, courseID) {
    for (var i = 0; i < courses.length; i++) {
        if (courses[i].id == courseID) {
            return courses[i];
        }
    }
    return null;
}
