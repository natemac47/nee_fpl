(function() {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    data.short_description = "Your ServiceNow Widget";
    data.description = "This is a sample ServiceNow widget.";
    data.url = "https://www.example.com";
    data.urlText = "Learn More";
    
    options.short_description = options.short_description || data.short_description;
    options.description = options.description || data.description;
    options.url = options.url || data.url;
    options.urlText = options.urlText || data.urlText;
    
    // Set the icon class string in the options object
    options.icon = options.icon || "fa fa-info-circle";
})();

//Line 7 
// <i class="{{::options.icon}} fa-3x"></i>
