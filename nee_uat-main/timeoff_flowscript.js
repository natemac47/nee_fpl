(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {

    // Parse the JSON data
    var parsedJson = JSON.parse(jsonData);

    // Get the array of items
    var timeOffItems = parsedJson.root.n0_Z_HR_WS_GET_TIMEOFF_DATAResponse.ET_TIMEOFF_DATA.item;

    // Initialize HR profile fields
    var vacationHours = 0;
    var sickFamilyCareHours = 0;
    var floatingHolidaysHours = 0;
    var vacationBuyHours = 0;

    // Loop through the items and parse the hours for each time type
    for (var i = 0; i < timeOffItems.length; i++) {
        var item = timeOffItems[i];
        var timeType = item.TIME_TYPE_TEXT;

        switch (timeType) {
            case 'Vacation-Current Year':
                vacationHours = parseFloat(item.ENTITLE_HOURS.trim());
                break;
            case 'Sick/FamilyCare/Preventiv':
                sickFamilyCareHours = parseFloat(item.ENTITLE_HOURS.trim());
                break;
            case 'Floating Holidays':
                floatingHolidaysHours = parseFloat(item.ENTITLE_HOURS.trim());
                break;
            case 'Vacation Buy-40 Hrs':
                vacationBuyHours = parseFloat(item.ENTITLE_HOURS.trim());
                break;
        }
    }

    // Update HR profile fields
    // Assuming you have userHRProfile as a GlideRecord instance of the user's HR profile
    userHRProfile.setValue('vacation_hours', vacationHours);
    userHRProfile.setValue('sick_family_care_hours', sickFamilyCareHours);
    userHRProfile.setValue('floating_holidays_hours', floatingHolidaysHours);
    userHRProfile.setValue('vacation_buy_hours', vacationBuyHours);
    userHRProfile.update();

})(request, response);
