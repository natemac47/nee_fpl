(function() {
    // Lookup current user's u_personnel_number on the sn_hr_core_profile
    var user = gs.getUser();
    var userID = user.getID();
    
    var hrProfileGr = new GlideRecord('sn_hr_core_profile');
    hrProfileGr.addQuery('user', userID);
    hrProfileGr.query();
    
    if (hrProfileGr.next()) {
        var personnelNumber = hrProfileGr.getValue('u_personnel_number');
        
        // Match against the user_id on the sn_successfactors_inbound_todos table
        var todosGr = new GlideRecord('sn_successfactors_inbound_todos');
        todosGr.addQuery('user_id', personnelNumber);
        todosGr.orderBy('due_date');
        todosGr.query();
        
        var todoCount = 0;
        var closestTodo = {};
        
        while (todosGr.next()) {
            todoCount++;
            
            if (todoCount === 1) {
                closestTodo = {
                    todo_entry_name: todosGr.getValue('todo_entry_name'),
                    due_date: todosGr.getValue('due_date')
                };
            }
        }
        
        // Set the returned values
        data.closestTodo = closestTodo;
        data.remainingTodos = todoCount - 1;
    } else {
        data.closestTodo = {};
        data.remainingTodos = 0;
    }

    data.short_description = "Upcoming Course";
    data.description = "Your next development training is scheduled for:";
    data.url = "https://hcm20.ns2cloud.com/sf/learning?bplte_company=NEE";
    data.urlText = "View course details";
    data.learning_title = closestTodo.todo_entry_name || "No available courses";
    data.date = closestTodo.due_date ? new Date(closestTodo.due_date).toLocaleDateString() : "N/A";
    
    options.short_description = options.short_description || data.short_description;
    options.description = options.description || data.description;
    options.url = options.url || data.url;
    options.urlText = options.urlText || data.urlText;
    options.icon = options.icon || "path/to/your/image.png";
    options.date = options.date || data.date;
    options.learning_title = options.learning_title || data.learning_title;
})();
