(function() {
    if(input && input.widgetOptions)
        options = input.widgetOptions;
    data.load_config = options.load_config;
    if (data.load_config === "async" && !input)
        return;
    var maxDisplayCount = 10;
    data.instanceId = $sp.getDisplayValue("sys_id");
    data.title = gs.getMessage(options.title);
    data.userPredictionCount = options.user_prediction_count;
    data.cardType = (options.list_type === 'Card List') ? options.card_behaviour + '' : '';
    data.listType = (options.list_type === 'Card List') ? 'card-list' : 'simple-link';
    data.showEmptyState = options.show_empty_state;
    var knowledgeBases = String($sp.getKnowledgeBases());

    var displayCount = options.limit > maxDisplayCount ? maxDisplayCount : options.limit;
    data.viewType = (displayCount > 3) ? 'max-view' : 'min-view';
    var recentActivityCutoffInDays = options.recent_activity_cut_off_in_days;
    var recentActivityCutoffDate = new GlideDateTime();
    recentActivityCutoffDate.addDaysLocalTime(-recentActivityCutoffInDays);

    var relevantForYouWidgetSysId = '6cc836d0dbf700500c209493db961914';

    var RelevantForYouUtil = new sn_hr_sp.RelevantForYouUtil();

    var taxonomyId = '8d278b951bd1651081b4997f034bcbf1';

    var catalogPayload = {
        users: null,
        catalogCount: displayCount,
        ignoredCatalogs: null,
        recentActivityCutoffDate: recentActivityCutoffDate,
        taxonomyId: taxonomyId,
        topic: input.topic // Add the "topic" parameter to the catalog payload
    };

    var articlesPayload = {
        users: null,
        knowledgeBases: knowledgeBases,
        kbRecords: $sp.getAllKBRecords(knowledgeBases),
        articleCount: displayCount,
        recentActivityCutoffDate: recentActivityCutoffDate,
        taxonomyId: taxonomyId,
        topic: input.topic // Add the "topic" parameter to the articles payload
    };

    if (options.category === 'knowledge')
        data.dataItems = RelevantForYouUtil.getRelevantArticlesAndCatalogs(articlesPayload, null, displayCount, data.userPredictionCount, taxonomyId);
    else if (options.category === 'catalog')
        data.dataItems = RelevantForYouUtil.getRelevantArticlesAndCatalogs(null, catalogPayload, displayCount, data.userPredictionCount, taxonomyId);
    else
        data.dataItems = RelevantForYouUtil.getRelevantArticlesAndCatalogs(articlesPayload, catalogPayload, displayCount, data.userPredictionCount, taxonomyId);

    // Filter the data items based on the topic parameter
    data.dataItems = data.dataItems.filter(function(item) {
        return item.topic === input.topic;
    });

    data.widgetsData = getWidgetsData(data.dataItems, data.listType);


    function getWidgetsData(dataResults, listType) {
        listType = (listType === 'card-list') ? 'card' : 'simple_link';
        var dataPayload = [];
        dataResults.forEach(function(article) {
            var itemPayload = {};
            var widgetName = article.category == 'catalog' ? 'catalog-content' : 'kb-content';
            item
