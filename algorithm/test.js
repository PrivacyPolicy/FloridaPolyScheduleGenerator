function displaySchedules(schedules, start, end) {
    if (!start) start = 0;
    if (!end) end = schedules.length;
    for (var i = start; i < end; i++) {
        if (!!schedules[i]) {
            displaySchedule(schedules[i], i);
        } else {
            console.log("No schedules found");
            break;
        }
    }
}
function displaySchedule(schedule, offset) {
    for (var i = 0; i < schedule.classes.getLength(); i++) {
        displayClass(schedule.classes.at(i), offset);
    }
}
function displayClass(theClass, offset) {
    const mult = .5;
    const hourHeight = 50;
    const hourWidth = 100;
    const startHour = 7;
    const endHour = 22;
    for (var i = 0; i < theClass.times.length; i++) {
        var time = theClass.times[i];
        var left = time.day * hourWidth;
        var right = left + hourWidth;
        var top = (time.start.h + (time.start.m / 60) - startHour) * hourHeight
            + offset * hourHeight * (endHour - startHour);
        var bottom = (time.end.h + (time.end.m / 60) - startHour) * hourHeight
            + offset * hourHeight * (endHour - startHour);
        displayBlock(left, top, right, bottom, theClass.course.name);
    }
}

function displayBlock(left, top, right, bottom, text) {
    var clone = $(".block.template")[0].cloneNode(true);
    clone.id = "";
    var $clone = $(clone).removeClass("template");
    $(document.body).append($clone);
    return $clone
        .css({left: left + "px", top: top + "px",
            width: (right - left) + "px", height: (bottom - top) + "px"})
        .text(text);
}



var classes = [
    new Class(0, courses[0],
        [
            new Time(1, 15, 0, 16, 15),
            new Time(3, 15, 0, 16, 15)
        ],
        "Kettani, Houssain",
        "", "", "", 30, 10
    ),
    new Class(1, courses[0],
        [
            new Time(2, 15, 0, 16, 15),
            new Time(4, 15, 0, 16, 15)
        ],
        "Kettani, Houssain",
        "", "", "", 30, 10
    ),
    new Class(2, courses[1],
        [
            new Time(1, 10, 0, 11, 50),
            new Time(3, 10, 0, 11, 50)
        ],
        "Foster, David",
        "", "", "", 30, 10
    ),
    new Class(3, courses[1],
        [
            new Time(1, 16, 0, 17, 50),
            new Time(3, 16, 0, 17, 50)
        ],
        "Foster, David",
        "", "", "", 30, 10
    ),
    new Class(4, courses[2],
        [
            new Time(1, 8, 0, 9, 50),
            new Time(3, 10, 0, 11, 50)
        ],
        "Bushey, Dean",
        "", "", "", 30, 10
    ),
    new Class(5, courses[2],
        [
            new Time(1, 12, 0, 13, 50),
            new Time(3, 12, 0, 13, 50)
        ],
        "Bushey, Dean",
        "", "", "", 30, 10
    ),
    new Class(6, courses[2],
        [
            new Time(1, 18, 0, 19, 50),
            new Time(3, 18, 0, 19, 50)
        ],
        "Staff",
        "", "", "", 30, 10
    ),
    new Class(7, courses[3],
        [
            new Time(1, 10, 30, 11, 45),
            new Time(3, 10, 30, 11, 45)
        ],
        "Staab, Jennifer",
        "", "", "", 30, 10
    ),
    new Class(8, courses[3],
        [
            new Time(2, 10, 30, 11, 45),
            new Time(4, 10, 30, 11, 45)
        ],
        "Yang, Feng Jen",
        "", "", "", 30, 10
    ),
    new Class(9, courses[3],
        [
            new Time(2, 12, 00, 13, 15),
            new Time(4, 12, 00, 13, 15)
        ],
        "Samarah, Mohammad",
        "", "", "", 30, 10
    ),
    new Class(10, courses[4],
        [
            new Time(2, 16, 30, 17, 20),
            new Time(5, 10, 30, 13, 50)
        ],
        "Elish, Karim",
        "", "", "", 30, 10
    ),
    new Class(11, courses[5],
        [
            new Time(2, 18, 0, 19, 15),
            new Time(4, 18, 00, 19, 15)
        ],
        "Mennie, Jim",
        "", "", "", 30, 10
    ),
    new Class(12, courses[5],
        [
            new Time(2, 16, 30, 17, 45),
            new Time(4, 16, 30, 17, 45)
        ],
        "Mennie, Jim",
        "", "", "", 30, 10
    ),
    new Class(13, courses[5],
        [
            new Time(1, 12, 0, 14, 30)
        ],
        "Shaikh, Shoaib",
        "", "", "", 30, 10
    ),
    new Class(14, courses[5],
        [
            new Time(2, 16, 30, 17, 45),
            new Time(4, 16, 30, 17, 45)
        ],
        "Staff",
        "", "", "", 30, 10
    ),
    new Class(15, courses[6],
        [
            new Time(2, 8, 0, 9, 15),
            new Time(4, 8, 0, 9, 15)
        ],
        "Mennie, Jim",
        "", "", "", 30, 10
    ),
    new Class(16, courses[7],
        [
            new Time(2, 10, 30, 11, 45),
            new Time(4, 10, 30, 11, 45)
        ],
        "Rashad, Sherif Said",
        "", "", "", 30, 10
    ),
    new Class(17, courses[8],
        [
            new Time(2, 13, 30, 14, 45),
            new Time(4, 13, 30, 14, 45)
        ],
        "Jaimes, Luis",
        "", "", "", 30, 10
    ),
    new Class(18, courses[8],
        [
            new Time(1, 15, 0, 16, 15),
            new Time(3, 15, 00, 16, 15)
        ],
        "Bushey, Dean",
        "", "", "", 30, 10
    ),
    new Class(19, courses[9],
        [
            new Time(2, 9, 0, 10, 15),
            new Time(4, 9, 00, 10, 15)
        ],
        "Bushey, Dean",
        "", "", "", 30, 10
    ),
    new Class(20, courses[10],
        [
            new Time(2, 9, 0, 10, 15),
            new Time(4, 9, 00, 10, 15)
        ],
        "Austin, Robert",
        "", "", "", 30, 10
    ),
    new Class(21, courses[11],
        [
            new Time(1, 9, 0, 10, 50)
        ],
        "Austin, Robert",
        "", "", "", 30, 10
    )
];
var courses = [
    new Course(0, "XYZ", "Applied Cryptography", 3,
        [], [], [], "red",
        new ClassList([classes[0], classes[1]])),
    new Course(1, "XYZ", "Computer Architecture and Organization", 3,
        [], [], [], "orange",
        new ClassList([classes[2], classes[3]])),
    new Course(2, "XYZ", "Computer Programming 2", 3,
        [], [], [], "yellow",
        new ClassList([classes[4], classes[5], classes[6]])),
    new Course(3, "XYZ", "Database 1", 3,
        [], [], [], "green",
        new ClassList([classes[7], classes[8], classes[9]])),
    new Course(4, "XYZ", "Design I", 3,
        [], [], [], "blue",
        new ClassList([classes[10]])),
    new Course(5, "XYZ", "Engineering & Technology Project Management", 3,
        [], [], [], "purple",
        new ClassList([classes[11], classes[12], classes[13], classes[14]])),
    new Course(6, "XYZ",
        "Legal, Ethical, and Management Issues in Technology", 3,
        [], [], [], "darkgrey",
        new ClassList([classes[15]])),
    new Course(7, "XYZ", "Machine Learning", 3,
        [], [], [], "#DDD",
        new ClassList([classes[16]])),
    new Course(8, "XYZ", "Programming Languages", 3,
        [], [], [], "violet",
        new ClassList([classes[17], classes[18]])),
    new Course(9, "XYZ", "Software Security Testing", 3,
        [], [], [], "aquamarine",
        new ClassList([classes[19]])),
    new Course(10, "XYZ", "Physics 1", 3,
        [], [11], [], "magenta",
        new ClassList([classes[20]])),
    new Course(11, "XYZ", "Physics 1 Lab", 3,
        [], [10], [], "pink",
        new ClassList([classes[21]]))
];


var options = new Options();
// options.setCoursePreference(2, pref.required);
// options.setCoursePreference(4, pref.required);
// options.setCoursePreference(5, pref.unfavored);
options.setCreditMin(2);
options.setCreditMax(10);
options.setCreditFavoredValue(6);
options.setHideDing(true);


t = new CourseList(courses);
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
