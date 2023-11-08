const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    const usersWithSameName = users.filter((user) => user.username === username);
    return usersWithSameName.length ? false : true;
}

const authenticatedUser = (username,password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    const validusers = users.filter((user) => (user.username === username && user.password === password));
    return validusers.length ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken,username };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;

    let book = books[isbn];
    const reviews = book.reviews;
    const username = req.session.authorization.username;

    for ( const [key, value] of Object.entries(reviews)) {
        if (value.author === username) {
            value.review = review;
            reviews[key] = value;
            book.reviews = reviews;
            return res.status(200).json(books);
        }
    }

    const key = Object.keys(reviews).length + 1;
    reviews[key] = { author: username, review };
    book.reviews = reviews;
    return res.status(200).json(books);
  });

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    let book = books[isbn];
    const reviews = book.reviews;

    for ( const [key, value] of Object.entries(reviews)) {
        if (value.author === username) {
            delete reviews[key];
            return res.status(200).json({ message: "Your review was deleted." });
        }
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
