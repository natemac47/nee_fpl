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
var activitySetTriggeredStartOfWeek1 = shouldActivitySetTrigger(parentCase, hrTriggerUtil, 1); // Trigger on the first Monday after the user's start date
var activitySetTriggeredStartOfWeek2 = shouldActivitySetTrigger(parentCase, hrTriggerUtil, 2); // Trigger on the second Monday after the user's start date
var activitySetTriggeredStartOfWeek3 = shouldActivitySetTrigger(parentCase, hrTriggerUtil, 3); // Trigger on the third Monday after the user's start date
