(function executeRule(current) {

    // Get today's date and set the time to 00:00:00
    var today = new GlideDateTime();
    today.setDisplayValue(today.getDisplayValue().split(' ')[0] + ' 00:00:00');

    // Build GlideRecord query for sn_hr_core_task table
    var hrTaskGR = new GlideRecord('sn_hr_core_task');
    hrTaskGR.addQuery('due_date', '>=', today);
    hrTaskGR.addQuery('state', '!=', 'Closed');
    hrTaskGR.addQuery('u_hr_service', 'IN', 'Onboarding,Preboarding');
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
                taskLink: hrTaskGR.getDisplayValue('number')
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
                var taskUrl = gs.getProperty('glide.servlet.uri') + 'sn_hr_core_task.do?sysparm_query=number=' + task.taskNumber;
                emailBody += '<li><a href="' + taskUrl + '">' + task.taskLink + '</a></li>';
            });

            emailBody += '</ul><br/>Please complete these tasks as soon as possible.<br/><br/>Thank you!';

            // Send the email
            var email = new GlideEmail();
            email.setSubject('Overdue HR Tasks Notification');
            email.setBody(emailBody);
            email.setFrom('noreply@example.com');
            email.setReplyTo('hr@example.com');
            email.addTo(userEmail);
            email.send();
        }
    }

})();
