(function() {
  data.vacationTotal = 0;
  data.vacationUsed = 0;
  data.vacationRequested = 0;
  data.sickLeaveTotal = 0;
  data.sickLeaveUsed = 0;
  data.sickLeaveRequested = 0;

  // Replace this with logic to fetch time off data from the appropriate table(s)
  // based on the logged-in user.
  // For demonstration purposes, we're using hardcoded values.

  data.vacationTotal = 20;
  data.vacationUsed = 10;
  data.vacationRequested = 5;
  data.sickLeaveTotal = 10;
  data.sickLeaveUsed = 4;
  data.sickLeaveRequested = 2;

  data.vacationUsedPercentage = (data.vacationUsed / data.vacationTotal) * 100;
  data.vacationRequestedPercentage = (data.vacationRequested / data.vacationTotal) * 100;
  data.sickLeaveUsedPercentage = (data.sickLeaveUsed / data.sickLeaveTotal) * 100;
  data.sickLeaveRequestedPercentage = (data.sickLeaveRequested / data.sickLeaveTotal) * 100;
})();

options.url = 'https://example.com/available-time-off';
options.urlText = 'VIEW YOUR TIME OFF';
