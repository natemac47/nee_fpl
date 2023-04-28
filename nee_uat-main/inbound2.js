(function runAction(/*GlideRecord*/ current, /*GlideRecord*/ event, /*EmailWrapper*/ email, /*ScopedEmailLogger*/ logger, /*EmailClassifier*/ classifier) {
		
    if(email.body_text.hiredate!=undefined){
        current.u_preboarder_start_date=email.body_text.hiredate;
    }
		
    if(email.body_text.newhire!=undefined){
        current.u_preboarder_name=email.body_text.newhire;
    }
	
    // Retrieve hiringmangerid from the email body
    var hiringmangerid = email.body_text.hiringmangerid;
	
    // Query the sn_hr_core_profile table for a record with the same u_personnel_number
    var profile = new GlideRecord('sn_hr_core_profile');
    profile.addQuery('u_personnel_number', hiringmangerid);
    profile.query();
    logger.log('Hiring Manager # ' + hiringmangerid);
	
    // If a matching record is found, set the opened_for and subject_person fields
    if (profile.next()) {
        current.setValue('opened_for', profile.getValue('user'));
        current.setValue('subject_person', profile.getValue('user'));
    }
	logger.log('New Hire Name ' + email.body_text.newhire);
	logger.log('Hire Date ' + email.body_text.hiredate);
	logger.log('Manager ID ' + email.body_text.hiringmangerid);

    // Update the current record
    current.update();
	
})(current, event, email, logger, classifier);
