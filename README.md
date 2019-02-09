#CRUD GENERATOR
	Stop wasting your time writing the same code again and again .-.
	JUST provide the tool with your architecture and database information and It will build your app for you in no time.
#What exactly the tool does ?
	It generates an express application that uses either mysql or mongoDB as a database.
  details for mongoDB:
    1-It creates models,routes,views,static directories inside your application directory.
    2-Inside models it creates a model.js file for every collection that contains mongoose schema and exports mongoose model.
    3-Inside routes it creates a routes file that contains all the routes for the models (Insert,Delete,Update,Show all,show specific document).
    4-Inside views it creates 2 views for every model (one view for all the documents in the collection,and another for specific document)
    5-Inside static It creates 2 files
     1-frontendlib.js which is responsiple mainly for the ajax requests in the views.
     2-style.css which contains the style of the views.
	details for mysql:
		1-It generates a directory for your application.
		2-It creates routes,views,static directories inside the main dir.
		3-It creates a route file that contains all the routes(Insert,Delete,Update,Show all,Show specific row) and 2 views(view for all the rows and view for a specific row) for every table.
		4-It creates an app.js file which is already connected to the routes which the tool created lately.
		5-It creates an db.js file that handle the mysql database connection for you.
		6-It creates a package.json file with all the packages that you need to launch your app

How to use It ?
	Just install the tool using npm and run It .. It will run on port 7070 Use the UI to create Your application
	It's so intuitive
		-Write your project path and name
		-Write your database information
		-Input the port you want your application use (It'll add the port into the app.js file to specify your app port)
		-then just like phpmyadmin add a table and specify a table name and a columns details
		-when you finish press Create
		-Your app has been created now <3 !
		-Go to the path that you specified you will find your app directory
		-open the terminal or the cmd and write ..sudo npm install so you can install the packages in the package.json file
		-now you can start your app write in your terminal node app.js or node start or npm start
		-CONGRATS THAT'S IT!
