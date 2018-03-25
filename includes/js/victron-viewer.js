(function($) {

    $( document ).ready(function() {
        console.log( "ready!" );

        var installation_id = $('#vrm-viewer').data('id');

        get_installation_data(installation_id);
    });



    function get_installation_data (installation_id) {
        $.ajax({
            url: "wp-admin/admin-ajax.php",
            type: "POST",
            data: {
                action: 'vrm_ajax',
                id: installation_id
            },
            success: function (data) {

                var configWithData = addChartData(data, configs['liveFeed']);
                var myChart = Highcharts.chart('vrm-viewer', configWithData);

                console.log(JSON.stringify(configWithData, null, 2));
            },
            error: function () {
                console.log("Error");
            }
        });
    }

    function addChartData(data, config){

        config.series.forEach(
            function(series){
                series.data = data.records[series.name];
            });

        return config;
    }

    var configs = ["liveFeed"];

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
    }

})( jQuery );