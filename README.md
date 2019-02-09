# CRUD GENERATOR
Stop wasting your time writing the same code again and again .-.
JUST provide the tool with your architecture and database information and It will build your app for you in no time.
# What exactly the tool does ?
It generates an express application that uses either mysql or mongoDB as a database.
details for mongoDB:
 1-It creates models,routes,views,static directories inside your application directory.
 2-Inside models it creates a model.js file for every collection that contains mongoose schema and exports mongoose model.
 3-Inside routes it creates a routes file that contains all the routes for the models (Insert,Delete,Update,Show all,show specific document).
 4-Inside views it creates 2 views for every model (one view for all the documents in the collection,and another for specific document)
 5-Inside static It creates 2 files
  1-frontendlib.js which is responsiple mainly for the ajax requests in the views.
  2-style.css which contains the style of the views.
