var express = require("express");
var app = express();

var mysql = require('mysql');

app.use(express.static("public")); //folder for images, css, js
app.set("view engine", "ejs");


/* Configure MySQL DBMS */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ijabarkhel',
    password: 'sql747@',
    database: 'quotes_db'
});
connection.connect();

/* Route Handlers */
app.get('/', function(req, res){
    res.render('search');
});

app.get('/name', function(req, res){
    res.render('name');
});

app.get('/quotesByName', function(req, res){
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var stmt = 'select * '+
                'from l9_author, l9_quotes where l9_author.authorId = l9_quotes.authorId '+
                'and firstName=\'' + firstName + '\''+
                ' and lastName=\'' + lastName + '\';';
    connection.query(stmt, function(error, found){
        if (error) throw error;
        if (found.length){
            var name = found[0].firstName + ' ' + found[0].lastName;
            res.render('quotes', {keyword: name, quotes: found, name: name});
        }
    });
});

app.get('/category', function(req, res){
    res.render('category');
});

app.get('/gender', function(req, res){
    // var gender = req.query.gender;
    // console.log(gender);
    res.render('gender');
});

app.get('/quotesByGender', function(req, res){
    var gender = req.query.gender;
    var stmt = 'select * from l9_quotes, l9_author where l9_author.authorId = l9_quotes.authorId ' +
                'and sex = \'' + gender + '\';';
                
    if(gender == 'M'){
        gender = "Male";
    }else{
        gender = "Female";
    }
    console.log(stmt);
    connection.query(stmt, function(error, found) {
        if(error) throw error;
        if (found.length) {
            console.log(found);
            res.render('quotes', {name: null, quotes: found, keyword: gender} );
        }
    });
});

app.get('/quotesByKeyword', function(req, res){
    var key = req.query.keyword;
    var stmt = 'select * from l9_quotes, l9_author where l9_author.authorId = l9_quotes.authorId ' +
                'and quote like \'%' + key + '%\';';
    console.log(stmt);
    connection.query(stmt, function(error, found) {
        if(error) throw error;
        if (found.length) {
            console.log(found);
            res.render('quotes', {name: null, quotes: found, keyword:key} );
        }
    });
    
});

app.get('/findQuotes', function(req, res){
    var keyword = req.query.byCategory;
    var stmt = 'select * from l9_quotes, l9_author where l9_author.authorId = l9_quotes.authorId ' +
                'and category=\'' + keyword + '\';';
    
    connection.query(stmt, function(error, found) {
        if(error) throw error;
        if (found.length) {
            console.log(found);
            res.render('quotes', {name: null, quotes: found, keyword:keyword} );
        }
    });
});

app.get('/quotes', function(req, res){
    res.render('quotes');
});

app.get('/keyword', function(req, res){
    res.render('keyword');
});


app.get('/author', function(req, res){
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    console.log(firstName);
    console.log(lastName);
    var stmt = 'select * '+
                'from l9_author '+
                'where firstName=\'' + firstName + '\''+
                ' and lastName=\'' + lastName + '\';';
    connection.query(stmt, function(error, found) {
        var author = null;
        if(error) throw error;
        if (found.length) {
            author = found[0];
            author.dob = author.dob.toString().split(' ').slice(0,4).join(' ');
            author.dod = author.dod.toString().split(' ').slice(0,4).join(' ');
            // res.render('author', {author: author} );
        }
        res.render('author', {author: author} );
        console.log(author);
    });
});

app.get('/author/:aid' , function(req, res){
    var stmt = 'select firstName, lastName, quote ' +
                'from l9_author, l9_quotes ' +
                'where l9_author.authorId = l9_quotes.authorId ' +
                'and l9_author.authorId=' + req.params.aid + ';';
    connection.query(stmt, function(error, found){
        if (error) throw error;
        if (found.length){
            var name = found[0].firstName + ' ' + found[0].lastName;
            res.render('quotes', {keyword: name, quotes: found, name: name});
        }
    });
});

app.get('*', function(req, res) {
    res.render('error');
});



//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has been started...");
});