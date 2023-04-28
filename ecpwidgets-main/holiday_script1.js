(function() {
  /* Widget server script */

  data.holiday = {};
  data.userProfile = {};

  // Get the user's HR profile information
  var hrProfileGR = new GlideRecord('sys_user');
  hrProfileGR.addQuery('user', gs.getUserID());
  hrProfileGR.query();

  if (hrProfileGR.next()) {
    data.userProfile.hr_calendar = hrProfileGR.getValue('hr_calendar');

    // Get the holiday calendar information based on the user's HR profile
    var holidayCalendarGR = new GlideRecord('hr_holiday');
    holidayCalendarGR.addQuery('calendar', data.userProfile.hr_calendar);
    holidayCalendarGR.addQuery('date', '>=', gs.daysAgoStart(0)); // Only consider holidays from today onwards
    holidayCalendarGR.orderBy('date'); // Order the results by date
    holidayCalendarGR.setLimit(1); // Limit the results to the first upcoming holiday
    holidayCalendarGR.query();

    if (holidayCalendarGR.next()) {
      data.holiday = {
        name: holidayCalendarGR.getValue('name'),
        date: holidayCalendarGR.getValue('date'),
        description: holidayCalendarGR.getValue('description')
      };
    } else {
      data.error = "No upcoming holidays found for the user's calendar.";
    }
  } 

})();
