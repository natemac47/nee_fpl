(function() {
    /* Populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */

    //URL Components 
    data.urlText = 'VIEW YOUR TIME OFF';
    data.url = 'https://portalgateway.fpl.com/sfredirect/time_off.html';
    options.urlText = options.urlText || data.urlText;
    options.url = options.url || data.url;
        
    var userSysId = gs.getUserID();
    var personnel_number = getPersonnelNumber(userSysId);
        
    if (personnel_number === null) {
        data.timeTypes = {};
    } else {
        var timeoff = executeAction(personnel_number);
        
        if (timeoff === null) {
            data.timeTypes = {};
        } else {
            data.timeTypes = separateTimeTypes(timeoff.item);
            data.vacationTotals = calculateVacationTotals(data.timeTypes);
        }
    }

    function getPersonnelNumber(userSysId) {
        var hrProfile = new GlideRecord('sn_hr_core_profile');
        hrProfile.addQuery('user', userSysId);
        hrProfile.query();
        if (hrProfile.next()) {
            return hrProfile.getValue('u_personnel_number');
        }
        return null;
    }

    function executeAction(personnel_number) {
        try {
            var inputs = {};
            inputs['personnel_number'] = personnel_number;

            // Execute Synchronously
            var result = sn_fd.FlowAPI.getRunner().action('global.time_and_attendance_v2').inForeground().withInputs(inputs).run();
            var outputs = result.getOutputs();

            // Get Outputs
            var timeoff = outputs['timeoff']; // Object

            return timeoff;

        } catch (ex) {
            var message = ex.getMessage();
            gs.error(message);
            return null;
        }
    }

    function separateTimeTypes(items) {
        var timeTypes = {};

        items.forEach(function(item) {
            var type = item.TIME_TYPE_TEXT;
            var entitlementHours = parseFloat(item.ENTITLE_HOURS.trim());
            var plannedHours = parseFloat(item.PLANNED_HOURS.trim());
            var takenHours = parseFloat(item.TAKEN_HRS.trim());
            timeTypes[type] = {
                entitlementDays: parseFloat(item.ENTITLE_DAYS.trim()),
                entitlementHours: entitlementHours,
                plannedDays: parseFloat(item.PLANNED_DAYS.trim()),
                plannedHours: plannedHours,
                restUsedDays: parseFloat(item.REST_USED_DAYS.trim()),
                restUsedHours: parseFloat(item.REST_USED_HOURS.trim()),
                takenDays: parseFloat(item.TAKEN_DAYS.trim()),
                takenHours: takenHours,
                totalPercentage: 100,
                plannedPercentage: (plannedHours / entitlementHours) * 100,
                takenPercentage: (takenHours / entitlementHours) * 100,
            };
        });
        console.log(timeTypes);
        return timeTypes;
    }

    function calculateVacationTotals(timeTypes) {
        var vacationTotals = {
            plannedHours: 0,
            takenHours: 0,
            entitlementHours: 0,
            plannedPercentage: 0,
            takenPercentage: 0,
            restUsedHours: 0
        };

        for (var key in timeTypes) {
            if (key.includes("Vacation")) {
                vacationTotals.plannedHours += timeTypes[key].plannedHours;
                vacationTotals.takenHours += timeTypes[key].takenHours;
                vacationTotals.entitlementHours += timeTypes[key].entitlementHours;
                vacationTotals.restUsedHours += timeTypes[key].restUsedHours;
            }
        }

        vacationTotals.plannedPercentage = (vacationTotals.plannedHours / vacationTotals.entitlementHours) * 100;
        vacationTotals.takenPercentage = (vacationTotals.takenHours / vacationTotals.entitlementHours) * 100;

        return vacationTotals;
    }
    
    
    function calculateFloatTotals(timeTypes) {
        var floatTotals = {
            plannedHours: 0,
            takenHours: 0,
            entitlementHours: 0,
            plannedPercentage: 0,
            takenPercentage: 0,
            restUsedHours: 0
        };

        for (var key in timeTypes) {
            if (key.includes("Float")) {
                floatTotals.plannedHours += timeTypes[key].plannedHours;
                floatTotals.takenHours += timeTypes[key].takenHours;
                floatTotals.entitlementHours += timeTypes[key].entitlementHours;
                floatTotals.restUsedHours += timeTypes[key].restUsedHours;
            }
        }

        floatTotals.plannedPercentage = (floatTotals.plannedHours / floatTotals.entitlementHours) * 100;
        floatTotals.takenPercentage = (floatTotals.takenHours / floatTotals.entitlementHours) * 100;

        return floatTotals;
    }
})();
