# AULA Diabetes

# Table of Contents
1. [Application Summary](#application-summary)
2. [Blueprints & Code Packages](#blueprint-and-code-packages)
3. [Installation](#installation)
4. [Configuration](#configuration)
	* [Authentication](#authentication)
	* [Content Management System Configuration](#content-management-system-configuration)
	* [Heroku App URLs](#heroku-app-urls)
	* [Cookie Banner Details](#cookie-banner-details)
	* [Analytics](#analytics)
	* [Search](#search)
	* [Active Directory](#active-directory-name)
	* [Janrain Configuration](#janrain-configuration)
	* [Folder Structure](#folder-structure)
5. [Additional Functionality](#additional-functionality)
6. [Testing](#testing)
7. [Notes](#notes)

<a name="application-summary"></a>
## Application Summary

**Application Name:** AULA Diabetes

**Prefix (short name):** BUIT_EUCAN

**Author:** Indegene Team

**Support Team:** Osiris TCS Support

**Therapy Area:** Diabetes

**Service Now CI:** CI00000000346062

**Application Description:** The purpose of this website is to provide the Spanish HCP's with an educational platform.

**Country(s):** Spain

<a name="blueprint-and-code-packages"></a>
## Blueprint and Code Packages

**Blueprint:** Web Application

	Development Language(s): Node.js, React.js
	Development Framework(s):
	Development Add-Ons: Redis, PaperTrail, New Relic, Postgres SQL, Sendgrid
	Development Standards:  esLint
	Content Management System: 
	Analytics:** Google Analytics
	Tag Management Tool: Google Tag Manager
	Customer Authentication: Janrain

**Code Package(s):**

	CIRR_WEB_ACCELERATOR

<a name="installation"></a>
## Installation:

1. Clone the repository by command 'git clone https://github.com/EliLillyCo/BUIT_EUCAN_AULA_ES_DIABETES.git'

2. Install node and npm in your local system, if not already installed. [Please visit Node.js home page to download and install Node.js](http://nodejs.org/download/)

3. Rename .env-sample file with .env

4. Update .env file with the desired environment variables.

5. Run npm install from the project root to install required node modules.

6. Install Gulp's command line interface (CLI) globally. if not already installed. [Please visit gulp home page to download and install Gulp CLI](http://gulpjs.com/). You can also use command npm install -g grunt-cli

7. Run the application by command 'npm start'

8. The application will be available on localhost:8080

<a name="configuration"></a>
## Configuration

<a name="authentication"></a>
#### Authentication:
[Please see the 'Authentication' section of the Web Accelerator vx.xx ReadMe File](https://github.com/EliLillyCo/CIRR_WEB_ACCELERATOR/blob/master/README.md)

<a name="content-management-system-configuration"></a>
#### Content Management System Configuration:
	CMS: Contentful
	ContentfulDevSpace: OSIRIS_AULA_DIAB_DEV
	ContentfulPrdSpace: OSIRIS_AULA_DIAB_PRD

<a name="heroku-app-urls"></a>
#### Heroku App URLs
	Heroku App Dev URL: buit-eucan-aula-es-diab-dev.herokuapp.com
	Heroku App Stage URL: buit-eucan-aula-es-diab-stg.herokuapp.com
	Heroku App Prod URL: buit-eucan-aula-es-diab-prd.herokuapp.com
	Heroku App MLR preview app URL: buit-eucan-aula-es-diab-mlr.herokuapp.com

<a name="cookie-banner-details"></a>
#### Cookie Banner Details
	Country ID – ES
	Website ID – 434

<a name="analytics"></a>
#### Analytics
**Analytics Tool:**  Google Analytics

**Tag Management Tool:** Google Tag Manager

**Power Users:**

	| Name  |  Contact Email |
	|---|---|
	"Needs to be updated by development team"

**Tag Manager Code Version (if applicable):**

**Tag Manager Code Version (if applicable):**

	```javascript
<!-- Google Tag Manager -->
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', '', 'auto');
	  ga('set', 'anonymizeIp', true);
	  ga('send', 'pageview');
	</script>
<!-- End Google Tag Manager -->

#### Active Directory Name
	N/A

<a name="janrain-configuration"></a>
#### Janrain Configuration:

For DEV

	Client ID: qcsq9zp6pnzg5zb6pcwk2shsx2t6a32f
	Application ID: m2uqcsxt5rmhjqf7dbqxbgsbzn


<a name="folder-structure"></a>
#### Folder Structure:
- **bin** :: This folder contains the file which starts the node server [DO NOT CHANGE THIS FILE]

- **lib** :: This folder contains the transpiled code from the src folder. [DO NOT CHANGE ANYTHING FROM THIS FOLDER]

- **src** :: This folder contains all the server controllers, server routes and front end files as well

	- **controllers** :: This folder contains all the server side controllers [TRY AND MAKE MODULAR CODE ]

	- **indexer** :: This folder contains all the server side code for indexing the contents on the Bonsai Elasticsearch indexer.

	- **public** :: This folder contains all the front end scss, javascript, fonts and images

		- **scss** :: SASS files

		- **img** :: All Images

		- **fonts** :: All fonts files used in the application

		- **js** :: All Client-Side JavaScript files. Browserify is ran on these files so you are able to write modularcode

	- **routes** :: All the Express Routes used in the application are described here.

- **vendor** :: This folder conatins any of the open source libarary used in the client side code.

- **views** :: Contains all the handlebars views

<a name="additional-functionality"></a>
## Additional Functionality
Application does not deliver any additional functionality beyond Osiris approved standard requirements.  Validation activities covered within change request

<a name="testing"></a>
## Testing
Application follows Osiris testing standards as documented by the Osiris Quality approach.  This includes the following:

**Heroku CI**

* esLint compliance
* Checkmarx security compliance

**Code Review**

Code review by the Osiris support team

**Checklists**

* LillyWeb IT Checklists

**Additional Testing**

No additional testing is required for this application

<a name="notes"></a>
## Notes:
None
