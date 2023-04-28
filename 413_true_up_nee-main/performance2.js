(function() {
    /* populate the 'data' object */
    /* e.g., data.table = $sp.getValue('table'); */
    data.short_description = "Performance";
    data.description = "You have a performance task to complete:";
    data.url = "https://hcm20.ns2cloud.com/sf/pmreviews?bplte_company=NEE";
    data.urlText = "View tasks";
    data.perftask = "Yearly Goals Renewal for 2023";
    data.perftaskdescription = "And 3 other performance tasks.";
    
    options.short_description = options.short_description || data.short_description;
    options.description = options.description || data.description;
    options.url = options.url || data.url;
    options.urlText = options.urlText || data.urlText;
    options.icon = options.icon || "path/to/your/image.png";
    options.perftask = options.perftask || data.perftask;
    options.perftaskdescription = options.perftaskdescription || data.perftaskdescription;
})();
