{
    "component": "sn-search-result-evam-card",
    "staticValues": {
        "imageType": {
            "translatable": false,
            "key": "image"
        },
                "icon": {
            "translatable": false,
            "key": "pencil-page-outline"
        },
        "textHeaderLabelOne": {
        	"translatable": true,
            "key": "Application"
        }
    },
    "mappings": {
        "textHeaderLabelOne": "Link",
        "title": "name",
        "summary": "application_url",
        "ariaLabel": "application_url"
    },
    "actionMappings": {
    "clickAction": "app_navigation_sc_content_items_external"
    }
}

//Need to create separate action, copy Quick link navigation_sc_content_items_external and change url to application_url 
