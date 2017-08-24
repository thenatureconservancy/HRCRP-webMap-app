// variables
cd = {};
cd.url = "http://tnc.eastus.cloudapp.azure.com/arcgis/rest/services/NaturalClimateSolutions/NCS_CountryDashboard/MapServer";
cd.querySource = "menu";
cd.selectedCountry = 0;
cd.countries = 1;
cd.atts = [];
cd.highArray = ["refor_high", "defor_high", "natfor_high", "peat_res_high", "peat_loss_high", "wfuel_high", "mangrove_high", "rice_high", "optint_high", "legumes_high"];
cd.maxArray =  ["refor_max",  "defor_max",  "natfor_max",  "peat_res_max",  "peat_loss_max",  "wfuel_max",  "mangrove_max",  "rice_max",  "optint_max",  "legumes_max"];
cd.sumArray =  ["refor_sum",  "defor_sum",  "natfor_sum",  "peat_res_sum",  "peat_loss_sum",  "wfuel_sum",  "mangrove_sum",  "rice_sum",  "optint_sum",  "legumes_sum"];
cd.country = "";
cd.reportCountries = ["Australia", "Brazil", "Canada", "China", "Germany", "India", "Indonesia", "Kenya", "Mexico", "United States"];
