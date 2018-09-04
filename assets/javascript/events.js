// Using seekgeek API to display local events to the user based on user location
// client ID - OTk1Mzg5MXwxNTEzMTkwMTM0LjYz
// app secret - a9111cda0894e7db22f84101a84721d36536558bf69dc50af8ab2903b18b1156
function events(x) {
    var zipcode = x;
    var queryURL = "https://api.seatgeek.com/2/events?client_id=OTk1Mzg5MXwxNTEzMTkwMTM0LjYz&postal_code=" + zipcode;

    // Performing GET requests to the seekgeek API and logging the responses to the console
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        console.log(response);
        var events = response.events;

        //pick top 5 events from response to display to user
        for (var i = 0; i < 5; i++) {
            // store data from response in local variables
            var shortTitle = response.events[i].short_title;
            var url = response.events[i].url;
            var venue = response.events[i].venue.name;
            var date = moment(response.events[i].datetime_local).format("MMMM Do, h:mm a");
            var id = response.events[i].id;

            // create html elements to display data
            var eventDiv = $("<div>");
            eventDiv.addClass('well well-lg');
            var ptag = $("<p>");
            ptag.addClass("title-link");
            var atag = $("<a></a>");
            atag.attr("href", url);
            atag.attr("target", "_blank");
            var pVenue = $("<p>");
            pVenue.addClass("venue");
            var pDate = $("<p>");
            pDate.addClass("event-date");
            var pBook = $("<p>");
            pBook.addClass("event-" + id);
            var linkBookmark = $("<a href='#' data-toggle='tooltip' title='Click to Bookmark' class='bookmark' data-url=event,"+url+"><i class='fa fa-bookmark' aria-hidden='true'></i></a>");

            atag.text(shortTitle);
            ptag.append(atag);
            pVenue.text("Where: " + venue);
            pDate.text("When: " + date);
            eventDiv.append(ptag)
            eventDiv.append(pVenue);
            eventDiv.append(pDate);
            eventDiv.append(pBook);
            eventDiv.append(linkBookmark);
            $(".events-pan").append(eventDiv);
        }

        for (var i = 5; i < events.length; i++) {
            // store data from response in local variables
            var shortTitle = response.events[i].short_title;
            var url = response.events[i].url;
            var venue = response.events[i].venue.name;
            var date = moment(response.events[i].datetime_local).format("MMMM Do, h:mm a");
            var id = response.events[i].id;

            // create html elements to display data
            var eventDiv = $("<div>");
            eventDiv.addClass('well well-lg');
            var ptag = $("<p>");
            ptag.addClass("title-link");
            var atag = $("<a></a>");
            atag.attr("href", url);
            atag.attr("target", "_blank");
            var pVenue = $("<p>");
            pVenue.addClass("venue");
            var pDate = $("<p>");
            pDate.addClass("event-date");
            var pBook = $("<p>");   
            pBook.addClass("event-" + id);
            var linkBookmark = $("<a href='#' data-toggle='tooltip' title='Click to Bookmark' class='bookmark' data-url=event,"+url+"><i class='fa fa-bookmark' aria-hidden='true'></i></a>");

            atag.text(shortTitle);
            ptag.append(atag);
            pVenue.text("Where: " + venue);
            pDate.text("When: " + date);
            eventDiv.append(ptag)
            eventDiv.append(pVenue);
            eventDiv.append(pDate);
            eventDiv.append(pBook);
            eventDiv.append(linkBookmark);
            $("#collapse1").append(eventDiv);
        }
    })
}