//  Define variables of data for use in intents
var languageStrings = {
    'en': {
        'translation': {
            'WELCOME' : "Welcome to the Trumbull Connecticut Guide!",
            'HELP'    : "To find out more on Trumbull you can ask questions like, where to go for shopping, places to eat food, interesting trivia, recommend an activity, check the weather or more information.",
            'ABOUT'   : "Trumbull is a town in Fairfield County, Connecticut, bordered by the towns of Monroe, Shelton, Stratford, Bridgeport, Fairfield and Easton.",
            'STOP'    : "Thanks for asking about Trumbull, Bye!"
        }
    }
};

var data = {
    "city"        : "Trumbull",
    "state"       : "CT",
    "zip"         : "06611",
    "locations" : [
        { "name":"Franco Gianni's Pizza",
          "address":"8 Broadway Rd",
          "phone": "203-268-1616",
          "type": "food",
          "description": "Sumptuous Italian Cuisine and Glorious Pizzas from this family owned and operated restaurant.",
          "website": "http://francogiannistrumbull.com/"
        },
        { "name":"Plasko's Farm Creamery",
          "address":"670 Daniels Farm Rd",
          "phone": "203-268-2716",
          "type": "food",
          "description": "One of the oldest family owned farms located in Trumbull growing and selling seasonal produce, and plants. The plasko country store has an indoor bakery and ice cream bar.",
          "website": "http://plaskofarm.com/"
        },
        { "name":"Layla's Falafel",
          "address":"10 Broadway Rd",
          "phone": "203-590-3787",
          "type": "food",
          "description": "Offers authentic food from the middle east including off the grill meats, gourmet salads and side dishes.",
          "website" : "http://greenleafcafe.com/"
        },
        { "name":"Jennie's Pizzeria",
          "address":"380 Monroe Turnpike",
          "phone": "203-452-2435",
          "type": "food",
          "description": "Fairfield County’s oldest pizzeria offers great pizzas and pastas and a history spanning three generations."
        },
        { "name":"Bridgeport Brewport",
          "address":"225 South Frontage Road",
          "phone": " 203-612-4438",
          "type": "food, beer",
          "description": "A modern industrial brewpub offering craft beer, pizza and salads in a chill, spacious setting.",
          "city": "Bridgeport",
          "zip": "06604",
          "website": "https://brewportct.com/"
        },
        { "name":"Two Roads Brewery",
          "address":"225 South Frontage Road",
          "phone": " 203-612-4438",
          "type": "food, beer",
          "description": "Here's to taking the road less traveled, in life and in beer!",
          "city": "Stratford",
          "zip": "06615",
          "website": "https://tworoadsbrewing.com/"
        },
        { "name":"Veracious Brewing",
          "address":"246 Main St", "phone":
          "203-880-5670",
          "type": "beer",
          "description": "Try a wide range of local craft beers on tap.  Open Thursdays, Fridays and Saturdays.",
          "city": "Monroe",
          "zip" : "06468",
          "website": "http://www.veraciousbrewing.com/"
        },
        { "name":"Trumbull Mall",
          "address":"5065 Main St",
          "phone": "203-372-4500",
          "type": "shopping",
          "description": "This Westfield mall has over 150 stores including brand names Macy's, Target, Lord and Taylor and Panera Bread."
        },
        { "name":"Hawley Lane Mall",
          "address":"120 Hawley Lane",
          "phone": "203-375-9298",
          "type": "shopping",
          "description": "Hawley Lane is a enclosed community center shopping mall with around 18 stores including Best Buy, HomeGoods, Kohl's, and Target.",
          "website": "http://www.nrdc.com/"
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
            "name": "The Adventure Park at the Discovery Museum",
            "description": "The best climbing bridges and zip line in Connecticut",
            "distance": "10"
        },
        {
            "name": "Beardsley Zoo",
            "description": "Visit this top Connecticut attraction and learn about many endangered and threatened species.",
            "distance": "10"
        }
    ],
    "trivia":[
        "Trumbulls sister city is Xinyi, in China's Jiangsu Province.",
        "The National Little League of Trumbull were the 1989 Little League World Series champions.",
        "The Trumbull High School Marching Band are the 2016 National Champions.",
        "Trumbull is one of two locations in the state recognizing the Golden Hill Paugussett Indian Nation, descendants of the historic people who held this area in the colonial era.",
        "Trumbull has the most recreational and open space per capita in the state of Connecticut."
    ]
};

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
        var location = randomArrayElement(getLocationsByType('food'));
        this.attributes['location'] = location.name;

        var say = 'Enjoy food at, ' + location.name + ',' + location.description +
                  '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'BeerIntent': function () {
        var location = randomArrayElement(getLocationsByType('beer'));
        this.attributes['location'] = location.name;

        var say = 'Enjoy a great beer at, ' + location.name + ',' + location.description + 
                  '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'ShoppingIntent': function () {
        var location = randomArrayElement(getLocationsByType('shopping'));
        this.attributes['location'] = location.name;

        var say = 'Try shopping at, ' + location.name + ',' + location.description + 
                  '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'AMAZON.YesIntent': function () {
        var locationName = this.attributes['location'];
        var location = getLocationsByName(locationName);

        var city = data.city;
        if (location.city)
          city = location.city;

        var say = location.name
            + ' is located at ' + location.address + ',' + city
            + ', the phone number is ' + location.phone + ','
            + 'I have sent these details to the Alexa App on your phone. ';

        var state = data.state;
        if (location.state)
          state = location.state;

        var zip = data.zip;
        if (location.zip)
          zip = location.zip;

        var card = location.name + '\n' + location.address + '\n'
            + city + ', ' + state + ' ' + zip
            + '\nphone: ' + location.phone + '\n';
        if (location.website)
            card += '\nwebsite: ' + location.website + '\n';

        this.emit(':tellWithCard', say, location.name, card);
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

    'TriviaIntent': function () {

        var trivia = randomArrayElement(data.trivia);
        this.emit(':tell', trivia);
    },

    'WeatherIntent': function () {

        getWeather( ( localTime, currentTemp, currentCondition) => {
            // time format 10:34 PM
            // currentTemp 72
            // currentCondition, e.g.  Sunny, Breezy, Thunderstorms, Showers, Rain, Partly Cloudy, Mostly Cloudy, Mostly Sunny

            // sample API URL for Irvine, CA
            // https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22irvine%2C%20ca%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys
            celsius = String(parseInt((parseInt(currentTemp) - 32) * 5/9));
            this.emit(':tell', 'It is ' + currentCondition
                + ' at ' + localTime
                + ' in ' + data.city
                + ' with the weather at  '
                + currentTemp + ' fahrenheit, that is '
                + celsius + ' celsius' );
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

function getLocationsByType(locationType) {

    var list = [];
    for (var i = 0; i < data.locations.length; i++) {
        if(data.locations[i].type.search(locationType) >  -1) {
            list.push(data.locations[i]);
        }
    }
    return list;
}

function getLocationsByName(locationName) {

    for (var i = 0; i < data.locations.length; i++) {
        if(data.locations[i].name == locationName) {
            return data.locations[i];
        }
    }
    return {};
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
