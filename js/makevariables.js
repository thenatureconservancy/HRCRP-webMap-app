// variables
cd = {};
cd.url = "http://tnc.eastus.cloudapp.azure.com/arcgis/rest/services/NaturalClimateSolutions/NCS_CountryDashboard/MapServer";
cd.querySource = "menu";
cd.selectedCountry = 0;
cd.countries = 1;
cd.atts = [];
cd.highArray = ["defor_high", "wfuel_high", "mangrove_high","peat_loss_high","legumes_high","optint_high","rice_high","natfor_high","peat_res_high","refor_high"];
cd.maxArray = ["refor_max", "defor_max", "natfor_max", "peat_res_max", "peat_loss_max", "wfuel_max", "mangrove_max", "rice_max", "optint_max", "legumes_max"];
cd.sumArray = ["refor_sum", "defor_sum", "natfor_sum", "peat_res_sum", "peat_loss_sum", "wfuel_sum", "mangrove_sum", "rice_sum", "optint_sum", "legumes_sum"];
// cd.degArray = ["mangrove_2deg","peat_loss_2deg","legumes_2deg","optint_2deg","rice_2deg","natfor_2deg","peat_res_2deg","refor_2deg"];
cd.country = "";
cd.reportCountries = ["Australia", "Brazil", "Canada", "China", "Germany", "India", "Indonesia", "Kenya", "Mexico", "United States"];
