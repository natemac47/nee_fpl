(function executeRule(current, previous /*null when async*/) {

    // Trigger: State changes to complete and Metric Type is Corporate Cell Phone
    if (current.state == 'complete' && current.metric_type == 'corporate_cell_phone') {

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
                // Get HR Task's parent
                var hrTaskParentGR = new GlideRecord('sn_hr_core_task');
                hrTaskParentGR.get(hrTaskGR.getValue('parent'));

                if (hrTaskParentGR.isValid()) {
                    // Get HR Profile from the HR Task's parent subject_person_hr_profile
                    var hrProfileGR = new GlideRecord('sn_hr_core_profile');
                    hrProfileGR.get(hrTaskParentGR.getValue('subject_person_hr_profile'));

                    if (hrProfileGR.isValid()) {
                        // Writes the actual_value to the u_corporate_card on the HR Profile
                        hrProfileGR.setValue('u_corporate_card', actualValue);
                        hrProfileGR.update();
                    }
                }
            }
        }
    }

})(current, previous);
