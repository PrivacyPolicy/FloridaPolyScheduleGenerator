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
