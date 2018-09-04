// using news API to display top 5 news trending articles from different sources

function getNews() {
    var apiKey = "46a9b0d9ba26414386df440633767a93";
    var queryUrl = "https://newsapi.org/v2/top-headlines?sources=bbc-news,cnn,espn,buzzfeed,cnbc" +
        "&apiKey=" + apiKey;

    // Performing GET requests to the news API and logging the responses to the console
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).done(function (response) {
        console.log(response);
        var articles = response.articles;

        // Loop through and provide the one article from each source
        for (var i = 0; i < articles.length; i += 10) {

            //get data from response
            var title = response.articles[i].title;
            var url = response.articles[i].url;
            var source = response.articles[i].source.name;

            //create elements for news data
            var articleDiv = $("<div>");
            articleDiv.addClass('well');
            var ptag = $("<p>");
            ptag.addClass("title-link");
            var atag = $("<a></a>");
            atag.attr("href", url);
            atag.attr("target", "_blank");
            var pSource = $("<p>");
            pSource.addClass("news-source");
            var linkBookmark = $("<a href='#' data-toggle='tooltip' title='Click to Bookmark' class='bookmark' data-url=article,"+url+"><i class='fa fa-bookmark' aria-hidden='true'></i></a>");
            // append data from response to appropriate elements created
            atag.text(title);
            ptag.append(atag);
            pSource.text("Source: " + source);
            articleDiv.append(ptag)
            articleDiv.append(pSource);
            articleDiv.append(linkBookmark);
            $(".nat-news-pan").append(articleDiv);
        }

        for (var i = 2; i < articles.length; i += 10) {
            
            //get data from response
            var title = response.articles[i].title;
            var url = response.articles[i].url;
            var source = response.articles[i].source.name;

            //create elements for news data
            var articleDiv = $("<div>");
            articleDiv.addClass('well');
            var ptag = $("<p>");
            ptag.addClass("title-link");
            var atag = $("<a></a>");
            atag.attr("href", url);
            atag.attr("target", "_blank");
            var pSource = $("<p>");
            pSource.addClass("news-source");
            var linkBookmark = $("<a href='#' data-toggle='tooltip' title='Click to Bookmark' class='bookmark' data-url=article,"+url+"><i class='fa fa-bookmark' aria-hidden='true'></i></a>");

            // append data from response to appropriate elements created
            atag.text(title);
            ptag.append(atag);
            pSource.text("Source: " + source);
            articleDiv.append(ptag)
            articleDiv.append(pSource);
            articleDiv.append(linkBookmark);
            $("#collapse2").append(articleDiv);
        }
    });

}

