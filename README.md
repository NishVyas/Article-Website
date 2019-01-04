# Article-Website
 This project is an Article/Blogging website. 
 On this website, Users can sign up for an account, submit an article to the homepage, edit their own articles, delete their own articles, and view other articles.
 
 Summary of each folder:
 The "config" folder holds the local strategy that i created (using passport.js module for node) which makes user authentication possible.
 The "models" folder holds the "user" model and "article" model created for submission into our MongoDB collection (aka database).
 The "node_modules" folder holds all the modules neccessary for Node to work with on this project
 The "public" folder holds the css style sheet for flash messages and our ajax query for deleting articles.
 The "routes" folder holds all the GET and POST routes for creating, adding, viewing, editing, and deleting articles as well as GET/POST routes for user login functions.
 The "views" folder holds all the PUG files for each page (the front-end portion of the project).
 
Instructions for Deployment:
Make sure you have Nodemon, Node, MongoDB, and all other neccessary modules installed on your machine.
Clone this repository onto your machine.
Open command line and go into the directory where this project has been cloned.
Run the command "nodemon" in this directory.
Open browser, and go to "localhost:3000" and the website will display.
