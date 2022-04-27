// 概览区域模块数据
$.ajax({
    type: "get",
    url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list",
    data: {
        modules: "statisGradeCityDetail,diseaseh5Shelf"
    },
    success: function (response) {
        var html = template("overviewTpl", {
            infoTotal: response.data.diseaseh5Shelf.chinaTotal
        });
        $("#overview").html(html);
    }
});

// 监控区域模块数据
$.ajax({
    type: "get",
    url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list",
    data: {
        modules: "statisGradeCityDetail,diseaseh5Shelf"
    },
    success: function (response) {
        var html = template("monitorFirstTpl", {
            info: response.data.statisGradeCityDetail
        });
        $("#monitorFirst").html(html);
    }
});

// 监控区域模块数据
$.ajax({
    type: "get",
    url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list",
    data: {
        modules: "statisGradeCityDetail,diseaseh5Shelf"
    },
    success: function (response) {
        var html = template("monitorTwoTpl", {
            info: response.data.statisGradeCityDetail
        });
        $("#monitorTwo").html(html);
    }
});

// 点位分布统计数据
$.ajax({
    type: "get",
    url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
    // 指定当前发送json请求
    dataType: "json",
    success: function (response) {
        console.log(response);
        var html = template("pointTpl", {
            data: response.data.diseaseh5Shelf.chinaTotal,
            dataAdd: response.data.diseaseh5Shelf.chinaAdd
        });
        $("#point").html(html);
    }
});

// 用户统计数据
$.ajax({
    type: "get",
    url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
    // 指定当前发送json请求
    dataType: "json",
    success: function (response) {
        var html = template("usersTpl", {
            data: response.data.diseaseh5Shelf.chinaTotal,
            dataAdd: response.data.diseaseh5Shelf.chinaAdd
        });
        $("#users").html(html);
    }
});

// 地图标题
$.ajax({
    type: "get",
    url: "https://view.inews.qq.com/g2/getOnsInfo",
    // 请求参数
    data: {
        name: "wuwei_ww_ww_today_notice"
    },
    // 指定当前发送jsonp请求
    dataType: "jsonp",
    success: function (response) {
        var html = template.render(`<span>{{title}}</span>`, {
            title: JSON.parse(response.data)[0].showNotice
        });
        $("#mapTitle").html(html);
    }
});

