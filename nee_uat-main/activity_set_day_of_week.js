(function shouldActivitySetTrigger(parentCase /* GlideRecord for parent case */, hrTriggerUtil /* hr_TriggerUtil script include instance */) {
  // Get the current date and time in the local time zone of the ServiceNow instance
  var now = new GlideDateTime();
  var localTime = now.getLocalTime();
  
  // Create a new GlideDateTime object using the local time string
  var localNow = new GlideDateTime(localTime);
  
  // Check if the current day of the week is Monday
  if (localNow.getDayOfWeek() == 1) { // 1 is the code for Monday in ServiceNow
    // If it's Monday, return true to trigger the activity set
    return true;
  } else {
    // If it's not Monday, return false to prevent the activity set from triggering
    return false;
  }
})(parentCase, hrTriggerUtil);
