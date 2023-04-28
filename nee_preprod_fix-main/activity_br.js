(function executeRule(current, previous /*null when async*/) {
    // Get the subject person's sys_id
    var subjectPersonSysId = current.subject_person.sys_id;

    // Get the HR profile of the subject person
    var hrProfile = new GlideRecord('sn_hr_core_profile');
    hrProfile.addQuery('user', subjectPersonSysId);
    hrProfile.query();

    if (hrProfile.next()) {
        // Get the u_scheduled_start_date from the HR profile
        var scheduledStartDate = new GlideDateTime(hrProfile.u_scheduled_start_date);

        // Calculate the day of the week for the scheduled start date
        var dayOfWeek = scheduledStartDate.getDayOfWeek();

        // Check if the user starts on Friday
        if (dayOfWeek == 5) { // Friday
            // Set the u_preboarder_start_date to the scheduled start date
            current.u_preboarder_start_date = scheduledStartDate;
        } else {
            // Calculate the number of days to add to reach the first Friday after the scheduled start date
            var daysToAdd = (5 /* Friday */ - dayOfWeek + 7) % 7;

            // Add the calculated number of days to the scheduled start date
            scheduledStartDate.addDays(daysToAdd);

            // Set the u_preboarder_start_date to the first Friday after the scheduled start date
            current.u_preboarder_start_date = scheduledStartDate;
        }
    }
})(current, previous);
