(function() {
  // Widget server script
  data.holiday = {};

  // Get today's date
  var today = new GlideDateTime();
  today.setDisplayValue(new GlideDateTime().getDisplayValue());

  // Get the user's profile and bargaining unit
  var user = gs.getUser();
  var userGR = new GlideRecord('sys_user');
  userGR.get(user.getID());
  var bargainingUnit = userGR.getValue('u_bargaining_unit');

  // Determine the u_grouping_name based on the user's bargaining unit
  var groupingName;
  if (bargainingUnit === 'BU1') {
    groupingName = 'Calendar 1';
  } else if (bargainingUnit === 'BU2') {
    groupingName = 'Calendar 2';
  } else if (bargainingUnit === 'BU3') {
    groupingName = 'Calendar 3';
  } else if (bargainingUnit === 'BU4') {
    groupingName = 'Calendar 4';
  } else if (bargainingUnit === 'BU5') {
    groupingName = 'Calendar 5';
  } else if (bargainingUnit === 'BU6') {
    groupingName = 'Calendar 6';
  } else if (bargainingUnit === 'BU7') {
    groupingName = 'Calendar 7';
  } else {
    groupingName = 'Company Standard';
  }

  // Query the u_hr_holidays table
  var holidayGR = new GlideRecord('u_hr_holidays');
  holidayGR.addQuery('u_grouping_name', groupingName);
  holidayGR.addQuery('u_date', '>=', today);
  holidayGR.orderBy('u_date');
  holidayGR.query();

  // Get the next coming holiday
  if (holidayGR.next()) {
    data.holiday.name = holidayGR.getValue('u_holiday_name');
    var holidayDate = new GlideDateTime(holidayGR.getValue('u_date'));
    var month = holidayDate.getMonthUTC();
    var day = holidayDate.getDayOfMonthUTC();
    data.holiday.date = getMonthName(month) + ' ' + day;
  } else {
    data.holiday.name = 'No upcoming holidays found';
    data.holiday.date = '';
  }

  // Function to get month name from month number
  function getMonthName(monthNumber) {
    var monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1];
  }
})();
