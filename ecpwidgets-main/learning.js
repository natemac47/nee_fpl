(function() {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    data.short_description = "Upcoming Course";
    data.description = "Your next development training is scheduled for:";
    data.url = "https://www.example.com";
    data.urlText = "View course details";
    data.date = "March 22";
    data.learning_title = "Learning Title Example";
    
    options.short_description = options.short_description || data.short_description;
    options.description = options.description || data.description;
    options.url = options.url || data.url;
    options.urlText = options.urlText || data.urlText;
    options.icon = options.icon || "path/to/your/image.png";
    options.date = options.date || data.date;
    options.learning_title = options.learning_title || data.learning_title;
})();
