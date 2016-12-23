var express = require('express');
var mysql = require('mysql');
var app = express();
app.use(express.static('public'));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3000,
});

//call connection...
connection.connect(function (err) {
    if (!err) {
        connection.query('use contactlist', function (err, rows) {
            if (err) {
                connection.query('create database contactlist', function (err, rows) {
                    if (err)console.log(err);
                    else {
                        console.log('db created');
                        connection.query('use contactlist');
                    }
                });
            } else {
                console.log('database already exists');
            }
            var check = 0;
//if database exists already then check weather table exist or not...
            connection.query('show tables', function (err, rows) {
                //if table not exist...
                if (err) {
                    console.log('unable to show tables in db!');
                    connection.query('CREATE TABLE contacts(id int primary key,name varchar2(50),email varchar2(50),contact varchar2(50));', function (err, rows) {
                        if (err)console.log('Error : Table not created');
                        else
                            console.log('Table created sucessfully...');
                    });
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].Tables_in_contactlist == 'contacts')
                            check = 1;
                    }
                    if (check == 0) {
                        connection.query('CREATE TABLE contacts(id int primary key,name varchar(50),email varchar(50),contact varchar(50));', function (err, rows) {
                            if (err)console.log('Error : Table not created');
                            else
                                console.log('Table created sucessfully...');
                        });
                    }
                }
                    app.get('/contacts', function (req, res) {
                        connection.query('select * from contacts', function (err, rows, fields) {
                            if (err) throw err;
                            else {
                                res.json(rows);
                            }
                        });
                    });//end of get...
                    app.post('/addContact', function (req, res) {
                        var data = JSON.parse(req.query.data);

                        connection.query('INSERT INTO contacts VALUE(' + data.id + ',"' + data.name + '","' + data.email + '","' + data.contact + '")', function (err, doc) {
                            if (err) throw err;
                            else  {console.log(doc);res.send(doc);}
                        });
                    });//end of post record...
                    app.post('/deleteRecord', function (req, res) {
                        var id = JSON.parse(req.query.data);
                        connection.query('delete from contacts where id=' + id, function (err, docs) {
                            if (err) throw err;
                            else res.send(docs);
                        });
                    });//end of delete record...

                    app.get('/editRecord/:id', function (req, res) {
                        connection.query('select * from contacts where id=' + req.params.id, function (err, docs) {
                            if (err) throw err;
                            else res.send(docs);
                        });
                    });//end of edit record...

                    app.put('/updateRecord', function (req, res) {
                        var data = JSON.parse(req.query.data);
                        //console.log('update contacts set id='+data.id+',name=\"' + data.name + '"\,email=\"'+data.email + '"\,contact=\"'+ data.contact+ '"\ where id='+req.query.data_id);

                        connection.query('update contacts set id='+data.id+',name=\"' + data.name + '"\,email=\"'+data.email + '"\,contact=\"'+ data.contact+ '"\ where id='+req.query.data_id, function (err, docs) {
                            if (err) throw err;
                            else
                                res.send(docs);
                        });
                    });//end of update record...
            });
        });
    }
    else {
        console.log('mysql error')
    }
});

app.listen(3000);