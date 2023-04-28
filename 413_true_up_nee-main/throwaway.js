(function executeRule(current, previous /*null when async*/ ) {
    
    // Check if the u_scheduled_start_date_change field has been updated
    if (current.u_scheduled_start_date_change != previous.u_scheduled_start_date_change) {
        
        // Query the Task table for all tasks that have parent records on the sn_hr_le_case table
        var taskGr = new GlideRecord('task');
        taskGr.addQuery('parent.sys_class_name', 'sn_hr_le_case');
        taskGr.query();

        // For each task, recalculate the due_date based on the task's template and data offset
        while (taskGr.next()) {
            var taskTemplate = taskGr.template;
            if (taskTemplate.nil())
                continue;
            
            var taskDataOffsetType = taskGr.data_offset_type;
            if (taskDataOffsetType.nil())
                continue;
            
            var taskDataOffsetQuantity = taskGr.data_offset_quantity;
            if (taskDataOffsetQuantity.nil())
                continue;
            
            var taskDataOffsetUnits = taskGr.data_offset_units;
            if (taskDataOffsetUnits.nil())
                continue;
            
            // Calculate the new due date based on the task's template and data offset
            var taskDueDate = taskTemplate.getDueDate(current.u_scheduled_start_date_change, taskDataOffsetType, taskDataOffsetQuantity, taskDataOffsetUnits);
            
            // Update the due_date field to the new calculated due date
            taskGr.due_date = taskDueDate;
            taskGr.update();
        }
    }
})(current, previous);
