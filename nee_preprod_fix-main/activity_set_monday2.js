function shouldActivitySetTrigger(parentCase /* GlideRecord for parent case */,
    hrTriggerUtil /* hr_TriggerUtil script include instance */, weekNumber) {
    gs.info("Weekly Activity Set Execution");

    var scheduledStartDate = parentCase.subject_person_hr_profile.u_scheduled_start_date;
    var currentDate = new GlideDateTime();

    var nextMonday = new GlideDateTime(scheduledStartDate);
    var daysTillMonday = (9 - nextMonday.getDayOfWeek()) % 7;
    nextMonday.addDays(daysTillMonday);

    var targetMonday = new GlideDateTime(nextMonday);
    targetMonday.addDays(7 * (weekNumber - 1));

    // Check if current date is the target Monday
    if (currentDate.sameDay(targetMonday)) {
        gs.info("Weekly Activity Set Triggered: True");
        return true;
    } else {
        gs.info("Weekly Activity Set Triggered: False");
        return false;
    }
}

// Call the function with appropriate parameters for the desired Activity Set
var activitySetTriggeredStartOfWeek2 = shouldActivitySetTrigger(parentCase, hrTriggerUtil, 2); // Trigger on the second Monday after the user's start date

// Trigger the Activity Set for Week 2
if (activitySetTriggeredStartOfWeek2) {
    gs.info("Activity Set for the start of Week 2 is triggered.");
    // The Activity Set will automatically create the tasks.
} else {
    gs.info("Activity Set for the start of Week 2 is NOT triggered.");
}
