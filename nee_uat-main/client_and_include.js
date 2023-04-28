function() {
    /* widget */
    var c = this;

    // Initialize the widget
    c.$onInit = function() {
        onLoad();
    };

    function onLoad() {
        // Retrieve the current user's sys_id
        c.server.get({}).then(function(response) {
            var userSysId = response.data.user_sys_id;

            // Query the sn_hr_core_profile table to get the user's u_personnel_number
            var hrProfileAjax = new GlideAjax('FlowDesignerAction');
            hrProfileAjax.addParam('sysparm_name', 'getPersonnelNumber');
            hrProfileAjax.addParam('sysparm_user_sys_id', userSysId);
            hrProfileAjax.getXMLAnswer(function(personnel_number) {
                if (personnel_number) {
                    // Call the Script Include to execute the action
                    var server = new GlideAjax('FlowDesignerAction');
                    server.addParam('sysparm_name', 'executeAction');
                    server.addParam('sysparm_personnel_number', personnel_number);
                    server.getXMLAnswer(function(response) {
                        var timeoff = JSON.parse(response);
                        // Perform actions with the timeoff object
                    });
                } else {
                    console.error("Error: Unable to retrieve personnel_number");
                }
            });
        });
    }
}




(function() {
    /* Populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */

    data.user_sys_id = gs.getUserID();
})();







var FlowDesignerAction = Class.create();
FlowDesignerAction.prototype = {
    initialize: function() {
    },

    // Function to get the personnel_number from sn_hr_core_profile
    getPersonnelNumber: function(userSysId) {
        var hrProfile = new GlideRecord('sn_hr_core_profile');
        hrProfile.addQuery('user', userSysId);
        hrProfile.query();
        if (hrProfile.next()) {
            return hrProfile.getValue('u_personnel_number');
        }
        return null;
    },

    executeAction: function(personnel_number) {
        try {
            var inputs = {};
            inputs['personnel_number'] = personnel_number;

            // Execute Synchronously
            var result = sn_fd.FlowAPI.getRunner().action('global.test').inForeground().withInputs(inputs).run();
            var outputs = result.getOutputs();

            // Get Outputs
            var timeoff = outputs['timeoff']; // Object

            return timeoff;

        } catch (ex) {
            var message = ex.getMessage();
            gs.error(message);
            return null;
        }
    },

    type: 'FlowDesignerAction'
};
