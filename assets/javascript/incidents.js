function trafficReports(zipcode) {
    var APIkey = "B2YlPTpymmLZyHWhh9HZSdmdTgQkilzp";
    var zipcode = zipcode;
    var queryZip = "https://www.mapquestapi.com/geocoding/v1/address?key=" + APIkey + "&location=" + zipcode;
    $.ajax({
        url: queryZip,
        method: "get"
    }).done(function (data) {
        var lat = (data.results[0].locations[0].latLng.lat);
        var long = (data.results[0].locations[0].latLng.lng);
        var lat1 = lat + .075;
        var lat2 = lat - .075
        var long1 = long + .15;
        var long2 = long - .15;
        var queryUrl = "https://www.mapquestapi.com/traffic/v2/incidents?&outFormat=json&boundingBox=" + lat1 + "%2C" + long1 + "%2C" + lat2 + "%2C" + long2 + "&key=" + APIkey;
        $.ajax({
            url: queryUrl,
            method: "get"
        }).done(function (data) {
            // console.log(data);
            if (data.incidents.length === 0) {
                $("#incidents-list").html("<strong>No incidents to report</strong>");
            }
            else {
                for (var i = 0; i < data.incidents.length; i++) {
                    // console.log(data.incidents[i].shortDesc);
                    var traffic = (data.incidents[i].shortDesc);
                    var li = $("<li>").html(traffic);
                    
                    $("#incidents-list").append(li);
                
                }
            }
        });
    })
}