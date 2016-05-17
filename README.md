# Voodle
Vocal prototyping for physical user interfaces.

--
##React Voodle
###Setting up React Voodle:

* Install [React](https://facebook.github.io/react/) and [Node](https://nodejs.org/en/).
* Navigate to the React Voodle directory in terminal and type: `npm install`
* You will need to manually install the node-module 'node-core-audio' because of reasons:
	* Clone the git repository `https://github.com/ZECTBynmo/node-core-audio.git` into your `node-modules` folder.
	* Run `node-gyp rebuild`.
	*NOTE: if you are running Python >3:
	make sure Python < 3 && >= 2.7 is installed
		run node-gyp rebuild --python=python2.7
	* Note if you are on a mac, MAY need to install the 'nan' package:
		`cd` to `node-core-audio`
		`npm i nan`


###Running React Voodle:

* Open a terminal window and type: `npm run dev`.
* While this process is running, open a *new* terminal window in the React Voodle directory and type: `node server.js`.
* Open a new browser window and go to `localhost:8080`.

--
##Processing Voodle
###Setting up Processing Voodle:

* Processing Voodle requires Processing. You can download it here: [https://processing.org/](https://processing.org/).

Note that older versions of Voodle use the processing sound library. The most recent versions (>=1.3) of this library have dependencies that are only available to OSX/Linux users. You can download previous releases of sound here: https://github.com/processing/processing-sound/releases.
