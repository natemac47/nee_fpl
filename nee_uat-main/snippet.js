(function() {
	
	try {
		var inputs = {};
		inputs['personnel_number'] = ; // String 

		// Start Asynchronously: Uncomment to run in background. Code snippet will not have access to outputs.
		// sn_fd.FlowAPI.getRunner().action('global.test').inBackground().withInputs(inputs).run();
				
		// Execute Synchronously: Run in foreground. Code snippet has access to outputs.
		var result = sn_fd.FlowAPI.getRunner().action('global.test').inForeground().withInputs(inputs).run();
		var outputs = result.getOutputs();

		// Get Outputs:
		// Note: outputs can only be retrieved when executing synchronously.
		var timeoff = outputs['timeoff']; // Object
		
	} catch (ex) {
		var message = ex.getMessage();
		gs.error(message);
	}
	
})();
