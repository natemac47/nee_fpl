function(spModal) {
  var c = this;

  c.openHolidaysModal = function() {
    // Parse holidays data
    var holidays = c.data.holidays.map(function(holiday) {
      return {
        name: holiday.name,
        date: holiday.dateString
      };
    });

    // Create an HTML table string with the holiday data
    var message = '<table>';
    holidays.forEach(function(holiday) {
      message += '<tr><td>' + holiday.name + '</td><td>' + '&emsp;' + holiday.date + '</td></tr>';
    });
    message += '</table>';

    spModal.open({
      title: 'Holidays',
      message: message,
      controller: function($scope, $uibModalInstance) {
        $scope.closeHolidaysModal = function() {
          $uibModalInstance.dismiss('cancel');
        };
      },
      controllerAs: 'c',
      buttons: [
        {
          label: 'Close',
          cancel: true
        }
      ]
    });
  };
}
