(function executeRule(current, previous /*null when async*/) {

    // Check if u_scheduled_start_date has been changed
    if (current.u_scheduled_start_date != previous.u_scheduled_start_date) {
        
        // Calculate the difference in days between the new and old start dates
        var differenceInDays = gs.dateDiff(previous.u_scheduled_start_date, current.u_scheduled_start_date, true);

        // Query Lifecycle events with the current user as the subject person
        var lifecycleEventGR = new GlideRecord('x_snc_lifecycle_event');
        lifecycleEventGR.addQuery('subject_person', current.sys_id);
        lifecycleEventGR.query();

        // Iterate through the retrieved Lifecycle events
        while (lifecycleEventGR.next()) {

            // Query associated HR Tasks for the current Lifecycle event
            var hrTaskGR = new GlideRecord('x_snc_hr_task');
            hrTaskGR.addQuery('lifecycle_event', lifecycleEventGR.sys_id);
            hrTaskGR.query();

            // Iterate through the retrieved HR Tasks
            while (hrTaskGR.next()) {

                // Update the HR Task's start and end dates based on the difference in days
                hrTaskGR.start_date = gs.daysAgo(-differenceInDays + parseInt(hrTaskGR.start_date));
                hrTaskGR.end_date = gs.daysAgo(-differenceInDays + parseInt(hrTaskGR.end_date));
                hrTaskGR.update();
            }
        }
    }

})(current, previous);
