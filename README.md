# QMATIC Mobile Ticket
Qmatic mobile ticket solution is intended to issue e-tickets to the customers who are willing to go through the queue management solution by QMATIC. 
This is a web application that has been developed using Angular4 and the development environment of the project uses Angular-cli tools 
(https://github.com/angular/angular-cli).

## Prerequisites
* Angular/cli tools requires Node.js 8, or higher, together with NPM 3, or higher.
* API Gateway version 1.3.2.0 or higher required. Download from Qmatic portal.
* Supported Orchestra Versions
  * Orchestra 6.1 build 3.1.0.646 or later
  * Orchestra 6.2 build 3.2.0.289 or later

## Table of contents
- [Installation](#installation)
- [Setting up api gateway](#setting-up-api-gateway)
- [Proxy to Backend](#proxy-to-backend)
- [Running Unit Tests](#running-unit-tests)
- [Mobileticket.js library](#mobileticketjs-library)
- [Creating a Build](#creating-a-build)
- [Branding & Customization](#branding--customization)

## Installation
BEFORE YOU INSTALL: please read the [prerequisites](#prerequisites)

Clone the Mobile Ticket Solution
```
git clone https://github.com/qmatic/mobile-ticket.git
```
When the cloning is complete, install the required node modules by running the following command from the project directory
```
npm install
```
We recommend Visual Studio Code (https://code.visualstudio.com/) as the IDE since it fits well with angular-cli tools. The original project is developed on visual code IDE.

NOTE: Earlier globally installed angular cli tools were necessary to run the project but it is no longer necessary.

## Setting up api gateway
Mobile ticket application uses Qmatic API gateway service as a proxy to talk to Orchestra. You have to download and install Qmatic API gate way service from [here](https://m01-qmaticworld.portal.qmatic.com/en/products/software/orchestra/api-gateway/software/#tabs).
Create a mobile user and generate a token by referring [API gateway manual](https://m01-qmaticworld.portal.qmatic.com/Documents/Qmatic%20World/Products/Software/Mobile%20Ticket/Manuals/224_03_F_MobileTicket.pdf). Copy the generated token to 'api_tokens' section in [service root folder]/conf/application.yml file.

It is required to change the API accesss token specified in the [project-root]/src/libs/js/mobileticket-{version}.js with the one you have generated as shown in the code snippet below. This is necessary only for the development, 
but in the production environment the auth token is read from the config file. So please refer to [Configuring the Proxy for Production Environment](#configuring-the-proxy-for-production-environment) to get more information 
on setting up auth-token for the production environment.

```js
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("auth-token", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"); // replace with your auth-token
    }
  });
```

## Proxy to Backend

Mobile Ticket solution is intended to work with QMATIC API Gateway service, which provides anonymous access to Orchestra REST API. The Mobile Ticket solution
is required to be hosted separately and all the REST API calls are proxied to avoid cross domain access violations. 
The current implementation is intended to be hosted on node.js and proxying is provided via express-http-proxy (https://www.npmjs.com/package/express-http-proxy).

#### Configuring the Proxy for Development Environment

Edit proxy-config.json and set target to the IP and port of the QMATIC API Gateway service

File location
```html
project directory
|---proxy.config.json
```

```js
{
  "/MobileTicket/*": {
    "target": "http://192.168.1.35:9090",
    "secure": false
  },
  "/geo/*": {
    "target": "http://192.168.1.35:9090",
    "secure": false
  }
}
```

If the API gateway is configures to use HTTPS the "target" parameters should indicate the protocol as "https".

If the certificate configured in API gateway has certificate errors or if it is a self signed certificate and still need the REST API calls to work with no issue, the setting "secure"
should be set to false. Having "secure" set to true will validate the certificate and REST calls will be failed if the certificate is not valid. The configurations for an API gateway configured
with a valid certificate will be as below.

```js
{
  "/MobileTicket/*": {
    "target": "https://192.168.1.35:9090",
    "secure": true
  },
  "/geo/*": {
    "target": "https://192.168.1.35:9090",
    "secure": true
  }
}
```

Once the configuration is done you are ready to start the development server. You can open a console window in visual code and run npm start,
if you use visual code as the IDE. Otherwise just run this command on any console (bash, windows cli etc). Make sure you are in project root directory when running the command.
```
npm start
```
NOTE : npm start will run the command configured for "start" in package.json
```js
"scripts": {
    "start": "ng serve --proxy-config proxy.config.json",
    "lint": "tslint \"src/**/*.ts\"",
    "test": "ng test",
    "pree2e": "webdriver-manager update",
    "e2e": "protractor"
  }
```

#### Configuring the Proxy for Production Environment

Once the solution is built, the output folder structure contains the configuration file by the name proxy-config.json. Set the IP and port of QMATIC API Gateway service
to "value" in "apigw_ip_port". Then set a valid auth token to "value" in "auth_token".

If the API gateway is configured to use HTTPS the setting "gateway_has_certificate" must be set to true. 

If the certificate configured in API gateway has certificate errors or if it is a self signed certificate and still need the REST API calls to work with no issue, the setting "gateway_certificate_is_valid"
should be set to false. Having "gateway_certificate_is_valid" set to true will validate the certificate and REST calls will be failed if the certificate is not valid.

NOTE: WE DO NOT ENCOURAGE USING SELF SIGNED CERTIFICATES OR CERTIFICATES WITH ERRORS TO BE USED IN PRODUCTION ENVIRONMENT. THEREFORE WE RECOMMENT TO KEEP BOTH "gateway_has_certificate" and
"gateway_certificate_is_valid" SETTINGS TO SET TO true IN PRODUCTION ENVIRONMENT. 

File location
```html
project directory
|---dist
      |--- proxy-config.json
```

```js
{
    "apigw_ip_port": {
        "value": "10.2.3.88:9090",
        "description": "API Gateway - host address"
    },
    "local_webserver_port": {
        "value": "81",
        "description": "Local webserver port"
    },
    "auth_token": {
        "value": "nosecrets",
        "description": "Mobile API user - authentication token"
    },
    "local_webserver_ssl_port": {
        "value": "4443",
        "description": "Local webserver HTTPS port"
    },
    "support_ssl": {
        "value": "true",
        "description": "Flag indicating server supports SSL.Should have a valid public key and certificate in 'sslcert' folder "
    },
    "gateway_has_certificate": {
        "value": "true",
        "description": "Flag indicating the API gateway is configured to run on HTTPS"
    },
    "gateway_certificate_is_valid": {
        "value": "true",
        "description": "Flag indicating the configured SSL certificate in the API gateway is a valid. This setting is active only if 'gateway_has_certificate' is true. This must be set to 'false' if API gateway is configured with a self signed certificate "
    }
}
```
#### Changing the default configurations of the application in  Development/Production Environment
Application configuration file called 'config.json' contains the application specific parameters.

File location
```html
project directory
|---src
     |---app
           |---config
                  |---config.json
```

```js
{
    "branch_radius": {
        "value": "2147483647",
        "description": "Radius to include branches within (in meters)"
    },
    "version": {
        "value": "1.0.0.2",
        "description": "MobileTicket version"
    },
    "customer_feedback": {
        "value": "",
        "description": "URL to redirect to when visit is ended."
    },
    "ga_track_id": {
        "value":"",
        "description": "Google Analytic Track-ID"
    },
    "notification_sound": {
        "value":"notification.mp3",
        "description": "Sound file use for notification"
    },
    "service_fetch_interval":{
        "value":"15",
        "description": "The interval (in seconds) at which service information is refreshed periodically"
    },
     "service_screen_timeout":{
        "value":"10",
        "description": "The time duration (in minutes) which the app will stay in services screen without creating a ticket"
    },
    ,
    "branch_open_hours":{
        "value" : [     
           { "translation_key":"open_hours.week_day2", "from":"8:00", "to": "18:00" ,"description":"monday", "display_from":"8:00", 	"display_to": "18:00", "show":"true" } ,
           { "translation_key":"open_hours.week_day3", "from":"8:00", "to": "18:00" ,"description":"tuesday", "display_from":"8:00", 	"display_to": "18:00", "show":"true" } ,
           { "translation_key":"open_hours.week_day4", "from":"8:00", "to": "18:00" ,"description":"wednesday", "display_from":"8:00", "display_to": "18:00", "show":"true" } ,
           { "translation_key":"open_hours.week_day5", "from":"8:00", "to": "18:00" ,"description":"thursday", "display_from":"8:00", 	"display_to": "18:00", "show":"true" } ,
           { "translation_key":"open_hours.week_day6", "from":"8:00", "to": "18:00" ,"description":"friday", "display_from":"8:00", 	"display_to": "18:00", "show":"true" } ,
           { "translation_key":"open_hours.week_day7", "from":"8:00", "to": "18:00" ,"description":"saturday", "display_from":"8:00", 	"display_to": "18:00", "show":"true" } ,
           { "translation_key":"open_hours.week_day1", "from":"8:00", "to": "18:00" ,"description":"sunday", "display_from":"8:00", 	"display_to": "18:00", "show":"true" } 
        ],
        "description": "Open hours of all branches in general"
    }
}
```
#### Configuring the branch open hours

Branch open hours configuration consists of entries representing seven days starting from Monday to Sunday. Given and item contains following attributes

translation_key - In general this contains the corresponding translation key of the entry

from - The actual branch opening time against which access time is validated

to - The actual branch closing time against which access time is validated

display_from - The branch opening time which will be shown in the open hours message

display_to - The branch closing time which will be shown in the open hours message

show - Setting this to false make the entry disappear from the open hours message

description - This is for internal references and SHOULD NOT BE CHANGED 

NOTE: If the branch is closed on any particular day, please make "from","to","display_from" and "display_to" values empty.

E.g. If the branches are closed on Sunday

```JSON

 { "translation_key":"open_hours.week_day1", "from":"", "to": "" ,"description":"sunday", "display_from":"", 				"display_to": "", "show":"true" } 
 
```

In order to change the branch open hours message headings and day name please look for the section "open_hours" in the relevant translations file

E.g. Branch open hours message translations in the English translations file

```js
    "open_hours" : {
      "heading1" : "This service is currently not available.",
      "heading2" : "Our opening hours are:" ,
      "week_day1" : "Sunday",
      "week_day2" : "Monday",
      "week_day3" : "Tuesday",
      "week_day4" : "Wednesday",
      "week_day5" : "Thursday",
      "week_day6" : "Friday",
      "week_day7" : "Saturday",
      "closed" : "Closed"
   }
```

NOTE : Branch open hours validation functionality is implemented assuming all the branches are in same timezone

#### Configuring the Proxy for Production Environment with HTTPS

First, it is required to install openssl and once the solution is built the output folder structure will contain a folder by the name 'sslcert' which contains 
a bash script by the name create_cert.sh. After the installation of openssl, make sure you create an environment variable by the name OPENSSL_CONF and put the
path to the openssl config file (e.g. C:\OpenSSL\bin\openssl.cnf ). Then, by running the create_cert.sh file on shell you will be able to create a self-signed certificate and a public key.
Next, it is required that you edit the proxy-config.json and enable ssl by setting the value of 'support_ssl' to true. Now, by running 'npm start', you will run 
another server instance on port 4443 that is accessible via https in addition to the instance that is accessible via https, in addition to the instance that is accessible via http. The port for HTTPS is specified
in local_webserver_ssl_port value and can be changed.

NOTE: Any valid certificate and a public key from a valid certificate authority should work and it is required that the certificate is called 'server.crt'
      and the public key is called 'server.key'. The MobileTicket solution should run on HTTPS, in order to get location awareness, in the case of branch listing.
      Otherwise, it will list all the branches instead of nearby branches.
      
Also, we have already included a valid ssl certificate and should only be used for development purposes. Please do not use this in a production environment.

## Running Unit Tests

```
npm test
```

```
ng test
```
For visual code IDE, open up a console window inside the IDE and run either npm start or ng test. This will run all 
the unit tests and from there onwards the unit test will be auto-run on the console window whenever the changes are saved.
In general, these commands can be run on any console window (bash, windows cli etc) 

## Mobileticket.js library

Mobileticket.js library facilitates the communication functionality. This contains an API that covers all the Mobile Ticket related
REST API calls to QMATIC API Gateway service. This library file is fully independent and can be hosted separately.

#### MobileTicketAPI

Initializes the library
```js
MobileTicketAPI.init()
```

Fetch a list of branches that match the distance from current location criteria.

latitude - Latitude of current location.

longitude - Longitude of current location.

radius - The radius of the circular area within which the branches are expected to be available.

onSuccess - Success callback.

onError - Error callback.
```js
MobileTicketAPI.getBranchesNearBy(latitude, longitude, radius, onSuccess, onError)

//-----OUTPUT------

[
  {
          "id": 1,
          "name": "Branch 1",
          "addressLine1": "3964 Prospect Valley Road",
          "addressLine2": null,
          "addressLine3": null,
          "addressLine4": "Los Angeles",
          "addressLine5": "America",
          "addressPostalCode": "13221",
          "timeZone": "Asia/Colombo",
          "longitude": 80.23504011009095,
          "latitude": 7.369534778043114,
          "openTime": "00:00",
          "closeTime": "00:00",
          "suggestedTime": 0,
          "message": "",
          "estimatedWaitTime": 0,
          "branchOpen": false,
          "queuePassesClosingTime": false,
          "longitudeE6": 80235040,
          "latitudeE6": 7369534
      },
      {
          "id": 4,
          "name": "Branch 3",
          "addressLine1": "3964 Prospect Valley Road",
          "addressLine2": null,
          "addressLine3": null,
          "addressLine4": "Gothenburg",
          "addressLine5": "Sweden",
          "addressPostalCode": "123323",
          "timeZone": "Asia/Colombo",
          "longitude": 12.130902484318367,
          "latitude": 57.62392981244282,
          "openTime": "00:00",
          "closeTime": "00:00",
          "suggestedTime": 0,
          "message": "",
          "estimatedWaitTime": 0,
          "branchOpen": false,
          "queuePassesClosingTime": false,
          "longitudeE6": 12130902,
          "latitudeE6": 57623929
      }
]
```


Fetch all the branches that are available.

onSuccess - Success callback.

onError - Error callback.
```js
MobileTicketAPI.getAllBranches(onSuccess, onError)

//-----OUTPUT------

[
  {
          "id": 1,
          "name": "Branch 1",
          "addressLine1": "3964 Prospect Valley Road",
          "addressLine2": null,
          "addressLine3": null,
          "addressLine4": "Los Angeles",
          "addressLine5": "America",
          "addressPostalCode": "13221",
          "timeZone": "Asia/Colombo",
          "longitude": 80.23504011009095,
          "latitude": 7.369534778043114,
          "openTime": "00:00",
          "closeTime": "00:00",
          "suggestedTime": 0,
          "message": "",
          "estimatedWaitTime": 0,
          "branchOpen": false,
          "queuePassesClosingTime": false,
          "longitudeE6": 80235040,
          "latitudeE6": 7369534
      },
      {
          "id": 4,
          "name": "Branch 3",
          "addressLine1": "3964 Prospect Valley Road",
          "addressLine2": null,
          "addressLine3": null,
          "addressLine4": "Gothenburg",
          "addressLine5": "Sweden",
          "addressPostalCode": "123323",
          "timeZone": "Asia/Colombo",
          "longitude": 12.130902484318367,
          "latitude": 57.62392981244282,
          "openTime": "00:00",
          "closeTime": "00:00",
          "suggestedTime": 0,
          "message": "",
          "estimatedWaitTime": 0,
          "branchOpen": false,
          "queuePassesClosingTime": false,
          "longitudeE6": 12130902,
          "latitudeE6": 57623929
      },
      {
          "id": 5,
          "name": "Branch 4",
          "addressLine1": "22A, Del Place",
          "addressLine2": null,
          "addressLine3": null,
          "addressLine4": "Colombo",
          "addressLine5": "Srilankan",
          "addressPostalCode": "122321",
          "timeZone": "Asia/Colombo",
          "longitude": 12.017959999999979,
          "latitude": 57.637160000000094,
          "openTime": "00:00",
          "closeTime": "00:00",
          "suggestedTime": 0,
          "message": "",
          "estimatedWaitTime": 0,
          "branchOpen": false,
          "queuePassesClosingTime": false,
          "longitudeE6": 12017959,
          "latitudeE6": 57637160
      }
]
```

Fetch branch information for the given branch id. 

onSuccess - Success callback.

onError - Error callback.
```js
MobileTicketAPI.getBranchInfoById(id, onSuccess, onError) 

//-----OUTPUT------

{
	"estimatedWaitTime": 0,
	"id": 1,
	"name": "Branch 1",
	"addressLine4": "Colombo",
	"addressLine5": "Srilanka",
	"timeZone": "Asia/Colombo",
	"longitude": 79.85061831798424,
	"latitude": 6.914182533120211,
	"openTime": "00:00",
	"closeTime": "00:00",
	"branchOpen": true,
	"queuePassesClosingTime": false,
	"longitudeE6": 79850618,
	"latitudeE6": 6914182
}
```

Fetch all services for the selected branch.
NOTE: Branch selection will be cached inside the library, so here it gives the services for the so-called cached branch.

onSuccess - Success callback.

onError - Error callback.
```js
MobileTicketAPI.getServices(onSuccess, onError) 

//-----OUTPUT------

[
  {
    "customersWaitingInDefaultQueue": 5,
    "waitingTimeInDefaultQueue": 0,
    "serviceId": 1,
    "serviceName": "Service 1",
    "description": ""
  },
  {
    "customersWaitingInDefaultQueue": 3,
    "waitingTimeInDefaultQueue": 0,
    "serviceId": 2,
    "serviceName": "Service 2",
    "description": ""
  },
  {
    "customersWaitingInDefaultQueue": 0,
    "waitingTimeInDefaultQueue": 0,
    "serviceId": 3,
    "serviceName": "Service 3",
    "description": ""
  }

]
```


Creates a ticket for a selected service at the selected branch.

NOTE: Branch selection and service selection will be cached inside the library.

clientId - clientId assigned by Google Analytics.

onSuccess - Success callback.

onError - Error callback.
```js
MobileTicketAPI.createVisit(onSuccess, onError)

//-----OUTPUT------

{
  "clientId": "XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX",
  "serviceId": 1,
  "branchId": 2,
  "queueId": 1,
  "ticketNumber": "A017",
  "visitId": 640
}
```


Fetch the visit status of a created visit.

onSuccess - Success callback.

onError - Error callback.

```js
MobileTicketAPI.getVisitStatus(onSuccess, onError)

//-----OUTPUT------

{
  "queueName": "Queue 1",
  "status": "VISIT_CREATE",
  "visitPosition": 18,
  "waitingVisits": 18
}
```
Cancel the current visit.

onSuccess - Success callback.

onError - Error callback.
```js
MobileTicketAPI.cancelVisit(onSuccess, onError)

//-----OUTPUT------

//output
```

```js
MobileTicketAPI.setVisit(branchId, queueId, visitId, checksum)
```
Set the branch selection.
```js
MobileTicketAPI.setBranchSelection(branch)
```
Set the service selection.
```js
MobileTicketAPI.setServiceSelection(service)
```
Fetch the branch set via MobileTicketAPI.setBranchSelection(branch)
```js
MobileTicketAPI.getSelectedBranch()
```
Fetch the branch set via MobileTicketAPI.setServiceSelection(service)
```js
MobileTicketAPI.getSelectedService()
```
Fetch the currently created visit
```js
MobileTicketAPI.getCurrentVisit()
```

```js
MobileTicketAPI.getCurrentVisitEvent()
```
     
## Creating a Build
Install grunt command line interpreter by running following command.
```
npm install -g grunt

```

Run grunt help to list build commands.
```
grunt help
Running "help" task
Available commands

Command - grunt

Following flags are supported

         build_production - Build project files and copy them to 'dist' folder

         build_development - Build project files and copy them to 'dist' folder
without minification.


Done, without errors.

```
For production build version
```
grunt build_production
```
For development build version
```
grunt build_development
```

## Branding & Customization

Customizations can be done on the fly, after building your application ([Creating a Build] ()).

In your build, open and edit src/app/theme/theme-styles.css file.

Css selector                                  |   Css property | Description   | Example(Default Styles)
------------                                  |   ------------ | ------------- | -------------
```.custom.text-color            ```           |     color      | Edit to change font color |  #FFFFFF !important;
```.custom.btn-text-color         ```           |   color   | Edit to change font color of the accent buttons  |  #FFFFFF !important;
```.custom.accent-bg-color       ```           |   background   | Edit to change accent color of buttons |  #A9023A !important;
```.custom.accent-tick-color.tick```           |     stroke     | Edit to change accent color of tick mark |  #A9023A !important;
```.custom.bg-image              ```           |   background   | Edit to change app background |  url('../../app/resources/background.jpg') !important;
```.custom.logo-image            ```           |    content     | Edit to change app logo  |  url('../../app/resources/qmLogo.png') !important;
```.custom.logo-bg-color         ```           |   background   | Edit to change app logo  |  transparent !important;

Note:

* If you are specifying styles in this stylesheet, it will override the default styles.
* If you want to add a new logo or background image, make sure to include the images in the src/app/resources folder and refer it from the theme-styles sheet as shown in the above table.
* If you do not want to customize your application, remove this file from the build. In this case, the application will load with the default styles.
