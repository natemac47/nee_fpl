(function executeRule(current, previous /*null when async*/) {

    // Check if the u_scheduled_start_date has changed
    if (current.u_scheduled_start_date != previous.u_scheduled_start_date) {

        // Get sys_user record from HR Profile
        var userGR = new GlideRecord('sys_user');
        if (userGR.get(current.user)) 
        

        // Convert u_scheduled_start_date to GlideDate objects
        var gdCurrentStartDate = new GlideDate();
        gdCurrentStartDate.setValue(current.u_scheduled_start_date.toString());
        var gdPreviousStartDate = new GlideDate();
        gdPreviousStartDate.setValue(previous.u_scheduled_start_date.toString());

        // Calculate the duration between the current and previous start dates in days
        var duration = gdCurrentStartDate.getNumericValue() - gdPreviousStartDate.getNumericValue();
        duration = duration / (24 * 60 * 60 * 1000); // Convert milliseconds to days

        // Query the Lifecycle table
        var leCaseGR = new GlideRecord('sn_hr_le_case');
        leCaseGR.addQuery('subject_person', userGR.sys_id);
        leCaseGR.query();

        gs.info('Lifecycle case count: ' + leCaseGR.getRowCount());

        // Iterate through the Lifecycle cases with the user as the subject_person
        while (leCaseGR.next()) {

            // Query the HR Task table
            var hrTaskGR = new GlideRecord('sn_hr_core_task');
            hrTaskGR.addQuery('parent', leCaseGR.sys_id);
            hrTaskGR.query();


            // Iterate through the HR tasks related to the Lifecycle case
            while (hrTaskGR.next()) {

                // Add or subtract the amount of days changed
                var hrTaskDueDate = new GlideDateTime(hrTaskGR.due_date);
                hrTaskDueDate.addDaysUTC(duration);
                hrTaskGR.due_date = hrTaskDueDate;

                // Update the HR task record
                hrTaskGR.update();
            }
        }
    }
})(current, previous);
