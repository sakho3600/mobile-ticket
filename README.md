# QMATIC Mobile Ticket
Qmatic mobile ticket solution is intended to issue e-tickets to the customers who are willing to go through the queue management solution by QMATIC. 
This is a web application that has been developed using Angular2 and the development environment of the project uses Angular-cli tools 
(https://github.com/angular/angular-cli).

<a name="prerequisites">
## Prerequisite
Angular-cli tools requires Node.js 4, or higher, together with NPM 3, or higher.
## Table of contents
- [Installation] (#installation)
- [Setting up auth-token] (#authtoken)
- [Proxy to Backend] (#proxy)
- [Running Unit Tests] (#unittest)
- [Mobileticket.js library] (#mobileticketlib)
- [Creating a Build] (#build)
- [Branding & Customization] (#branding)
- [Supported Orchestra Versions] (#orchestraversions)

<a name="installation"/>
## Installation
BEFORE YOU INSTALL: please read the [prerequisites] (#prerequisites)

Install angular-cli tools via npm
```
npm install -g angular-cli@1.0.0-beta.21
```
Clone the Mobile Ticket Solution
```
git clone https://github.com/qmatic/mobile-ticket.git
```
When the cloning is complete, install the required node modules by running the following command from the project directory
```
npm install
```
We recommend Visual Studio Code (https://code.visualstudio.com/) as the IDE since it fits well with angular-cli tools. The original project is developed on visual code IDE.
<a name="authtoken"/>
## Setting up auth-token

It is required to change the auth token specified in the mobileticket-[version].js with the one you have generated as shown in the code snippet below. 

File location
```html
project directory
|---src
     |---libs
	      |---js
		       |--- mobileticket-[version].js
```

This is necessary only for the development,but in the production environment the auth token is read from the config file. So please refer to
 [Configuring the Proxy for Production Environment] (#proxyproduction) to get more information 
on setting up auth-token for the production environment.

```js
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("auth-token", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"); // replace with your auth-token
    }
  });
```
<a name="proxy"/>
## Proxy to Back end

Mobile Ticket solution is intended to work with QMATIC API Gateway service, which provides anonymous access to Orchestra REST API. The Mobile Ticket solution
is required to be hosted separately and all the REST API calls are proxied to avoid cross domain access violations. 
The current implementation is intended to be hosted on node.js and proxying is provided via express-http-proxy (https://www.npmjs.com/package/express-http-proxy).

###### Configuring the Proxy for Development Environment

Edit proxy-config.json and set target to the IP and port of the QMATIC API Gateway service

File location
```html
project directory
|---proxy-config.json
```

```js
{
  "/MobileTicket/*": {
    "target": "http://192.168.1.35:9090",
    "secure": false
  }
}
```
Once the configuration is done you are ready to start the development server. You can open a console window in visual code and run npm start,
if you use visual code as the IDE. Otherwise just run this command on any console (bash, windows cli etc).
```
npm start
```
NOTE : npm start will run the command configured for "start" in package.json
```js
"scripts": {
    "start": "ng serve --proxy-config proxy-config.json",
    "lint": "tslint \"src/**/*.ts\"",
    "test": "ng test",
    "pree2e": "webdriver-manager update",
    "e2e": "protractor"
  }
```

As an alternative, ng serve command also can be used with proxy configuration
```
ng serve --proxy-config proxy.conf.json
```
<a name="proxyproduction">
###### Configuring the Proxy for Production Environment

Once the solution is built, the output folder structure contains the configuration file by the name proxy-config.json. Set the IP and port of QMATIC API Gateway service
to "value" in "apigw_ip_port". Then set a valid auth token to "value" in "auth_token".

File location
```html
project directory
|---dist
      |--- proxy-config.json
```

```js
{
 "apigw_ip_port" : {
     "value" : "192.168.0.1:9090",
     "description" : "API Gateway - host address"
      },
 "local_webserver_port" : {
     "value" : "80",
     "description" : "Local webserver port"
     },
 "auth_token" : {
     "value" : "nosecrets", 
     "description" : "Mobile API user - authentication token"
     },
 "local_webserver_ssl_port": {
        "value": "4443",
        "description": "Local webserver HTTPS port"
    },
 "support_ssl": {
        "value": "false",
        "description": "Flag indicating server supports SSL.Should have a valid public key and certificate in 'sslcert' folder "
    }
}
```
###### Changing the default configurations of the application in  Development/Production Environment
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
    "ga_track_id": {
        "value":"",
        "description": "Google Analytic Track-ID"
    },
    "notification_sound": {
        "value":"notification.mp3",
        "description": "Sound file use for notification"
    }
}
```

###### Configuring the Proxy for Production Environment with HTTPS

First, it is required to install openssl and once the solution is built the output folder structure will contain a folder by the name 'sslcert' which contains 
a bash script by the name create_cert.sh. After the installation of openssl, make sure you create an environment variable by the name OPENSSL_CONF and put the
path to the openssl config file (e.g. C:\OpenSSL\bin\openssl.cnf ). Then, by running the create_cert.sh file on shell you will be able to create a self-signed certificate and a public key.
Next, it is required that you edit the proxy-config.json and enable ssl by setting the value of 'support_ssl' to true. Now, by running 'node server.js', you will run 
another server instance on port 4443 that is accessible via https in addition to the instance that is accessible via https, in addition to the instance that is accessible via http. The port for HTTPS is specified
in local_webserver_ssl_port value and can be changed.

NOTE: Any valid certificate and a public key from a valid certificate authority should work and it is required that the certificate is called 'server.crt'
      and the public key is called 'server.key'. The MobileTicket solution should run on HTTPS, in order to get location awareness, in the case of branch listing.
      Otherwise, it will list all the branches instead of nearby branches.
      
Also, we have already included a valid ssl certificate and should only be used for development purposes. Please do not use this in a production environment.
<a name="unittest"/>
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
<a name="mobileticketlib">
## Mobileticket.js library

Mobileticket.js library facilitates the communication functionality. This contains an API that covers all the Mobile Ticket related
REST API calls to QMATIC API Gateway service. This library file is fully independent and can be hosted separately.

###### MobileTicketAPI

Initializes the library
```js
MobileTicketAPI.init()
```


Fetch branch information for the provided branchId.

onSuccess - Success callback.

onError - Error callback.
```js
MobileTicketAPI.getBranchInformation(branchId, onSuccess, onError)

//-----OUTPUT------

{
  "id": 2,
  "name": "Branch1",
  "description": "",
  "enabled": true,
  "timeZone": "+0500",
  "timeZoneID": "Asia/Colombo",
  "openingHour": null,
  "closingHour": null,
  "branchParameters": [
    {
      "key": "label.address1",
      "value": null
    },
    {
      "key": "label.postcode",
      "value": null
    },
    {
      "key": "label.longitude",
      "value": "80.1014323"
    },
    {
      "key": "label.address3",
      "value": null
    },
    {
      "key": "label.city",
      "value": null
    },
    {
      "key": "label.latitude",
      "value": "6.1395323"
    },
    {
      "key": "label.country",
      "value": null
    },
    {
      "key": "label.reset.time",
      "value": null
    },
    {
      "key": "label.address2",
      "value": null
    }
  ]
}
```


Fetch Queue information for the provided queueId.

onSuccess - Success callback.

onError - Error callback.
```js
MobileTicketAPI.getQueueInformation(serviceId, onSuccess, onError)

//-----OUTPUT------

{
  "id": 1,
  "name": "Queue 1",
  "queueType": "QUEUE",
  "customersWaiting": 16,
  "waitingTime": 1349632
}
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
    "estimatedWaitTime": 0,
    "id": 2,
    "name": "Branch1",
    "timeZone": "Asia/Colombo",
    "longitude": 80.1014323,
    "latitude": 6.1395323,
    "openTime": "00:00",
    "closeTime": "00:00",
    "branchOpen": false,
    "queuePassesClosingTime": false,
    "longitudeE6": 80101432,
    "latitudeE6": 6139532
  },
  {
    "estimatedWaitTime": 0,
    "id": 1,
    "name": "Branch2",
    "timeZone": "Asia/Colombo",
    "longitude": 80.21498031940114,
    "latitude": 6.036690846085517,
    "openTime": "00:00",
    "closeTime": "00:00",
    "branchOpen": false,
    "queuePassesClosingTime": false,
    "longitudeE6": 80214980,
    "latitudeE6": 6036690
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
    "estimatedWaitTime": 0,
    "id": 2,
    "name": "Branch1",
    "timeZone": "Asia/Colombo",
    "longitude": 80.1014323,
    "latitude": 6.1395323,
    "openTime": "00:00",
    "closeTime": "00:00",
    "branchOpen": false,
    "queuePassesClosingTime": false,
    "longitudeE6": 80101432,
    "latitudeE6": 6139532
  },
  {
    "estimatedWaitTime": 0,
    "id": 1,
    "name": "Branch2",
    "timeZone": "Asia/Colombo",
    "longitude": 80.21498031940114,
    "latitude": 6.036690846085517,
    "openTime": "00:00",
    "closeTime": "00:00",
    "branchOpen": false,
    "queuePassesClosingTime": false,
    "longitudeE6": 80214980,
    "latitudeE6": 6036690
  },
  {
    "estimatedWaitTime": 0,
    "id": 1,
    "name": "Branch3",
    "timeZone": "Asia/Colombo",
    "longitude": 56.21498031940114,
    "latitude": 3.036690846085517,
    "openTime": "00:00",
    "closeTime": "00:00",
    "branchOpen": false,
    "queuePassesClosingTime": false,
    "longitudeE6": 80214980,
    "latitudeE6": 6036690
  }
]
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
    "estimatedWait": 0,
    "waitingTime": 0,
    "name": "Service 1",
    "id": 1
  },
  {
    "estimatedWait": 0,
    "waitingTime": 0,
    "name": "Service 2",
    "id": 2
  },
  {
    "estimatedWait": 0,
    "waitingTime": 0,
    "name": "Service 3",
    "id": 3
  }
]
```


Creates a ticket for a selected service at the selected branch.

NOTE: Branch selection and service selection will be cached inside the library.

clientId - clientId assigned by Google Analytics.

onSuccess - Success callback.

onError - Error callback.
```js
MobileTicketAPI.createVisit(clientId, onSuccess, onError)

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
Fetch the queue status of a created visit.

onSuccess - Success callback.

onError - Error callback.

```js
MobileTicketAPI.getQueueStatus(onSuccess, onError) 

//-----OUTPUT------

//output
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
<a name="build">      
##Creating a Build
BEFORE YOU BUILD: Run setup_grunt.sh to install required npm grunt modules for the build process.

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
<a name="branding">
##Branding & Customization

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
<a name="orchestraversions">
##Supported Orchestra Versions

* Orchestra 6.0: Version HF22 (not yet released)
* Orchestra 6.1: Version HF 4 (not yet released)


