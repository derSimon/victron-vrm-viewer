(function($) {

    $( document ).ready(function() {
        console.log( "ready!" );

        $('.vrm-viewer').each(function(index){
            var id = $(this).get(0).id;
            initVrmElement(id);
        });
    });

    function initVrmElement(id){
        var installation_id = $('#'+id).data('id');
        var start = $('#'+id).data('start');
        var end = $('#'+id).data('end');
        var interval = $('#'+id).data('interval');
        var type = $('#'+id).data('charttype');

        get_installation_data(installation_id, start, end, interval, type);
    }


    function get_installation_data (installation_id, start, end, interval, type) {
        $.ajax({
            url: "wp-admin/admin-ajax.php",
            type: "POST",
            data: {
                action: 'vrm_ajax',
                id: installation_id,
                start: start,
                end: end,
                interval: interval,
                type: type
            },
            success: function (data) {

                //console.log(configs[type]);
                var configWithData = parseChartData(data, configs[type]);
                var myChart = Highcharts.chart('vrm-viewer-' + installation_id, configWithData);

                //console.log(JSON.stringify(configWithData, null, 2));
            },
            error: function () {
                console.log("Error");
            }
        });
    }

    function parseChartData(data, config){

        config.series.forEach(
            function(series){
                series.data = data.records[series.key];
            });

        return config;
    }


    function getTooltipFormatterWithTotal(series, unit, forceHideTotal) {
        return {
            useHTML: !0,
            headerFormat: "<table>",
            footerFormat: "</table>",
            formatter: function(tooltip) {
                var s, items = this.points || splat(this);
                s = [tooltip.tooltipFooterHeaderFormatter(items[0])];
                var total = 0
                    , showTotal = !1;
                return $.each(this.points, function() {
                    series.indexOf(this.series.index) > -1 && (showTotal = !0,
                        total += this.y)
                }),
                !showTotal || void 0 !== forceHideTotal && forceHideTotal || s.push("<tr><td>" + "Total" + ': </td><td style="text-align: right"><b>' + parseFloat(Math.round(100 * total) / 100).toFixed(2) + " " + unit + "</b></td></tr>"),
                    (s = s.concat(tooltip.bodyFormatter(items))).push(tooltip.tooltipFooterHeaderFormatter(items[0], !0)),
                    s
            }
        }
    }

    var configs = ["live_feed"];

    var GraphColors = {

            orange: "#f7ab3e",
            red: "#fa716f",
            blue: "#4790d0",
            green: "#8bc964",
            black: "black",
            lightRed: "#fcb8b7",
            lightBlue: "#a3c7e7",
            lightOrange: "#fbd59e",
            lightGreen: "#c5e4b1"
    };

/*
    configs["liveFeed"] = {
        options: {
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    groupPadding: .02,
                    shadow: !1
                }
            }
        },
        xAxis: {
            type: "datetime",
            gridLineColor: "#f5f4f0",
            gridLineWidth: 16,
            minorGridLineColor: "#f5f4f0",
            minorGridLineWidth: 16,
            minorTickLength: 0,
            minorTickInterval: "auto"
        },
        yAxis: [{
            title: {
                text: "kWh",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 5
            },
            gridLineWidth: 0,
            visible: 1,
            showFirstLabel: !0
        }, {
            min: 0,
            max: 100,
            tickInterval: 10,
            title: {
                text: "%",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 8,
                style: {
                    color: GraphColors.blue
                }
            },
            labels: {
                align: "center",
                style: {
                    color: GraphColors.blue
                }
            },
            gridLineWidth: 0,
            opposite: !0,
            visible: 1,
            showFirstLabel: !0
        }, {
            title: {
                text: "W",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 5,
                style: {
                    color: GraphColors.orange
                }
            },
            minPadding: 0,
            maxPadding: .1,
            forceTickAt0: !0,
            tickAmount: 7,
            labels: {
                format: "{value:.0f}",
                style: {
                    color: GraphColors.orange
                }
            },
            gridLineWidth: 0,
            showFirstLabel: !0,
            visible: !1
        }, {
            title: {
                text: "V",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 25,
                style: {
                    color: GraphColors.blue
                }
            },
            tickAmount: 10,
            minTickInterval: .1,
            labels: {
                format: "{value:.2f}",
                style: {
                    color: GraphColors.blue
                }
            },
            maxPadding: .2,
            minPadding: .2,
            gridLineWidth: 0,
            showFirstLabel: !0,
            visible: !1
        }, {
            title: {
                text: "A",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 25,
                style: {
                    color: GraphColors.orange
                }
            },
            minPadding: 0,
            maxPadding: .2,
            forceTickAt0: !0,
            labels: {
                format: "{value:.2f}",
                style: {
                    color: GraphColors.orange
                }
            },
            gridLineWidth: 0,
            showFirstLabel: !0,
            visible: !1
        }],
        series: [{
            yAxis: 0,
            color: GraphColors.lightRed,
            type: "column",
            name: "total_consumption",
            tooltip: {
                valueSuffix: " " + "kWh",
                valueDecimals: 2,
                //pointFormat: getTablePointFormat()
            },
            states: {
                hover: {
                    color: GraphColors.red
                }
            },
            zIndex: 1,
            visible: 1,
            data: []
        }, {
            yAxis: 0,
            color: GraphColors.lightOrange,
            type: "column",
            name: "total_solar_yield",
            tooltip: {
                valueSuffix: " " + "kWh",
                valueDecimals: 2
            },
            states: {
                hover: {
                    color: GraphColors.orange
                }
            },
            zIndex: 1,
            visible: 1,
            data: []
        }, {
            yAxis: 1,
            color: GraphColors.blue,
            lineWidth: 1,
            type: "line",
            name: "bv", //battery average
            tooltip: {
                valueSuffix: " %",
                valueDecimals: 0
            },
            zIndex: 3,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: !1,
            data: []
        }, {
            yAxis: 1,
            lineWidth: 0,
            type: "arearange",
            linkedTo: ":previous",
            color: GraphColors.lightBlue,
            name: "bs",//battery min max
            tooltip: {
                valueSuffix: " %",
                valueDecimals: 0
            },
            fillOpacity: .3,
            zIndex: 0,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: 1,
            data: []
        }, {
            yAxis: 2,
            color: GraphColors.orange,
            lineWidth: 1,
            type: "line",
            name: "Pdc",
            tooltip: {
                valueSuffix: " W",
                valueDecimals: 0
            },
            zIndex: 3,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: 1,
            data: []
        }, {
            yAxis: 4,
            color: GraphColors.orange,
            lineWidth: 1,
            type: "line",
            name: "iOI1",
            tooltip: {
                valueSuffix: " A",
                valueDecimals: 1
            },
            zIndex: 3,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: 1,
            data: []
        }, {
            yAxis: 3,
            color: GraphColors.blue,
            lineWidth: 1,
            type: "line",
            name: "bv",
            tooltip: {
                valueSuffix: " V",
                valueDecimals: 2
            },
            zIndex: 3,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: !1,
            data: []
        }]
    };

*/

    configs["consumption"] = {
        options: {
            colors: [GraphColors.lightRed, GraphColors.lightGreen, GraphColors.lightBlue, GraphColors.lightOrange],
            chart: {
                type: "column"
            },
            plotOptions: {
                series: {
                    stacking: "normal",
                    pointPadding: 0,
                    groupPadding: .02,
                    borderWidth: 0
                }
            },
            tooltip: getTooltipFormatterWithTotal([0, 1, 2, 3], locale.getString("graph.kwh"))
        },
        xAxis: {
            type: "datetime",
            gridLineColor: "#f5f4f0",
            gridLineWidth: 16,
            minorGridLineColor: "#f5f4f0",
            minorGridLineWidth: 16,
            minorTickLength: 0,
            minorTickInterval: "auto"
        },
        yAxis: [{
            title: {
                text: "kWh",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 5
            },
            gridLineWidth: 0,
            showFirstLabel: !0
        }],
        series: [{
            name: locale.getString("graph.from_grid"),
            tooltip: {
                valueSuffix: " " + "kWh",
                valueDecimals: 2,
                //pointFormat: getTablePointFormat()
            },
            states: {
                hover: {
                    color: GraphColors.red
                }
            },
            index: 0,
            visible: !1,
            data: []
        }, {
            name: locale.getString("graph.from_genset"),
            tooltip: {
                valueSuffix: " " + "kWh",
                valueDecimals: 2,
                //pointFormat: getTablePointFormat()
            },
            states: {
                hover: {
                    color: GraphColors.green
                }
            },
            index: 1,
            visible: !1,
            data: []
        }, {
            name: locale.getString("graph.from_battery"),
            tooltip: {
                valueSuffix: " " + "kWh",
                valueDecimals: 2,
                //pointFormat: getTablePointFormat()
            },
            states: {
                hover: {
                    color: GraphColors.blue
                }
            },
            index: 2,
            visible: !1,
            data: []
        }, {
            name: locale.getString("graph.from_solar"),
            tooltip: {
                valueSuffix: " " + "kWh",
                valueDecimals: 2,
                //pointFormat: getTablePointFormat()
            },
            states: {
                hover: {
                    color: GraphColors.orange
                }
            },
            index: 3,
            visible: !1,
            data: []
        }]
    };

    configs["solar"] = {
            options: {
                color: [GraphColors.lightRed, GraphColors.lightBlue, GraphColors.lightOrange],
                chart: {
                    type: "column"
                },
                plotOptions: {
                    series: {
                        stacking: "normal",
                        pointPadding: 0,
                        groupPadding: .02,
                        borderWidth: 0
                    }
                },
                tooltip: getTooltipFormatterWithTotal([0, 1, 2], locale.getString("graph.kwh"))
            },
            xAxis: {
                type: "datetime",
                gridLineColor: "#f5f4f0",
                gridLineWidth: 16,
                minorGridLineColor: "#f5f4f0",
                minorGridLineWidth: 16,
                minorTickLength: 0,
                minorTickInterval: "auto"
            },
            yAxis: [{
                title: {
                    text: " " + "kWh",
                    align: "high",
                    y: -20,
                    rotation: 0,
                    offset: 5
                },
                gridLineWidth: 0,
                showFirstLabel: !0
            }],
            series: [{
                name: locale.getString("graph.to_grid"),
                tooltip: {
                    valueSuffix: " " + "kWh",
                    valueDecimals: 2,
                    //pointFormat: getTablePointFormat()
                },
                states: {
                    hover: {
                        color: GraphColors.red
                    }
                },
                visible: !1,
                data: []
            }, {
                name: locale.getString("graph.to_battery"),
                tooltip: {
                    valueSuffix: " " + "kWh",
                    valueDecimals: 2,
                    //pointFormat: getTablePointFormat()
                },
                states: {
                    hover: {
                        color: GraphColors.blue
                    }
                },
                visible: !1,
                data: []
            }, {
                name: locale.getString("graph.direct_use"),
                tooltip: {
                    valueSuffix: " " + "kWh",
                    valueDecimals: 2,
                    //pointFormat: getTablePointFormat()
                },
                states: {
                    hover: {
                        color: GraphColors.orange
                    }
                },
                visible: !1,
                data: []
            }]
        };

    configs["live_feed"] = {
        options: {
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                    groupPadding: .02,
                    shadow: !1
                }
            },
            tooltip: getTooltipFormatterWithTotal([0, 1], locale.getString("graph.kwh"), !0)
        },
        xAxis: {
            type: "datetime",
            gridLineColor: "#f5f4f0",
            gridLineWidth: 16,
            minorGridLineColor: "#f5f4f0",
            minorGridLineWidth: 16,
            minorTickLength: 0,
            minorTickInterval: "auto"
        },
        yAxis: [{
            title: {
                text: locale.getString("graph.kwh"),
                align: "high",
                y: -20,
                rotation: 0,
                offset: 5
            },
            gridLineWidth: 0,
            visible: 1,
            showFirstLabel: !0
        }, {
            min: 0,
            max: 100,
            tickInterval: 10,
            alignTicks: false,
            endOnTick: false,
            title: {
                text: "  %",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 8,
                style: {
                    color: GraphColors.blue
                }
            },
            labels: {
                align: "center",
                style: {
                    color: GraphColors.blue
                }
            },
            gridLineWidth: 0,
            opposite: !0,
            visible: 1,
            showFirstLabel: !0
        }, {
            title: {
                text: "W",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 5,
                style: {
                    color: GraphColors.orange
                }
            },
            minPadding: 0,
            maxPadding: .1,
            forceTickAt0: !0,
            tickAmount: 7,
            labels: {
                format: "{value:.0f}",
                style: {
                    color: GraphColors.orange
                }
            },
            gridLineWidth: 0,
            showFirstLabel: !0,
            visible: !1
        }, {
            title: {
                text: "V",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 25,
                style: {
                    color: GraphColors.blue
                }
            },
            tickAmount: 10,
            minTickInterval: .1,
            labels: {
                format: "{value:.2f}",
                style: {
                    color: GraphColors.blue
                }
            },
            maxPadding: .2,
            minPadding: .2,
            gridLineWidth: 0,
            showFirstLabel: !0,
            visible: !1
        }, {
            title: {
                text: "A",
                align: "high",
                y: -20,
                rotation: 0,
                offset: 25,
                style: {
                    color: GraphColors.orange
                }
            },
            minPadding: 0,
            maxPadding: .2,
            forceTickAt0: !0,
            labels: {
                format: "{value:.2f}",
                style: {
                    color: GraphColors.orange
                }
            },
            gridLineWidth: 0,
            showFirstLabel: !0,
            visible: !1
        }],
        series: [{
            yAxis: 0,
            color: GraphColors.lightRed,
            type: "column",
            key: "total_consumption",
            name: locale.getString("graph.total_consumption"),
            tooltip: {
                valueSuffix: " " + locale.getString("graph.kwh"),
                valueDecimals: 2,
                //pointFormat: getTablePointFormat()
            },
            states: {
                hover: {
                    color: GraphColors.red
                }
            },
            zIndex: 1,
            visible: 1,
            data: []
        }, {
            yAxis: 0,
            color: GraphColors.lightOrange,
            type: "column",
            key: "total_solar_yield",
            name: locale.getString("graph.total_solar_yield"),
            tooltip: {
                valueSuffix: " " + locale.getString("graph.kwh"),
                valueDecimals: 2,
                //pointFormat: getTablePointFormat()
            },
            states: {
                hover: {
                    color: GraphColors.orange
                }
            },
            zIndex: 1,
            visible: 1,
            data: []
        }, {
            yAxis: 1,
            color: GraphColors.blue,
            lineWidth: 1,
            type: "line",
            key: "bv",
            name: locale.getString("graph.bv"),
            tooltip: {
                valueSuffix: " %",
                valueDecimals: 0,
                //pointFormat: getTablePointFormat()
            },
            zIndex: 3,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: !1,
            data: []
        }, {
            yAxis: 1,
            lineWidth: 0,
            type: "arearange",
            linkedTo: ":previous",
            color: GraphColors.lightBlue,
            key: "bs",
            name: locale.getString("graph.bs"),
            tooltip: {
                valueSuffix: " %",
                valueDecimals: 0,
                //pointFormat: getTablePointFormat(!0)
            },
            fillOpacity: .3,
            zIndex: 0,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: 1,
            data: []
        }, {
            yAxis: 2,
            color: GraphColors.orange,
            lineWidth: 1,
            type: "line",
            key: "Pdc",
            name: locale.getString("graph.Pdc"),
            tooltip: {
                valueSuffix: " W",
                valueDecimals: 0
            },
            zIndex: 3,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: !1,
            data: []
        }, {
            yAxis: 4,
            color: GraphColors.orange,
            lineWidth: 1,
            type: "line",
            key: "iOI1",
            name: locale.getString("graph.iOI1"),
            tooltip: {
                valueSuffix: " A",
                valueDecimals: 1
            },
            zIndex: 3,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: !1,
            data: []
        }, {
            yAxis: 3,
            color: GraphColors.blue,
            lineWidth: 1,
            type: "line",
            key: "bv2",
            name: locale.getString("graph.bv2"),
            tooltip: {
                valueSuffix: " V",
                valueDecimals: 2
            },
            zIndex: 3,
            marker: {
                radius: 2
            },
            states: {
                hover: {
                    lineWidth: 1,
                    halo: null
                }
            },
            visible: !1,
            data: []
        }]
    };


})( jQuery );