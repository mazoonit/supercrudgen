# CRUD GENERATOR
## Stop wasting your time writing the same code again and again .-.
### JUST provide the tool with your architecture and database information and It will build your app for you in no time.
# How to install it ?
- Prerequisite:
  - nodejs -> https://nodejs.org/en/download/package-manager/
  - npm -> usually It gets installed with nodejs if not google it GEEK :"D (It's a peace of cake don't worry ! ^).
- Install the tool
  - ```sudo npm install supercrudgen -g```
### Don't forget "-g" or "sudo" That's crucial.
# How to use it ?
- After installing just write 
  - ```sudo supercrudgen``` (You'll find decryptor007 in RED on your terminal screen :"D).
    - ![alt text](https://i.imgur.com/uI4Blw0.png)
- It will run on port 7070
- Go to the browser and open it ```localhost:7070```
- From here It's very intuitive just use the UI
  - ![alt text](https://imgur.com/sIYKSo7)
  - ![alt text](https://imgur.com/h8edwlW)
  - ![alt text](https://imgur.com/ziQeTFS)

# What exactly the tool does ?
It generates a nodejs(express) application that uses either mysql or mongoDB as a database.

- details for mongoDB:
  - It creates models,routes,views,static directories inside your application directory.
  - Inside models It creates a model.js file for every collection that contains mongoose schema and exports mongoose model.
    - models/modelName.js
  - Inside routes It creates a routes file that contains all the routes for the models
    - routes/modelName.js (contains CRUD routes).
  - Inside views It creates 2 views for every model.
    - views/modelNames.ejs (view for all the documents in a collection).
    - views/modelName.ejs  (view for a specific document in a collection).
  - Inside static It creates 2 files
    - static/frontendlib.js (which is responsiple mainly for the ajax requests and other js stuff in the views).
    - static/style.css (which contains the style of the views).
- details for mysql:
  - It generates a directory for your application.
  - It creates routes,views,static directories inside the main dir.
  - It creates a route file that contains all the routes
    - routes/tableName.js (contains CRUD routes).
  - Inside views directory It creates a views files
    - views/tableNames.ejs (view for all the rows in the table).
    - views/tableName.ejs (view for a specific row in the table).
  - Inside static It creates 2 files
    - static/frontendlib.js (which is responsiple mainly for the ajax requests and other js stuff in the views).
    - static/style.css (which contains the style of the views).
  - Inside the main directory It creates app.js file which is already connected to the routes which the tool created lately.
  - Inside the main directory It creates db.js file which handles the mysql database connection for you.
  - Inside the main directory It creates package.json file with all the packages that you need to launch your app.
  
  
