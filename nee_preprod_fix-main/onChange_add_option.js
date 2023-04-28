function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading) {
        return;
    }

    // Clear the Campus Location field's options and value
    g_form.clearOptions('campus_location');
    g_form.setValue('campus_location', '');

    if (newValue === 'Naugatuck Valley Campus') {
        g_form.addOption('campus_location', 'Waterbury Location', 'Waterbury Location');
        g_form.addOption('campus_location', 'Danbury Location', 'Danbury Location');
    } else if (newValue === 'Quinebaug Valley Campus') {
        g_form.addOption('campus_location', 'Danielson Location', 'Danielson Location');
        g_form.addOption('campus_location', 'Willimantic Location', 'Willimantic Location');
    }
}
