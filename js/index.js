// 监控区域模块制作
/* 立即执行函数 防止变量名污染 多个立即执行函数之间用分号隔开*/
(function () {
    $(function () {
        // tabs的a标签切换效果
        $(".monitor .tabs").on("click", "a", function () {
            $(this).addClass("active").siblings("a").removeClass("active");
            // content内容切换效果
            $(".monitor .content").eq($(this).index()).show().siblings(".content").hide();
        });
    })
})();

// 点位分布统计模块制作
(function () {
    /** @type EChartsOption */
    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".pie"));
    // 2. 指定配置项和数据
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
            confine: true, //限制tooltip在容器内
        },
        series: [{
            name: '累计确诊',
            type: 'pie',
            radius: ["20%", "70%"],
            center: ['50%', '50%'],
            roseType: 'radius',
            itemStyle: {
                borderRadius: 5
            },
            label: {
                fontSize: 10
            },
            labelLine: {
                length: 6,
                length2: 8
            }
        }]
    };
    $.ajax({
        type: "get",
        url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
        // 指定当前发送json请求
        dataType: "json",
        success: function (response) {
            var data = response.data.diseaseh5Shelf.areaTree[0].children;
            var arrayData = [];
            $.each(data, function (index, item) {
                var objectData = {};
                objectData.name = item.name;
                objectData.value = item.total.confirm;
                arrayData.push(objectData);
            });
            arrayData.splice(10);
            option.series[0].data = arrayData;
            // 3. 将配置项和数据赋值给实例化对象
            myChart.setOption(option);
        }
    });
    // 4. 当浏览器缩放时，图表也等比例缩放
    window.addEventListener("resize", function () {
        // resize()方法缩放
        myChart.resize();
    })
})();

// 用户统计模块制作
(function () {
    /** @type EChartsOption */
    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".bar"));
    // 2. 指定配置项和数据
    var option = {
        tooltip: {
            trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
        color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: 'red' // 0% 处的颜色
            }, {
                offset: 1,
                color: 'blue' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        },
        grid: {
            left: '0%',
            right: '2%',
            bottom: '0%',
            top: '4%',
            containLabel: true,
            show: true,
            borderColor: 'rgba(0,240,255,0.3)'
        },
        xAxis: [{
            type: 'category',
            data: [],
            axisTick: {
                alignWithLabel: false,
                show: false
            },
            axisLabel: {
                color: '#4c9bfd',
                //横轴信息全部显示
                interval: 0,
                //-45度角倾斜显示
                rotate: 45
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0,240,255,0.3)'
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                alignWithLabel: false,
                show: false
            },
            axisLabel: {
                color: '#4c9bfd'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0,240,255,0.3)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0,240,255,0.3)'
                }
            }
        }],
        series: [{
            name: '现有确诊',
            type: 'bar',
            barWidth: '60%',
            data: [],
            label: {
                fontSize: 10
            }
        }]
    };
    $.ajax({
        type: "get",
        url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
        // 指定当前发送json请求
        dataType: "json",
        success: function (response) {
            var arrayData = response.data.diseaseh5Shelf.areaTree[0].children;
            let newArr = [];
            let xAxisData = [];
            let seriesData = [];
            arrayData.forEach((item) => {
                let res = item['children'].filter((j) => j['name'].includes("境外输入"));
                if (res && res.length && res[0].total.nowConfirm != 0) {
                    item['children'] = res
                    newArr.push(item)
                };
            });
            $.each(newArr, function (index, item) {
                xAxisData.push(item.name);
                seriesData.push(item.children[0].total.nowConfirm);
            });
            option.xAxis[0].data = xAxisData;
            option.series[0].data = seriesData;
            // 3. 将配置项和数据赋值给实例化对象
            myChart.setOption(option);
        }
    });
    // 4. 当浏览器缩放时，图表也等比例缩放
    window.addEventListener("resize", function () {
        // resize()方法缩放
        myChart.resize();
    });
})();

// 订单区域模块制作
(function () {
    // 1. 点击tab切换
    $(".order .filter").on("click", "a", function () {
        $(this).addClass("active").siblings("a").removeClass("active");
        let currentIndex = $(this).index();
        $.ajax({
            type: "get",
            url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
            // 指定当前发送json请求
            dataType: "json",
            success: function (response) {
                var html = template("orderTpl", {
                    index: currentIndex,
                    data: response.data.diseaseh5Shelf
                });
                $("#order").html(html);
            }
        });
    });

    // 2. tab定时器自动切换效果
    // 开启定时器，每隔1秒让a自动触发点击事件
    var currentA = $(".order .filter a"); // 获取a标签
    var index = 0; // 声明一个index
    var timer = setInterval(function () {
        // 三元表达式判断index是否超过3
        index >= 3 ? index = 0 : index++;
        // 第几个a标签自动触发点击事件
        currentA.eq(index).click();
    }, 1000);
    // 鼠标经过order，关闭定时器，离开开启定时器
    $(".order").hover(function () {
        // 鼠标经过关闭定时器
        clearInterval(timer);
    }, function () {
        // 鼠标离开开启，先关后开
        clearInterval(timer);
        timer = setInterval(function () {
            // 三元表达式判断index是否超过3
            index >= 3 ? index = 0 : index++;
            // 第几个a标签自动触发点击事件
            currentA.eq(index).click();
        }, 1000);
    });
})();

// 销售统计区域模块制作
(function () {
    // 准备data数据
    var data = {
        local: [
            [],
            []
        ],
        nation: [
            [],
            []
        ],
        total: [
            [],
            []
        ],
        rate: [
            [],
            []
        ]
    };

    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".line"));
    /** @type EChartsOption */
    // 2. 指定配置项和数据
    var option = {
        color: ['#00f2f1', '#ed3f35'],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            textStyle: {
                // 图例文字颜色
                color: '#4c9bfd'
            },
            data: [],
            // 距离右边2%
            right: '2%'
        },
        grid: {
            left: '0%',
            right: '1%',
            bottom: '0%',
            // 显示边框
            show: true,
            // 边框颜色
            borderColor: '#012f4a',
            top: "10%",
            // 包含刻度文字
            containLabel: true
        },
        xAxis: {
            type: 'category',
            // 剔除轴两端内间距
            boundaryGap: false,
            data: [],
            axisTick: {
                // 剔除刻度
                show: false
            },
            axisLabel: {
                // 字体颜色
                color: '#4c9bfd'
            },
            axisLine: {
                // 剔除坐标轴颜色
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisTick: {
                // 剔除刻度
                show: false
            },
            axisLabel: {
                // 字体颜色
                color: '#4c9bfd'
            },
            splitLine: {
                lineStyle: {
                    // 分割线颜色
                    color: '#012f4a'
                }
            }
        },
        series: [{
                name: "",
                type: 'line',
                stack: 'Total',
                data: data.local[0],
                // 折线修饰为圆滑
                smooth: true
            },
            {
                name: "",
                type: 'line',
                stack: 'Total',
                data: data.local[1],
                smooth: true
            }
        ]
    };
    $.ajax({
        type: "get",
        url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayList,chinaDayAddList,nowConfirmStatis,provinceCompare",
        success: function (response) {
            var chinaDayList = response.data.chinaDayList;
            var chinaDayAddList = response.data.chinaDayAddList;
            $.each(chinaDayAddList, function (index, item) {
                // 本土新增
                data.local[0].push(item.localConfirmadd);
                // 全国新增确诊
                data.nation[0].push(item.confirm);
                // 全国新增疑似
                /* data.nation[2].push(item.suspect); */
                // x轴刻度
                option.xAxis.data.push(item.date);
            });
            $.each(chinaDayList, function (index, item) {
                // 本土现有确诊
                data.local[1].push(item.localConfirm);
                // 全国现有确诊
                data.nation[1].push(item.nowConfirm);
                // 累计确诊
                data.total[0].push(item.confirm);
                // 累计治愈
                data.total[1].push(item.heal);
                // 累计死亡
                /* data.total[2].push(item.dead); */
                // 治愈率
                data.rate[0].push(item.healRate);
                // 病死率
                data.rate[1].push(item.deadRate);
            });
            // 3. 将配置项和数据赋值给实例化对象
            myChart.setOption(option);
        }
    });
    // 4. 当浏览器缩放时，图表也等比例缩放
    window.addEventListener("resize", function () {
        // resize()方法缩放
        myChart.resize();
    });

    // 5. 点击tab切换
    $(".sales .caption").on("click", "a", function () {
        // 注意索引号问题：因为定时器里a的索引号必须从0开始，所以得减去h3标签一个数
        index = $(this).index() - 1;

        $(this).addClass("active").siblings("a").removeClass("active");
        // this.dataset.type：当前a的自定义属性值data-type
        if (this.dataset.type == "local") {
            option.legend.data[0] = "新增确诊";
            option.legend.data[1] = "现有确诊";
            option.series[0].name = "新增确诊";
            option.series[1].name = "现有确诊";
        } else if (this.dataset.type == "nation") {
            option.legend.data[0] = "新增确诊";
            option.legend.data[1] = "现有确诊";
            option.series[0].name = "新增确诊";
            option.series[1].name = "现有确诊";
        } else if (this.dataset.type == "total") {
            option.legend.data[0] = "累计确诊";
            option.legend.data[1] = "累计治愈";
            option.series[0].name = "累计确诊";
            option.series[1].name = "累计治愈";
        } else {
            option.legend.data[0] = "治愈率";
            option.legend.data[1] = "病死率";
            option.series[0].name = "治愈率";
            option.series[1].name = "病死率";
        };
        // 根据拿到的新数据重新渲染series里的data值
        option.series[0].data = data[this.dataset.type][0];
        option.series[1].data = data[this.dataset.type][1];
        // 重新把配置项和新数据赋值给实例化对象
        myChart.setOption(option);
    });

    // 6. tab定时器自动切换效果
    // 开启定时器，每隔1秒让a自动触发点击事件
    var currentA = $(".sales .caption a"); // 获取a标签
    var index = 0; // 声明一个index
    var timer = setInterval(function () {
        // 三元表达式判断index是否超过4
        index >= 4 ? index = 0 : index++;
        // 第几个a标签自动触发点击事件
        currentA.eq(index).click();
    }, 1000);
    // 鼠标经过sales，关闭定时器，离开开启定时器
    $(".sales").hover(function () {
        // 鼠标经过关闭定时器
        clearInterval(timer);
    }, function () {
        // 鼠标离开开启，先关后开
        clearInterval(timer);
        timer = setInterval(function () {
            // 三元表达式判断index是否超过4
            index >= 4 ? index = 0 : index++;
            // 第几个a标签自动触发点击事件
            currentA.eq(index).click();
        }, 1000);
    });
})();

// 渠道区域模块制作
(function () {
    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".radar"));
    /** @type EChartsOption */
    // 2. 指定配置项和数据
    var option = {
        // 鼠标经过显示提示框组件
        tooltip: {
            show: true,
            borderWidth: 1,
            formatter: '<span style="color: #657180; margin-left: 8px; float: right;">{a} <br/> {c}</span>',
            // 控制提示框组件显示位置
            position: ['10%', '10%'],
            padding: [2, 2, 2, 2],
            confine: true, //限制tooltip在容器内
        },
        radar: {
            indicator: [{
                    name: '北部',
                    max: 100
                },
                {
                    name: '西部',
                    max: 100
                },
                {
                    name: '南部',
                    max: 100
                },
                {
                    name: '东部',
                    max: 100
                },
                {
                    name: '中部',
                    max: 100
                }
            ],
            // 调整雷达图大小为60%
            radius: '60%',
            nameGap: 6,
            axisName: {
                fontSize: 10,
                // 修饰雷达图文字颜色
                color: '#faa755',
            },
            // 指示器轴的分割段数
            splitNumber: 3,
            // 分割的圆圈线条样式
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,0.5)'
                }
            },
            // 坐标轴线条设置为白色半透明
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,0.5)'
                }
            }
        },
        series: [{
            name: '北部-西部-南部-东部-中部(%)',
            type: 'radar',
            data: [{
                value: []
            }],
            // 修饰区域填充背景色
            areaStyle: {
                color: 'rgba(173,255,47,0.8)'
            },
            // 填充区域线条颜色
            lineStyle: {
                normal: {
                    color: "#fff",
                    width: 1,
                    opacity: 0.5
                }
            },
            // 拐点样式：圆点
            symbol: 'circle',
            // 拐点大小：5
            symbolSize: 5,
            // 白色
            itemStyle: {
                color: '#f173ac'
            },
            // 拐点显示数据，颜色，大小
            label: {
                show: true,
                fontSize: 10,
                color: '#feeeed'
            }
        }]
    };
    var childrenData = [];
    let north = ["黑龙江", "辽宁", "吉林", "内蒙古"];
    let northData = [];
    let middle = ["北京", "天津", "河北", "河南", "山东", "湖北", "山西"];
    let middleData = [];
    let east = ["江西", "安徽", "江苏", "上海", "浙江", "福建", "台湾"];
    let eastData = [];
    let south = ["湖南", "云南", "贵州", "广西", "广东", "香港", "澳门", "海南"];
    let southData = [];
    let west = ["四川", "西藏", "重庆", "陕西", "甘肃", "青海", "新疆", "宁夏"];
    let westData = [];
    let northSum = 0;
    let westSum = 0;
    let southSum = 0;
    let eastSum = 0;
    let middleSum = 0;
    $.ajax({
        type: "get",
        url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
        // 指定当前发送json请求
        dataType: "json",
        success: function (response) {
            $.each(response.data.diseaseh5Shelf.areaTree[0].children, function (index, item) {
                let itemObjet = {};
                itemObjet.name = item.name;
                itemObjet.value = item.total.nowConfirm;
                childrenData.push(itemObjet);
            });
            $.each(childrenData, function (index, item) {
                if (north.includes(item.name)) {
                    northData.push(item);
                } else if (middle.includes(item.name)) {
                    middleData.push(item);
                } else if (east.includes(item.name)) {
                    eastData.push(item);
                } else if (south.includes(item.name)) {
                    southData.push(item);
                } else {
                    westData.push(item);
                };
            });
            $.each(northData, function (index, item) {
                northSum += item.value;
            });
            $.each(westData, function (index, item) {
                westSum += item.value;
            });
            $.each(southData, function (index, item) {
                southSum += item.value;
            });
            $.each(eastData, function (index, item) {
                eastSum += item.value;
            });
            $.each(middleData, function (index, item) {
                middleSum += item.value;
            });
            option.series[0].data[0].value.push((northSum / response.data.diseaseh5Shelf.chinaTotal.nowConfirm * 100).toFixed(2));
            option.series[0].data[0].value.push((westSum / response.data.diseaseh5Shelf.chinaTotal.nowConfirm * 100).toFixed(2));
            option.series[0].data[0].value.push((southSum / response.data.diseaseh5Shelf.chinaTotal.nowConfirm * 100).toFixed(2));
            option.series[0].data[0].value.push((eastSum / response.data.diseaseh5Shelf.chinaTotal.nowConfirm * 100).toFixed(2));
            option.series[0].data[0].value.push((middleSum / response.data.diseaseh5Shelf.chinaTotal.nowConfirm * 100).toFixed(2));
            // 3. 将配置项和数据赋值给实例化对象
            myChart.setOption(option);
        }
    });
    // 4. 当浏览器缩放时，图表也等比例缩放
    window.addEventListener("resize", function () {
        // resize()方法缩放
        myChart.resize();
    });
})();

// 销售进度模块制作
(function () {
    /** @type EChartsOption */
    // 1. 实例化对象
    var myChart = echarts.init(document.querySelector(".gauge"));
    // 2. 指定配置项和数据
    var option = {
        series: [{
            name: '销售进度',
            type: 'pie',
            // 放大图形
            radius: ['130%', '150%'],
            // 移动位置
            center: ['48%', '80%'],
            label: {
                show: false,
                position: 'center'
            },
            labelLine: {
                show: false
            },
            // 起始角度
            startAngle: 180,
            // 鼠标经过不放大
            hoverOffset: 0,
            data: [{
                    itemStyle: {
                        color: // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                        {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#00c9e8' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#005fc1' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                },
                {
                    itemStyle: {
                        color: '#12274d'
                    }
                },
                {
                    value: 300,
                    itemStyle: {
                        // 透明隐藏
                        color: 'transparent'
                    }
                }
            ]
        }]
    };
    $.ajax({
        type: "get",
        url: "https://api.inews.qq.com/newsqa/v1/automation/modules/list?modules=VaccineTopData",
        success: function (response) {
            var html = template("quarterTpl", {
                data: response.data.VaccineTopData
            });
            $("#quarter").html(html);
            var gaugeHtml = template.render(`{{data}}<small>剂</small>`, {
                data: response.data.VaccineTopData["中国"].total_vaccinations_per_hundred
            });
            $("#gauge").html(gaugeHtml);
            option.series[0].data[0].value = response.data.VaccineTopData["中国"].total_vaccinations_per_hundred;
            option.series[0].data[1].value = 300 - response.data.VaccineTopData["中国"].total_vaccinations_per_hundred;
            // 3. 将配置项和数据赋值给实例化对象
            myChart.setOption(option);
        }
    });
    // 4. 当浏览器缩放时，图表也等比例缩放
    window.addEventListener("resize", function () {
        // resize()方法缩放
        myChart.resize();
    });
})();

// 全国热销排行模块制作
(function () {
    /* 1.准备后台数据 */
    $.ajax({
        type: "get",
        url: "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=statisGradeCityDetail,diseaseh5Shelf",
        // 指定当前发送json请求
        dataType: "json",
        success: function (response) {
            var res = response.data.diseaseh5Shelf.areaTree[0].children;
            // 31省数据
            let arrFirst = [];
            // 31省数据前5数据
            let arrFirstFive = [];
            let arrFirstFiveTemp = [];
            let hotData = [];
            // 港澳台数据
            let arrSecond = [];
            $.each(res, function (index, item) {
                let objFirst = {};
                let objSecond = {};
                if (item.name != "香港" && item.name != "澳门" && item.name != "台湾") {
                    objFirst.name = item.name;
                    objFirst.children = item.children;
                    objFirst.sales = item.total.nowConfirm;
                    arrFirst.push(objFirst);
                } else {
                    objSecond.name = item.name;
                    objSecond.children = item.children;
                    arrSecond.push(objSecond);
                }
            });
            var gangAoTaiHtml = template("gangAoTaiTpl", {
                data: arrSecond
            });
            $("#gangAoTai").html(gangAoTaiHtml);
            for (let i = 0; i < 5; i++) {
                arrFirstFive.push(arrFirst[i]);
            };
            for (let i = 0; i < 5; i++) {
                let tmp = arrFirstFive[i].children.slice(0, 6);
                $.each(tmp, function (index, item) {
                    let objTemp = {};
                    objTemp.name = item.name;
                    objTemp.number = item.total.nowConfirm;
                    arrFirstFiveTemp.push(objTemp);
                });
            };
            var result = [];
            for (var i = 0; i < arrFirstFiveTemp.length; i += 6) {
                result.push(arrFirstFiveTemp.slice(i, i + 6));
            };
            $.each(arrFirstFive, function (index, item) {
                let objHotData = {};
                objHotData.city = item.name;
                objHotData.sales = item.sales;
                objHotData.brands = result[index];
                hotData.push(objHotData);
            });
            /* 2.根据数据渲染各省热销sup模块内容 */
            var supHtml = '';
            $.each(hotData, function (index, item) {
                supHtml += `<li>
        <span>${item.city}</span>
        <span style="color: #fff;">${item.sales}</span>
    </li>`;
                $(".sup:first-child").html(supHtml);
            });
            /* 3.鼠标经过tab */
            $(".province .sup:first-child").on("mouseenter", "li", function () {
                index = $(this).index();
                render($(this));
            });
            // 声明一个封装函数 里面设置sup当前小li高亮以及对应的品牌对象渲染
            function render(that) {
                that.addClass("active").siblings().removeClass("active");
                // 遍历品牌数组
                var subHtml = '';
                $.each(hotData[that.index()].brands, function (index, item) {
                    subHtml += `<li>
            <span>${item.name}</span>
            <span style="color: #fff;">${item.number}</span>
        </li>`
                });
                $(".sup:nth-child(2)").html(subHtml);
            };
            /* 4.默认第一个小li处于鼠标经过状态 */
            $(".province .sup:first-child li").eq(0).mouseenter();
            /* 5.开启定时器 */
            var index = 0;
            var timer = setInterval(function () {
                index >= 5 ? index = 0 : index++;
                render($(".province .sup:first-child li").eq(index));
            }, 1500);
            /* 鼠标经过暂停，离开继续 */
            $(".province .sup:first-child").hover(function () {
                clearInterval(timer);
            }, function () {
                clearInterval(timer);
                timer = setInterval(function () {
                    index >= 5 ? index = 0 : index++;
                    render($(".province .sup:first-child li").eq(index));
                }, 1500);
            });
        }
    });
})();