// variables
cd = {};
cd.url = "https://services.coastalresilience.org:6080/arcgis/rest/services/NCS/NCS_CountryDashboard/MapServer";
cd.querySource = "menu";
cd.selectedCountry = 0;
cd.countries = 1;
cd.atts = [];
cd.highArray = ["refor_high", "defor_high", "natfor_high", "peat_res_high", "peat_loss_high", "wfuel_high", "mangrove_high", "rice_high", "optint_high", "legumes_high"];
cd.maxArray =  ["refor_max",  "defor_max",  "natfor_max",  "peat_res_max",  "peat_loss_max",  "wfuel_max",  "mangrove_max",  "rice_max",  "optint_max",  "legumes_max"];
cd.sumArray =  ["refor_sum",  "defor_sum",  "natfor_sum",  "peat_res_sum",  "peat_loss_sum",  "wfuel_sum",  "mangrove_sum",  "rice_sum",  "optint_sum",  "legumes_sum"];
cd.linkArray = {
	refor: "https://nature4climate.org/what-is-the-science/n4c-pathways/forests/reforestation",
	defor: "https://nature4climate.org/what-is-the-science/n4c-pathways/forests/avoided-forest-conversion",
	natfor: "https://nature4climate.org/what-is-the-science/n4c-pathways/forests/natural-forest-management",
	peat_res: "https://nature4climate.org/what-is-the-science/n4c-pathways/wetlands/peatland-restoration",
	peat_loss: "https://nature4climate.org/what-is-the-science/n4c-pathways/wetlands/avoided-peatlands-impacts",
	wfuel: "https://nature4climate.org/what-is-the-science/n4c-pathways/forests/avoided-fuelwood-harvest",
	mangrove: "https://nature4climate.org/what-is-the-science/n4c-pathways/wetlands/avoided-coastal-wetland-impacts",
	rice: "https://nature4climate.org/what-is-the-science/n4c-pathways/grassland-and-agricultural-lands/improved-rice-cultivation",
	optint: "https://nature4climate.org/what-is-the-science/n4c-pathways/grassland-and-agricultural-lands/grazing-optimal-intensity",
	legumes: "https://nature4climate.org/what-is-the-science/n4c-pathways/grassland-and-agricultural-lands/grazing-legumes-in-pastures"
}
cd.ndcRange = {
	Afghanistan: "0 - 14%",
	Australia: "26 - 28%",
	Bahamas: "0 - 30%",
	China: "60 - 65%",
	Ecuador: "20 - 25%",
	French_Guiana: "See France",
	Kyrgyzstan: "11 - 14%",
	Moldova: "64 - 67%",
	Russian_Federation: "25 -30%",
	Saudi_Arabia: "0 - 14%",
	Tajikistan: "10 - 20%",
	Uganda: "0 - 22%",
	United_States: "26 - 28%"
}
cd.country = "";
cd.reportCountries =  ["Australia", "Argentina", "Brazil", "Cambodia", "Canada", "Chile", "China", "Columbia", "Costa Rica", "Democratic Republic of the Congo", "Fiji", "Finland", 
					 	"France",	"Gabon", "Germany", "Guinea", "India", "Indonesia", "Japan", "Kenya", "Madagascar", "Malaysia", "Mexico", "Mongolia", "Morocco", 
					 	"Mozambique", "Namibia", "Norway",  "Papua New Guinea", "Peru", "Poland", "Republic of the Marshall Islands", "Russian Federation", 
					 	"Tanzania", "United States", "Zambia"];
