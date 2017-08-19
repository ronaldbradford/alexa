// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

var languageStrings = {
    'en': {
        'translation': {
            'WELCOME' : "Welcome to Trumbull Connecticut Activities!",
            'HELP'    : "Say about, to hear more about the city, or say food, to hear local restaurant suggestions, or say recommend an activity, or say, weather. ",
            'ABOUT'   : "Trumbull is a town in Fairfield County, Connecticut bordered by the towns of Monroe, Shelton, Stratford, Bridgeport, Fairfield and Easton.",
            'STOP'    : "Thanks for asking about Trumbull, Bye!"
        }
    }
 };
var data = {
    "city"        : "Trumbull",
    "state"       : "CT",
    "postcode"    : "06611",
    "restaurants" : [
        { "name":"Franco Gianni's Pizza",
            "address":"8 Broadway Rd", "phone": "203-268-1616",
            "meals": "food",
            "description": "Enjoy Sumptuous Italian Cuisine & Glorious Pizzas from this family owned and operated restaurant."
        },
        { "name":"Plasko's Farm Creamery",
            "address":"670 Daniels Farm Rd", "phone": "203-268-2716",
            "meals": "food",
            "description": "One of the oldest family owned farms located in Trumbull growing and sells seasonal produce, and plants. Plasko Country Store has an indoor bakery and ice cream bar"
        },
        { "name":"Layla's Falafel",
            "address":"10 Broadway Rd", "phone": "203-590-3787",
            "meals": "food",
            "description": "One of the oldest family owned farms located in Trumbull growing and sells seasonal produce, and plants. Plasko Country Store has an indoor bakery and ice cream bar"
        },
        { "name":"Jennie's Pizzeria",
            "address":"380 Monroe Turnpike", "phone": "203-452-2435",
            "meals": "food",
            "description": "Jennie’s is Fairfield County’s oldest pizzeria with three generations offering great food and friendship"
        },
        { "name":"Bridgeport Brewport",
            "address":"225 South Frontage Road in Bridgeport", "phone": " 203-612-4438",
            "meals": "food, beer",
            "description": "A modern industrial brewpub offering craft beer, pizza & salads in a chill, spacious setting."
        },
        { "name":"Two Roads Brewery",
            "address":"225 South Frontage Road in Bridgeport", "phone": " 203-612-4438",
            "meals": "food, beer",
            "description": "A modern industrial brewpub offering craft beer, pizza & salads in a chill, spacious setting."
        },
        { "name":"Veracious Brewing",
            "address":"246 Main St in Monroe", "phone": "203-880-5670",
            "meals": "beer",
            "description": "Try a wide range of beers on tap.  Open Thursdays, Fridays and Saturdays."
        }
    ],
    "activities":[
        {
            "name": "Rails to Trails",
            "description": "Try biking, walking or cross country skiing in winter on this wheelchair accessible converted railroad track.",
            "distance": "0"
        },
        {
            "name": "Beaches",
            "description": "In summer, local residents can use two town pools, beaches which has a zero entry that is great for children, or Tashua Pool.",
            "distance": "3"
        },
        {
            "name": "Beaches",
            "description": "In summer, local residents can use two town pools, beaches which has a zero entry that is great for children, or Tashua Pool.",
            "distance": "3"
        },
        {
            "name": "The Adventure Park at the Discovery Museum",
            "description": "The best climbing bridges and zip line in Connecticut",
            "distance": "10"
        },
        {
            "name": "Beardsley Zoo",
            "description": "Visit this top Connecticut attraction and learn about many endangered and threatened species.",
            "distance": "10"
        }
    ]
}

// Weather courtesy of the Yahoo Weather API.
// This free API recommends no more than 2000 calls per day

var myAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET'
};
// 2. Skill Code =======================================================================================================

var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var say = this.t('WELCOME') + ' ' + this.t('HELP');
        this.emit(':ask', say, say);
    },

    'AboutIntent': function () {
        this.emit(':tell', this.t('ABOUT'));
    },

    'FoodIntent': function () {
        var restaurant = randomArrayElement(getRestaurantsByMeal('food'));
        this.attributes['restaurant'] = restaurant.name;

        var say = 'Enjoy food at, ' + restaurant.name + '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'BeerIntent': function () {
        var restaurant = randomArrayElement(getRestaurantsByMeal('beer'));
        this.attributes['restaurant'] = restaurant.name;

        var say = 'Enjoy a great beer at, ' + restaurant.name + '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'AMAZON.YesIntent': function () {
        var restaurantName = this.attributes['restaurant'];
        var restaurantDetails = getRestaurantByName(restaurantName);

        var say = restaurantDetails.name
            + ' is located at ' + restaurantDetails.address
            + ', the phone number is ' + restaurantDetails.phone + '.'
            + restaurantDetails.description
            + '  I have sent these details to the Alexa App on your phone. ';

        var card = restaurantDetails.name + '\n' + restaurantDetails.address + '\n'
            + data.city + ', ' + data.state + ' ' + data.postcode
            + '\nphone: ' + restaurantDetails.phone + '\n';

        this.emit(':tellWithCard', say, restaurantDetails.name, card);

    },

    'ActivityIntent': function () {
        var distance = 200;
        if (this.event.request.intent.slots.distance.value) {
            distance = this.event.request.intent.slots.distance.value;
        }

        var activity = randomArrayElement(getActivitiesByDistance(distance));

        var say = 'Try '
            + activity.name + ', which is '
            + (activity.distance == "0" ? 'right downtown. ' : activity.distance + ' miles away. Have fun! ')
            + activity.description;

        this.emit(':tell', say);
    },

    'WeatherIntent': function () {

        getWeather( ( localTime, currentTemp, currentCondition) => {
            // time format 10:34 PM
            // currentTemp 72
            // currentCondition, e.g.  Sunny, Breezy, Thunderstorms, Showers, Rain, Partly Cloudy, Mostly Cloudy, Mostly Sunny

            // sample API URL for Irvine, CA
            // https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22irvine%2C%20ca%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys
            celsius = String(parseInt((parseInt(currentTemp) - 32) * 5/9))
            this.emit(':tell', 'It is ' + currentCondition 
                + ' at ' + localTime
                + ' in ' + data.city
                + ' with the weather at  '
                + currentTemp + 'fahrenheit, that is ' 
                + celsius + 'celsius' );
        });
    },

    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', this.t('HELP'));
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP'));
    }

};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function getRestaurantsByMeal(mealtype) {

    var list = [];
    for (var i = 0; i < data.restaurants.length; i++) {

        if(data.restaurants[i].meals.search(mealtype) >  -1) {
            list.push(data.restaurants[i]);
        }
    }
    return list;
}

function getRestaurantByName(restaurantName) {

    var restaurant = {};
    for (var i = 0; i < data.restaurants.length; i++) {

        if(data.restaurants[i].name == restaurantName) {
            restaurant = data.restaurants[i];
        }
    }
    return restaurant;
}

function getActivitiesByDistance(maxDistance) {

    var list = [];

    for (var i = 0; i < data.activities.length; i++) {

        if(parseInt(data.activities[i].distance) <= maxDistance) {
            list.push(data.activities[i]);
        }
    }
    return list;
}

function getWeather(callback) {
    var https = require('https');


    var req = https.request(myAPI, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            var channelObj = JSON.parse(returnData).query.results.channel;

            var localTime = channelObj.lastBuildDate.toString();
            localTime = localTime.substring(17, 25).trim();

            var currentTemp = channelObj.item.condition.temp;

            var currentCondition = channelObj.item.condition.text;

            callback(localTime, currentTemp, currentCondition);

        });

    });
    req.end();
}
function randomArrayElement(array) {
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
