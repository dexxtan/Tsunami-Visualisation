// print out a json file with all data
/*d3.json("/data/tsunami-eventsfull.json", function(data) {
  d3.json("/data/tsunami-hits.json", function(hit_data) {
    var output = "{";
    var first = true;
    for (var d in data) {
    	if (first) {
    		first = false;
    	} else {
				output += ",";
    	}
			output += "&quot;" + data[d].LOCATION_NAME + "-" + data[d].ID + "-&quot;:[";
			output += (data[d].ID ? data[d].ID : "null") + ",";                                 																// [0]
			output += (data[d].YEAR ? data[d].YEAR : "null") + ",";                              																// [1]
			output += (data[d].MONTH ? data[d].MONTH : "null") + ",";                              															// [2]
			output += (data[d].DAY ? data[d].DAY : "null") + ",";                                																// [3]
			output += (data[d].HOUR ? data[d].HOUR : "null") + ",";                               															// [4]
			output += (data[d].MINUTE ? data[d].MINUTE : "null") + ",";                             														// [5]
			output += (data[d].SECOND ? data[d].SECOND : "null") + ",";                             														// [6]
			output += (data[d].EVENT_VALIDITY ? data[d].EVENT_VALIDITY : "null") + ",";                     										// [7]
			output += (data[d].CAUSE_CODE ? data[d].CAUSE_CODE : "null") + ",";                         												// [8]
			output += (data[d].FOCAL_DEPTH ? data[d].FOCAL_DEPTH : "null") + ",";                        												// [9]
			output += (data[d].PRIMARY_MAGNITUDE ? data[d].PRIMARY_MAGNITUDE : "null") + ",";                  									// [10]
			output += (data[d].COUNTRY ? ("&quot;" + data[d].COUNTRY + "&quot;") : "null") + ",";                            		// [11]
			output += (data[d].STATE ? ("&quot;" + data[d].STATE + "&quot;") : "null") + ",";                              			// [12]
			output += (data[d].LOCATION_NAME ? ("&quot;" + data[d].LOCATION_NAME + "&quot;") : "null") + ",";                   // [13]
			output += (data[d].LATITUDE ? data[d].LATITUDE : "null") + ",";                           													// [14]
			output += (data[d].LONGITUDE ? data[d].LONGITUDE : "null") + ",";                          													// [15]
			output += (data[d].REGION_CODE ? data[d].REGION_CODE : "null") + ",";                        												// [16]
			output += (data[d].MAXIMUM_WATER_HEIGHT ? data[d].MAXIMUM_WATER_HEIGHT : "null") + ",";               							// [17]
			output += (data[d].ABE ? data[d].ABE : "null") + ",";                                																// [18]
			output += (data[d].IIDA ? data[d].IIDA : "null") + ",";                               															// [19]
			output += (data[d].SOLOVIEV ? data[d].SOLOVIEV : "null") + ",";                           													// [20]
			output += (data[d].WARNING_STATUS ? data[d].WARNING_STATUS : "null") + ",";                     										// [21]
			output += (data[d].DEATHS ? data[d].DEATHS : "null") + ",";                             														// [22]
			output += (data[d].DEATHS_DESCRIPTION ? data[d].DEATHS_DESCRIPTION : "null") + ",";                 								// [23]
			output += (data[d].MISSING ? data[d].MISSING : "null") + ",";                            														// [24]
			output += (data[d].MISSING_DESCRIPTION ? data[d].MISSING_DESCRIPTION : "null") + ",";                								// [25]
			output += (data[d].INJURIES ? data[d].INJURIES : "null") + ",";                           													// [26]
			output += (data[d].INJURIES_DESCRIPTION ? data[d].INJURIES_DESCRIPTION : "null") + ",";               							// [27]
			output += (data[d].DAMAGE_MILLIONS_DOLLARS ? data[d].DAMAGE_MILLIONS_DOLLARS : "null") + ",";            						// [28]
			output += (data[d].DAMAGE_DESCRIPTION ? data[d].DAMAGE_DESCRIPTION : "null") + ",";																	// [29]
			output += (data[d].HOUSES_DESTROYED ? data[d].HOUSES_DESTROYED : "null") + ",";																			// [30]
			output += (data[d].HOUSES_DESTROYED_DESCRIPTION ? data[d].HOUSES_DESTROYED_DESCRIPTION : "null") + ",";							// [31]
			output += (data[d].HOUSES_DAMAGED ? data[d].HOUSES_DAMAGED : "null") + ",";																					// [32]
			output += (data[d].HOUSES_DAMAGED_DESCRIPTION ? data[d].HOUSES_DAMAGED_DESCRIPTION : "null") + ",";									// [33]
			output += (data[d].TOTAL_DEATHS ? data[d].TOTAL_DEATHS : "null") + ",";																							// [34]
			output += (data[d].TOTAL_DEATHS_DESCRIPTION ? data[d].TOTAL_DEATHS_DESCRIPTION : "null") + ",";											// [35]
			output += (data[d].TOTAL_MISSING ? data[d].TOTAL_MISSING : "null") + ",";																						// [36]
			output += (data[d].TOTAL_MISSING_DESCRIPTION ? data[d].TOTAL_MISSING_DESCRIPTION : "null") + ",";										// [37]
			output += (data[d].TOTAL_INJURIES ? data[d].TOTAL_INJURIES : "null") + ",";																					// [38]
			output += (data[d].TOTAL_INJURIES_DESCRIPTION ? data[d].TOTAL_INJURIES_DESCRIPTION : "null") + ",";									// [39]
			output += (data[d].TOTAL_DAMAGE_MILLIONS_DOLLARS ? data[d].TOTAL_DAMAGE_MILLIONS_DOLLARS : "null") + ",";						// [40]
			output += (data[d].TOTAL_DAMAGE_DESCRIPTION ? data[d].TOTAL_DAMAGE_DESCRIPTION : "null") + ",";											// [41]
			output += (data[d].TOTAL_HOUSES_DESTROYED ? data[d].TOTAL_HOUSES_DESTROYED : "null") + ",";													// [42]
			output += (data[d].TOTAL_HOUSES_DESTROYED_DESCRIPTION ? data[d].TOTAL_HOUSES_DESTROYED_DESCRIPTION : "null") + ",";	// [43]
			output += (data[d].TOTAL_HOUSES_DAMAGED ? data[d].TOTAL_HOUSES_DAMAGED : "null") + ",";															// [44]
			output += (data[d].TOTAL_HOUSES_DAMAGED_DESCRIPTION ? data[d].TOTAL_HOUSES_DAMAGED_DESCRIPTION : "null") + ",";			// [45]
			output += "["
			var subFirst = true;
			for (var h in hit_data) {
				if (data[d].ID == hit_data[h].TSEVENT_ID) {
					if (subFirst) {
						subFirst = false;
					} else {
						output += ",";
					}
					output += "[";
					output += (hit_data[h].I_D ? hit_data[h].I_D : "null") + ",";																								// [0]
					output += (hit_data[h].TSEVENT_ID ? hit_data[h].TSEVENT_ID : "null") + ",";																	// [1]
					output += (hit_data[h].YEAR ? hit_data[h].YEAR : "null") + ",";																							// [2]
					output += (hit_data[h].MONTH ? hit_data[h].MONTH : "null") + ",";																						// [3]
					output += (hit_data[h].DAY ? hit_data[h].DAY : "null") + ",";																								// [4]
					output += (hit_data[h].DOUBTFUL ? ("&quot;" + hit_data[h].DOUBTFUL + "&quot;") : "null") + ",";							// [5]
					output += (hit_data[h].COUNTRY ? ("&quot;" + hit_data[h].COUNTRY + "&quot;") : "null") + ",";								// [6]
					output += (hit_data[h].STATE ? ("&quot;" + hit_data[h].STATE + "&quot;") : "null") + ",";										// [7]
					output += (hit_data[h].LOCATION_NAME ? ("&quot;" + hit_data[h].LOCATION_NAME + "&quot;") : "null") + ",";		// [8]
					output += (hit_data[h].LATITUDE ? hit_data[h].LATITUDE : "null") + ",";																			// [9]
					output += (hit_data[h].LONGITUDE ? hit_data[h].LONGITUDE : "null") + ",";																		// [10]
					output += (hit_data[h].REGION_CODE ? hit_data[h].REGION_CODE : "null") + ",";																// [11]
					output += (hit_data[h].DISTANCE_FROM_SOURCE ? hit_data[h].DISTANCE_FROM_SOURCE : "null") + ",";							// [12]
					output += (hit_data[h].TRAVEL_TIME_HOURS ? hit_data[h].TRAVEL_TIME_HOURS : "null") + ",";										// [13]
					output += (hit_data[h].TRAVEL_TIME_MINUTES ? hit_data[h].TRAVEL_TIME_MINUTES : "null") + ",";								// [14]
					output += (hit_data[h].WATER_HT ? hit_data[h].WATER_HT : "null") + ",";																			// [15]
					output += (hit_data[h].HORIZONTAL_INUNDATION ? hit_data[h].HORIZONTAL_INUNDATION : "null") + ",";						// [16]
					output += (hit_data[h].TYPE_MEASUREMENT_ID ? hit_data[h].TYPE_MEASUREMENT_ID : "null") + ",";								// [17]
					output += (hit_data[h].PERIOD ? hit_data[h].PERIOD : "null") + ",";																					// [18]
					output += (hit_data[h].FIRST_MOTION ? ("&quot;" + hit_data[h].FIRST_MOTION + "&quot;") : "null") + ",";			// [19]
					output += (hit_data[h].DEATHS ? hit_data[h].DEATHS : "null") + ",";																					// [20]
					output += (hit_data[h].DEATHS_DESCRIPTION ? hit_data[h].DEATHS_DESCRIPTION : "null") + ",";									// [21]
					output += (hit_data[h].INJURIES ? hit_data[h].INJURIES : "null") + ",";																			// [22]
					output += (hit_data[h].INJURIES_DESCRIPTION ? hit_data[h].INJURIES_DESCRIPTION : "null") + ",";							// [23]
					output += (hit_data[h].DAMAGE_MILLIONS_DOLLARS ? hit_data[h].DAMAGE_MILLIONS_DOLLARS : "null") + ",";				// [24]
					output += (hit_data[h].DAMAGE_DESCRIPTION ? hit_data[h].DAMAGE_DESCRIPTION : "null") + ",";									// [25]
					output += (hit_data[h].HOUSES_DAMAGED ? hit_data[h].HOUSES_DAMAGED : "null") + ",";													// [26]
					output += (hit_data[h].HOUSES_DAMAGED_DESCRIPTION ? hit_data[h].HOUSES_DAMAGED_DESCRIPTION : "null") + ",";	// [27]
					output += (hit_data[h].HOUSES_DESTROYED ? hit_data[h].HOUSES_DESTROYED : "null") + ",";											// [28]
					output += (hit_data[h].HOUSES_DESTROYED_DESCRIPTION ? hit_data[h].HOUSES_DESTROYED_DESCRIPTION : "null");		// [29]
					output += "]";
				}
			}
			output += "]]";
    }
    output += "}";
    $("#output").append(output);
  });
});*/