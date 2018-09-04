var cleanUnEmail = "";
// at page load
$(document).ready(function () {
    // Initialize firebase
    app.initFireBase();

    var savedEmail = localStorage.getItem("savedEmail");
    
    if (savedEmail) {

        app.userlogin(savedEmail);
        $("#logout").attr("style", "display:inline");

    } else {

        $(".modal-outer-username").fadeIn(750);

        $(".usernameNeed").click(function (event) {

            // Prevent the page from refreshing
            event.preventDefault();

            // animation on user input forms
            $(".modal-outer-username").hide();
            $(".modal-inner-username").hide();
            $(".modal-outer").slideToggle(750);
            $(".modal-inner").slideToggle(750);
        });

        // on click of submit button
        $(".usernameSubmit").click(function (event) {

            // Prevent the page from refreshing
            event.preventDefault();

            // log the user in
            app.userlogin();
        });

        // new user data is updated in firebase after registration
        $(".modalBtn").click(function (event) {

            // Prevent the page from refreshing
            event.preventDefault();

            // add the user to the database
            app.newUser();
        });

    };

    // when the map panel header is clicked
    $("#map-panel-heading").click(function (event) {

        // expand or collapse the map 
        app.toggleMap();
    });

    // saving bookmarks from articles and events in firebase
    $(document).on("click", ".bookmark", function () {
        var dataUrl = $(this).attr("data-url");
        var itemBookmarked = dataUrl.split(",");

        // set user data into firebase
        var userRef = app.database.ref().child(cleanUnEmail).child("bookmarks");
        app.database.ref().child(cleanUnEmail + '/bookmarks').orderByChild("bookmark_url").equalTo(itemBookmarked[1]).once("value", snapshot => {
            const userData = snapshot.val();
            if (!userData) {
                userRef.push({
                    bookmark_url: itemBookmarked[1]
                });
            }
        });

    });

    // remove bookmarks when user clicks trash can icon in saved bookmarks panel
    $(document).on("click", ".rmBookmark", function(e){
        e.preventDefault()
        var bookmark = $(this).attr("data-rm-url");
        var key = $(this).attr("data-key");
        
         app.database.ref().child(cleanUnEmail + '/bookmarks/' + key).remove();
        });


    // listen for when a child is removed
    app.database.ref().child(cleanUnEmail + '/bookmarks').on("child_removed", function(snap) {
    // get class based on the child's key and remove the element
        $('#removebm'+snap.key).remove();  
    });

    $("#colBtn1").click(function () {
        app.collapseBtn1();
    });

    $("#colBtn2").click(function () {
        app.collapseBtn2();
    });

    $("#logout").click(function () {

        localStorage.clear();
        location.reload();

    })
});


// core logic 

// app object, contains methods for logging in, creating users, firebase, and map toggle
var app = {

    // when user logs in
    userlogin: function (name) {

        if (name) {

            var existingEmail = name;
            cleanUnEmail = existingEmail.replace(".", ",");

            app.database.ref().child(cleanUnEmail).once("value").then(function (snapshot) {
                if (snapshot.val()) {
                    app.bookmarkListener();
                    var userName = snapshot.val().name;
                    var userLoc = snapshot.val().loc;
                    var currentDate = moment().format("MMMM DD, YYYY");

                    // call weather, news and events to get data using API calls
                    weather.call(userLoc);
                    events(userLoc);
                    trafficReports(userLoc);
                    getNews();
                    app.updateTime();
                    setInterval(app.updateTime, 1000);
                    $(".headerName").text("Welcome, " + userName);
                    $(".date").text(currentDate);

                    $(".modal-outer-username").fadeOut(1000);
                    $(".panel").show(750);
                } else {
                    $("#unDiv").addClass("has-error");
                    $("#labelError").append("<span class='label label-danger'>Invalid username. Please register</span>");
                    $("#labelError").attr("style", "color:rgb(156, 59, 59)");
                }
            });
        } else {

            // get user input from form and store it in local variable
            var unEmail = $("#usernameEmail").val().trim();
            cleanUnEmail = unEmail.replace(".", ",");

            localStorage.setItem("savedEmail", unEmail);


            // user input email validation
            if (unEmail === "") {

                $("#unDiv").addClass("has-error");
                $("#labelError").append("<span class='label label-danger'>Must fill out field</span>");
                $("#labelError").attr("style", "color:rgb(156, 59, 59)");
            } else {


                // retrieve data from firebase and display to user after login
                app.database.ref().child(cleanUnEmail).once("value").then(function (snapshot) {
                    if (snapshot.val()) {
                        app.bookmarkListener();
                        var userName = snapshot.val().name;
                        var userLoc = snapshot.val().loc;
                        var currentDate = moment().format("MMMM DD, YYYY");

                        // call weather, news and events to get data using API calls
                        weather.call(userLoc);
                        events(userLoc);
                        getNews();
                        trafficReports(userLoc);
                        app.updateTime();
                        setInterval(app.updateTime, 1000);
                        $(".headerName").text("Welcome, " + userName);
                        $(".date").text(currentDate);
                        $("#logout").attr("style", "display:inline");

                        $(".modal-outer-username").fadeOut(1000);
                        $(".panel").show(750);
                    }
                    else {
                        $("#unDiv").addClass("has-error");
                        $("#labelError").append("<span class='label label-danger'>Invalid username. Please register</span>");
                        $("#labelError").attr("style", "color:rgb(156, 59, 59)");
                    }
                });

            }
        }
        // $("#logout").attr("style", "display:inline");
    },

    // when a new user logs in
    newUser: function () {

        // get user input from form and store in local variables
        var name = $("#modalName").val();
        var loc = $("#modalLoc").val();
        var email = $("#modalEmail").val();
        cleanUnEmail = email.replace(".", ",");
        localStorage.setItem("savedEmail", email);
        var currentDate = moment().format("MMMM DD, YYYY");
        var currentTime = moment().format("hh:mm a");

        $(".form-group").attr("class", "form-group");
        $("span").text("");
        $("label").attr("style", "");

        if (email === "") {
            $("#newEmailDiv").addClass("has-error");
            $("#newEmailLabel").append("<span class='label label-danger'>Must fill out field</span>");
            $("#newEmailLabel").attr("style", "color:rgb(156, 59, 59)");
        }
        if (name === "") {
            $("#newNameDiv").addClass("has-error");
            $("#newNameLabel").append("<span class='label label-danger'>Must fill out field</span>");
            $("#newNameLabel").attr("style", "color:rgb(156, 59, 59)");
        }
        if (loc === "") {
            $("#newLocDiv").addClass("has-error");
            $("#newLocLabel").append("<span class='label label-danger'>Must fill out field</span>");
            $("#newLocLabel").attr("style", "color:rgb(156, 59, 59)");
        }
        if (email && name && loc) {

            $(".modal-outer").fadeIn(1000);
            $(".modal-outer").hide(750);
            $(".panel").show(750);

            $(".headerName").text("Welcome, " + name);
            $(".date").text(currentDate);
            $("#logout").attr("style", "display:inline");


            // call weather, news and events to get data using API calls
            weather.call(loc);
            events(loc);
            trafficReports(loc);
            getNews();
            app.updateTime();
            setInterval(app.updateTime, 1000);
            // initMap(loc);
            var user = {
                name: name,
                loc: loc,
                email: cleanUnEmail
            }

            // set user data into firebase
            var userRef = app.database.ref().child(user.email);
            userRef.set({
                name: name,
                loc: loc
            });
            app.bookmarkListener();

        }
        // $("#logout").attr("style", "display:inline");
    },

    // hides the map
    toggleMap: function () {

        // if the map div is expanded
        if ($("#map-div").attr("data") == "show") {

            // hide the map div
            $("#map-div").attr('style', "display:none");
            $("#map-div").attr('data', "hide");
            $("#map-panel-title").text("Traffic information hidden, click to show");

            // if the map div is hidden
        } else {

            // show the map div
            $("#map-div").attr('style', "display:show");
            $("#map-div").attr('data', "show");
            $("#map-panel-title").text("Click to hide map");

            // re initialize the map
            app.initMap();
        }
    },

    // initializes the google map JS api
    initMap: function () {

        var uluru = { lat: parseFloat($("#lat-store").val()), lng: parseFloat($("#lon-store").val()) };

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);

    },

    // holds the database reference
    database: "",

    // initializes firebase
    initFireBase: function () {
        var config = {
            apiKey: "AIzaSyCSI6pmvP1pjIdXadFW_b1RBIZCFrmTDI8",
            authDomain: "project-1-8deb1.firebaseapp.com",
            databaseURL: "https://project-1-8deb1.firebaseio.com",
            projectId: "project-1-8deb1",
            storageBucket: "project-1-8deb1.appspot.com",
            messagingSenderId: "880463477699"
        };
        firebase.initializeApp(config);
        // Create a variable to reference the database
        app.database = firebase.database();
    },

    updateTime: function () {
        var currentTime;
        currentTime = moment().format("hh:mm:ss a");
        $(".time").html("<h4>" + currentTime + "</h4>");
    },

    // listner for bookmarks
    bookmarkListener: function () {
        $("#bookmarks").text("");
        app.database.ref().child(cleanUnEmail + '/bookmarks').on("child_added", function (bmSnapshot) {
            var refKey = bmSnapshot.key;
            bmSnapshot.forEach(function (child) {
                var key = child.key;
                var value = child.val();
                var bookDiv = $("<div>");
                bookDiv.addClass("well");
                bookDiv.attr("id","removebm"+refKey);
                var ptag = $("<p>");
                ptag.addClass("bm-link");
                var atag = $("<a></a>");
                atag.attr("href", value);
                atag.attr("target", "_blank");
                atag.text(value);
                ptag.append(atag);
                var removeBookmark = $("<a href='#' data-toggle='tooltip' title='Click to remove bookmark' class='rmBookmark' data-key="+ refKey +" data-rm-url="+ value +"><i class='fa fa-trash-o' aria-hidden='true'></i></a>");
                bookDiv.append(ptag);
                bookDiv.append(removeBookmark);
                $("#bookmarks").append(bookDiv);
            });
        }, function (errorObject) {

            console.log("Errors handled: " + errorObject.code);

        });
    },


    collapseBtn1: function () {
        var colBtnToggle = $("#colBtn1").attr("data-exp");

        if (colBtnToggle == "no") {
            $("#colBtn1").attr("data-exp", "yes");
            $("#collapse1").toggle();
            $("#colBtn1").text("Minimize");
        }
        else {
            $("#colBtn1").attr("data-exp", "no");
            $("#collapse1").toggle();
            $("#colBtn1").text("Expand");
        }

    },

    collapseBtn2: function () {
        var colBtnToggle = $("#colBtn2").attr("data-exp");

        if (colBtnToggle == "no") {
            $("#colBtn2").attr("data-exp", "yes");
            $("#collapse2").toggle();
            $("#colBtn2").text("Minimize");
        }
        else {
            $("#colBtn2").attr("data-exp", "no");
            $("#collapse2").toggle();
            $("#colBtn2").text("Expand");
        }

    }

}
