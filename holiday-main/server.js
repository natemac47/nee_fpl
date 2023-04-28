(function() {
  // Widget server script
  data.holiday = {};
  data.holidays = []; // Initialize data.holidays array

  // Get today's date
  var today = new GlideDateTime();
  today.setDisplayValue(new GlideDateTime().getDisplayValue());

  // Get the user's profile and bargaining unit
  var user = gs.getUser();
  var userGR = new GlideRecord('sys_user');
  userGR.get(user.getID());
	var entCode = userGR.getValue('u_legal_entity_code'); //get Legal Entity Code
	var empClass = userGR.getValue('u_employee_class'); //get Employee Class
	var subArea = userGR.getValue('u_personnel_sub_area1'); //get Personnel Sub Area

  // Determine the u_grouping_name based on the user's bargaining unit
  var groupingName;
  if (entCode === '7011' && empClass === 'Bargaining Unit') {
    groupingName = 'Duane Arnold Bargaining';
  } else if (entCode === '1500' || empClass === 'Bargaining Unit' && subArea === ('0001' || '3415' || '5103' || '5305' || '5306' || '5505' || '5620' || '5803')) {
    groupingName = 'FPL Bargaining IBEW Local 1055 ( former ';
  } else if (entCode === '1500' && empClass === 'Bargaining Unit' && subArea != ('3415' || '5103' || '5305' || '5306' || '5505' || '5620' || '5803')) {
    groupingName = 'FPL Bargaining SC-U4';
  } else if (entCode === '2401' && empClass === 'Bargaining Unit') {
    groupingName = 'Maine Bargaining';
  } else if (entCode === '5011') {
    groupingName = 'OSI';
  } else if (entCode === '6152' && subArea === ('0105' || '0110' || '0113' || '0114' || '0106' || '0109' || '0115' || '0107' || '0108')) {
    groupingName = 'Point Beach Bargaining (Red, Green, Whit';
  } else if (entCode === '7007') {
    groupingName = 'Seabrook';
  } else {
    groupingName = 'Company Standard';
  }

  // Query the u_hr_holidays table
  var holidayGR = new GlideRecord('u_hr_holidays');
  holidayGR.addQuery('u_grouping_name', groupingName);
  holidayGR.addQuery('u_date', '>=', today);
  holidayGR.orderBy('u_date');
  holidayGR.query();

  // Fetch all holidays and store them in data.holidays array
  while (holidayGR.next()) {
    var holiday = {};
    holiday.name = holidayGR.getValue('u_holiday_name');
    var holidayDate = new GlideDateTime(holidayGR.getValue('u_date'));
    var month = holidayDate.getMonthUTC();
    var day = holidayDate.getDayOfMonthUTC();
    holiday.date = getMonthName(month) + ' ' + day + ', ' + holidayDate.getYearUTC(); // Add the year to the formatted date
    data.holidays.push(holiday); // Add the holiday to data.holidays array

    // Get the next upcoming holiday
    if (data.holiday.name === undefined) {
      data.holiday.name = holiday.name;
      data.holiday.date = holiday.date
		}
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
