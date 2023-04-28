(function() {
    data.short_description = "Performance";
    data.description = "You have a performance task to complete:";
    data.url = "https://hcm20.ns2cloud.com/sf/pmreviews?bplte_company=NEE";
    data.urlText = "View tasks";

    options.short_description = options.short_description || data.short_description;
    options.description = options.description || data.description;
    options.url = options.url || data.url;
    options.urlText = options.urlText || data.urlText;
    options.icon = options.icon || "path/to/your/image.png";

    var user = gs.getUser();
    var userSysId = user.getID();

    var hrProfileGr = new GlideRecord('sn_hr_core_profile');
    hrProfileGr.addQuery('user', userSysId);
    hrProfileGr.query();
    if (hrProfileGr.next()) {
        var personnelNumber = hrProfileGr.u_personnel_number;

        var todosGr = new GlideRecord('sn_successfactors_inbound_todos');
        todosGr.addQuery('user_id', personnelNumber);
        todosGr.addQuery('category_id', 0);
        todosGr.addQuery('status', 'IN', '1,2');
        todosGr.orderByDesc('sys_created_on');
        todosGr.query();

        var taskCount = 0;
        if (todosGr.next()) {
            data.perftask = todosGr.getValue('todo_entry_name') || "Task";
            taskCount++;
            while (todosGr.next()) {
                taskCount++;
            }
        } else {
            data.perftask = "No tasks available";
        }
        
        if (taskCount > 1) {
            data.perftaskdescription = "And " + (taskCount - 1) + " other performance tasks.";
        } else if (taskCount === 1) {
            data.perftaskdescription = "No other performance tasks.";
        } else {
            data.perftaskdescription = "No performance tasks.";
        }

        options.perftask = options.perftask || data.perftask;
        options.perftaskdescription = options.perftaskdescription || data.perftaskdescription;
    }
})();
