(function executeRule(current, previous /*null when async*/ ) {

    // Query the Task table for all tasks that are assigned to the previous opened_for user and associated with the current Lifecycle Event record
    var taskGr = new GlideRecord('task');
    taskGr.addQuery('assigned_to', previous.opened_for);
    taskGr.addQuery('parent', current.sys_id);
    taskGr.query();

    // For each task, update the assigned_to field to the current opened_for user
    while (taskGr.next()) {
        taskGr.assigned_to = current.opened_for;
        taskGr.update();
    }

})(current, previous);
