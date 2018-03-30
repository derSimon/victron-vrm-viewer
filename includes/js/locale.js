var locale = {

    graph : {

        kwh: "kWh",
        total_consumption: "Total Consumption",
        total_solar_yield: "Solar",
        bv: "Battery Average",
        bs: "Battery Range",
        Pdc: "Pdc",
        iOI1: "iOI1",
        bv2: "bv",

        from_grid: "from_grid",
        from_genset: "from_genset",
        from_battery: "from_battery",
        from_solar: "from_solar",
        to_grid: "to_grid",
        to_battery: "to_battery",
        direct_use: "direct_use"
    },

    getString: function(stringExpression){
        var value = eval("locale." + stringExpression);

        return value;
    }
};
