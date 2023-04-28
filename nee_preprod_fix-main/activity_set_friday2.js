function shouldActivitySetTrigger(parentCase /* GlideRecord for parent case */,
    hrTriggerUtil /* hr_TriggerUtil script include instance */, weekNumber) {
    gs.info("Weekly Activity Set Execution");

    var scheduledStartDate = parentCase.subject_person_hr_profile.u_scheduled_start_date;
    var currentDate = new GlideDateTime();

    var nextFriday = new GlideDateTime(scheduledStartDate);
    var daysTillFriday = (12 - nextFriday.getDayOfWeek()) % 7;
    nextFriday.addDays(daysTillFriday);

    var targetFriday = new GlideDateTime(nextFriday);
    targetFriday.addDays(7 * (weekNumber - 1));

    // Check if current date is the target Friday
    if (currentDate.sameDay(targetFriday)) {
        gs.info("Weekly Activity Set Triggered: True");
        return true;
    } else {
        gs.info("Weekly Activity Set Triggered: False");
        return false;
    }
}

// Call the function with appropriate parameters for the desired Activity Set
var activitySetTriggeredEndOfWeek1 = shouldActivitySetTrigger(parentCase, hrTriggerUtil, 1); // Trigger on the first Friday after the user's start date

// Trigger the Activity Set for the end of Week 1
if (activitySetTriggeredEndOfWeek1) {
    gs.info("Activity Set for the end of Week 1 is triggered.");
    // The Activity Set will automatically create the tasks.
} else {
    gs.info("Activity Set for the end of Week 1 is NOT triggered.");
}
