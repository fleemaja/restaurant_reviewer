"Restaurant Reviewer" is a front-end demo app that allows users to read & write reviews for restaurants.

Live site: [https://fleemaja.github.io/restaurant_reviewer/](https://fleemaja.github.io/restaurant_reviewer/)

![Restaurant Reviewer](http://res.cloudinary.com/dkw0kkkgd/image/upload/v1480358582/Screen_Shot_2016-11-28_at_12.48.09_PM_wmfvop.png)

### Local Setup
***

Clone this repo to your local machine by running `git clone https://github.com/fleemaja/restaurant_reviewer.git` in the terminal.
Navigate to the project root and do the following:


##### 1. install 3rd party code/dependencies
  * run `npm install` to install the gulp build process node_modules

##### 2. gulp build process
  * install the gulp command line interface (if it's not already) with `sudo npm install --global gulp-cli`
  * run `gulp` if you want to make any changes to scripts or stylesheets (gulp does tasks like minifying css/js files)

##### 3. start the server
  * open a new terminal tab/window if you have gulp running
  * start a server using `python -m SimpleHTTPServer 8000` (or your preferred port number and way to start a server)
  * open `http://localhost:8000/` in a browser to use the web app
