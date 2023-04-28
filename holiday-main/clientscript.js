function(spModal) {
  var c = this;

  c.openHolidaysModal = function() {
    spModal.open({
      title: 'Holidays Grouping',
      message: '',
      templateUrl: 'holidaysModal.html', // Change this line
      controller: function($scope, $uibModalInstance, data) {
        var c = this;
        c.holidays = holidays.data;

        c.closeHolidaysModal = function() {
          $uibModalInstance.dismiss('cancel');
        };
      },
      controllerAs: 'c',
      buttons: [],
      data: c.data.holidays
    });
  };
}
