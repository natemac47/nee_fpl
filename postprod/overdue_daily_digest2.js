(function() {

    // Get today's date and set the time to 00:00:00
    var today = new GlideDateTime();
    today.setDisplayValue(today.getDisplayValue().split(' ')[0] + ' 00:00:00');

    // Build GlideRecord query for sn_hr_core_task table
    var hrTaskGR = new GlideRecord('sn_hr_core_task');
    hrTaskGR.addEncodedQuery("due_date<=javascript:gs.endOfToday()^hr_service=007670d30ba86110e7d206c842f8df61^ORhr_service=4c5f019b0b6c6110e7d206c842f8df83^stateIN10,18^assigned_to.emailISNOTEMPTY");
    hrTaskGR.query();

    // Create a map to store users and their respective overdue tasks
    var userTaskMap = {};

    while (hrTaskGR.next()) {
        var assignedTo = hrTaskGR.getValue('assigned_to');
        if (!assignedTo) {
            continue;
        }

        // If the user is not in the map, add them with the current task
        if (!userTaskMap.hasOwnProperty(assignedTo)) {
            userTaskMap[assignedTo] = [{
                taskNumber: hrTaskGR.getValue('number'),
                taskLink: hrTaskGR.getDisplayValue('number')
            }];
        } else {
            // If the user is already in the map, add the current task to their list
            userTaskMap[assignedTo].push({
                taskNumber: hrTaskGR.getValue('number'),
                taskLink: hrTaskGR.getDisplayValue('number'),
				taskSysid: hrTaskGR.getValue('sys_id')
            });
        }
    }

    // Send email notifications to users with overdue tasks
    for (var user in userTaskMap) {
        var recipient = new GlideRecord('sys_user');
        if (recipient.get(user)) {
            var userEmail = recipient.getValue('email');

            // Construct the email body
            var emailBody = 'Hello ' + recipient.getValue('first_name') + ',<br/><br/>';
            emailBody += 'You have the following overdue HR tasks:<br/><br/><ul>';

            userTaskMap[user].forEach(function (task) {
                var taskUrl = gs.getProperty('glide.servlet.uri') + 'hr4u?id=hrm_ticket_page&table=sn_hr_core_task&sys_id=' + task.taskSysid;
                emailBody += '<li><a href="' + taskUrl + '">' + task.taskLink + '</a></li>';
            });

            emailBody += '</ul><br/>Please complete these tasks as soon as possible.<br/><br/>Thank you!';

            // Send the email
            gs.eventQueue('custom.overdue.hr.tasks', hrTaskGR, userEmail, emailBody);
        }
    }

})();
