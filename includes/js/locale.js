var locale = {

    graph : {
        kwh: "kWh",
        consumption: "total_consumption",
        solar: "total_solar_yield",
        battery_avg: "bv",
        battery_range: "bs",
        Pdc: "Pdc",
        iOI1: "iOI1",
        bv: "bv"
    },

    getString: function(stringExpression){
        var value = eval("locale." + stringExpression);

        return value;
    }
};
