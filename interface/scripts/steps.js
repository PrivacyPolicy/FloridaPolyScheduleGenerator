// Step 3
function addClasses(courses) {
    var $course = $(".courseOption").first();
    $course.parent().html($course);
    for (var i = 0; i < courses.length; i++) {
        var newCourse = $course.get(0).cloneNode(true);
        newCourse.getElementsByClassName("courseName")[0].innerHTML =
            courses[i].name;
        newCourse.children[1].id = "courseNum" + courses[i].id;
        $course.after(newCourse);
    }
}

$(function() {
    addClasses([
        {id: "01", name:"Course1"},
        {id: "02", name:"Course2"},
        {id: "03", name:"Course3"},
        {id: "04", name:"Course4"},
        {id: "05", name:"Course5"},
        {id: "06", name:"Course6"}]);
});