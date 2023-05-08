(function executeRule(current, previous /*null when async*/) {

    // Gliderecord to asmt_metric_result table where instance is the same as current
    var metricResultGR = new GlideRecord('asmt_metric_result');
    metricResultGR.addQuery('instance', current.sys_id);
    metricResultGR.query();

    while (metricResultGR.next()) {
        // Gets the actual_value field (answer is 0 or 1)
        var actualValue = metricResultGR.getValue('actual_value');

        // Looks up HR Tasks on the sn_hr_core_task table where the survey_instance is the same as current
        var hrTaskGR = new GlideRecord('sn_hr_core_task');
        hrTaskGR.addQuery('survey_instance', current.sys_id);
        hrTaskGR.query();

        while (hrTaskGR.next()) {
            // Get the parent value, which is a Lifecycle Event case on the sn_hr_le_case table
            var leCaseGR = new GlideRecord('sn_hr_le_case');
            leCaseGR.get(hrTaskGR.getValue('parent'));

            if (leCaseGR.isValid()) {
                // Get HR Profile from the Lifecycle Event case's subject_person_hr_profile
                var hrProfileGR = new GlideRecord('sn_hr_core_profile');
                hrProfileGR.get(leCaseGR.getValue('subject_person_hr_profile'));

                if (hrProfileGR.isValid()) {
                    // Writes the actual_value to the u_corporate_card on the HR Profile
                    hrProfileGR.setValue('u_corporate_card', actualValue);
                    hrProfileGR.update();
                }
            }
        }
    }

})(current, previous);
