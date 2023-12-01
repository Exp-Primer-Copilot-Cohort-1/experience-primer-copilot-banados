// Create web server
// Run: node comments.js
// To test: curl -d "user=John&age=25" -X POST http://localhost:8080/comments
// To test: curl http://localhost:8080/comments
// To test: curl http://localhost:8080/comments/1

// Load the express module
var express = require('express');
// Create an express app
var app = express();
// Load the body-parser module
var bodyParser = require('body-parser');
// Load the mysql module
var mysql = require('mysql');

// Create a MySQL connection pool
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'root',
  database        : 'comments'
});

// Use the body-parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// GET /comments
app.get('/comments', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error connecting: ' + err.stack);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Connected as id ' + connection.threadId);
      connection.query('SELECT * FROM comments', function(err, rows) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          res.status(500).send('Internal Server Error');
        } else {
          res.status(200).send(rows);
        }
        connection.release();
      });
    }
  });
});

// GET /comments/:id
app.get('/comments/:id', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error connecting: ' + err.stack);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Connected as id ' + connection.threadId);
      connection.query('SELECT * FROM comments WHERE id = ?', [req.params.id], function(err, rows) {
        if (err) {
          console.error('Error executing query: ' + err.stack);
          res.status(500).send('Internal Server Error');
        } else {
          if (rows.length == 0) {
            res.status(404).send('Not Found');
          } else {
            res.status(200).send(rows[0]);
