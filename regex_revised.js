(function runAction(/*GlideRecord*/ current, /*GlideRecord*/ event, /*EmailWrapper*/ email, /*ScopedEmailLogger*/ logger, /*EmailClassifier*/ classifier) {

    // Extract hiredate, newhire, and hiringmangerid from the email body text using regular expressions
    var hiredateRegex = /hiredate:\s*([\d/]+)/;
    var newhireRegex = /newhire:\s*([\w\s]+)/;
    var hiringmangeridRegex = /hiringmangerid:\s*(\d+)/;

    var hiredateMatch = email.body_text.match(hiredateRegex);
    var newhireMatch = email.body_text.match(newhireRegex);
    var hiringmangeridMatch = email.body_text.match(hiringmangeridRegex);

    if (hiredateMatch) {
        current.u_preboarder_start_date = hiredateMatch[1];
    }

    if (newhireMatch) {
        current.u_preboarder_name = newhireMatch[1];
    }

    // Retrieve hiringmangerid from the email body
    var hiringmangerid;
    if (hiringmangeridMatch) {
        hiringmangerid = hiringmangeridMatch[1];
    }

    // Query the sn_hr_core_profile table for a record with the same u_personnel_number
    var profile = new GlideRecord('sn_hr_core_profile');
    profile.addQuery('u_personnel_number', hiringmangerid);
    profile.query();
    logger.log('Hiring Manager # ' + hiringmangerid);
    logger.log('New Hire ' + (newhireMatch ? newhireMatch[1] : ''));
    logger.log('Hire date ' + (hiredateMatch ? hiredateMatch[1] : ''));

    // If a matching record is found, set the opened_for and subject_person fields
    if (profile.next()) {
        current.setValue('opened_for', profile.getValue('user'));
        current.setValue('subject_person', profile.getValue('user'));
    }

    // Update the current record
    current.update();

})(current, event, email, logger, classifier);
