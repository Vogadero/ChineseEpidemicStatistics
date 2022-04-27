(function () {
    /** @type EChartsOption */
    var myChart = echarts.init(document.querySelector(".geo"));
    var mapName = 'china'
    var data = [];
    var toolTipData = [];
    var geoCoordMap = {};

    function myAjax() {
        var defer = $.Deferred();
        $.ajax({
            type: "post",
            url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
            // 指定当前发送jsonp请求
            dataType: "json",
            success: function (response) {
                var data = response.data.diseaseh5Shelf.areaTree[0].children;
                var arrayData = [];
                var arrayToolTipData = [];
                $.each(data, function (index, item) {
                    var objectData = {};
                    var objectToolTipData = {};
                    objectData.name = item.name;
                    objectData.value = item.total.nowConfirm;
                    let tempData = Object.assign({}, objectData);
                    tempData.name = "现有确诊";
                    objectToolTipData.name = item.name;
                    objectToolTipData.value = [tempData];
                    arrayData.push(objectData);
                    arrayToolTipData.push(objectToolTipData);
                });
                // 返回值调用resolve方法
                defer.resolve([arrayData, arrayToolTipData]);
            }
        });
        return defer;
    }

    $.when(myAjax()).done(function (params) {
        data = params[0];
        toolTipData = params[1];
        myChart.showLoading();
        var mapFeatures = echarts.getMap(mapName).geoJson.features;
        myChart.hideLoading();
        mapFeatures.forEach(function (v) {
            // 地区名称
            var name = v.properties.name;
            // 地区经纬度
            geoCoordMap[name] = v.properties.cp;
        });


        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value),
                    });
                }
            }
            return res;
        };
        option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (typeof (params.value)[2] == "undefined") {
                        var toolTiphtml = ''
                        for (var i = 0; i < toolTipData.length; i++) {
                            if (params.name == toolTipData[i].name) {
                                toolTiphtml += toolTipData[i].name + ':<br>'
                                for (var j = 0; j < toolTipData[i].value.length; j++) {
                                    toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
                                }
                            }
                        }
                        return toolTiphtml;
                    } else {
                        var toolTiphtml = ''
                        for (var i = 0; i < toolTipData.length; i++) {
                            if (params.name == toolTipData[i].name) {
                                toolTiphtml += toolTipData[i].name + ':<br>'
                                for (var j = 0; j < toolTipData[i].value.length; j++) {
                                    toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + "<br>"
                                }
                            }
                        }
                        return toolTiphtml;
                    }
                }
            },
            geo: {
                show: true,
                map: mapName,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false,
                    }
                },
                // 地图放大
                zoom: 1.2,
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#1a2933',
                        borderColor: '#009ad6',
                    },
                    emphasis: {
                        // 修改地图省份背景颜色
                        areaColor: '#f47920',
                    }
                }
            },
            series: [{
                    name: '散点',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: convertData(data),
                    symbolSize: function (val) {
                        return val[1] / 3;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#05C3F9'
                        }
                    }
                },
                {
                    type: 'map',
                    map: mapName,
                    geoIndex: 0,
                    aspectScale: 0.75, //长宽比
                    showLegendSymbol: false, // 存在legend时显示
                    label: {
                        normal: {

                            show: true
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: '#031525',
                            borderColor: '#3B5077',
                        },
                        emphasis: {
                            areaColor: '#2B91B7'
                        }
                    },
                    animation: false,
                    data: data
                },
                {
                    name: '点',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    symbol: 'pin', //气泡
                    symbolSize: function (val) {
                        var a = 1;
                        var b = 1;
                        b = 1;
                        return a * val[1] + b;
                    },
                    label: {
                        normal: {
                            show: true,
                            formatter: function (params) {
                                return params.value[2];
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#F62157', //标志颜色
                        }
                    },
                    zlevel: 6,
                    data: convertData(data),
                },
                {
                    name: 'Top 5',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: convertData(data.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 5)),
                    symbolSize: function (val) {
                        return val[1] / 2;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'yellow',
                            shadowBlur: 10,
                            shadowColor: 'yellow'
                        }
                    },
                    zlevel: 1
                },

            ]
        };
        // 3. 将配置项和数据赋值给实例化对象
        myChart.setOption(option);
    });

    // 4. 当浏览器缩放时，图表也等比例缩放
    window.addEventListener("resize", function () {
        // resize()方法缩放
        myChart.resize();
    });
})();