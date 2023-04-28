function($scope) {
  var c = this;

  c.showHolidaysPopup = function() {
    var holidaysPopup = angular.element("#holidaysPopup");
    holidaysPopup.empty(); // Clear the previous holidays data

    var tableHtml = c.generateHolidaysTableHtml(c.data.holidays);
    holidaysPopup.html(tableHtml);
    holidaysPopup.show();
  };

  c.generateHolidaysTableHtml = function(holidays) {
    var tableHtml = '<table border="1" cellpadding="10" cellspacing="0">';

    // Generate table header
    tableHtml += '<tr><th>Holiday Name</th><th>Date</th></tr>';

    // Generate table rows
    for (var i = 0; i < holidays.length; i++) {
      var holidayDate = new Date(holidays[i].date);
      var formattedDate = holidayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      tableHtml += '<tr><td>' + holidays[i].name + '</td><td>' + formattedDate + '</td></tr>';
    }

    tableHtml += '</table>';
    return tableHtml;
  };
}
