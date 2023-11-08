const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const isValid = require('./auth_users.js').isValid;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred."});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Either username or password are not provided."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    const fetchBooks = new Promise((resolve,reject) => {
        setTimeout(() => {
            if (books) {
                resolve(books);
            } else {
                reject({ message: 'Data was not found' });
            }
        }, 1000);
    });

    fetchBooks
    .then((books) => {
        return res.status(200).send(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
        return res.status(500).json(error);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const fetchBooks = new Promise((resolve,reject) => {
    setTimeout(() => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ message: 'ISBN was not found' });
        }
        }, 1000);
    });

    fetchBooks
    .then((book) => {
        return res.status(200).json(book);
    })
    .catch((error) => {
        return res.status(500).json(error);
    })
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  const author = req.params.author;
  const fetchedBooks = await axios.get('https://grzegorzsmol-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai');
  const data = fetchedBooks.data;

  if (Object.keys(data).length) {

    for (const [key, book] of Object.entries(data)) {

        if (author === book.author) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({message: "Book was not found"});
        }

    }

  } else {
    return res.status(500).json({ message: 'Something went wrong' });
  }
  
  
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    //Write your code here
    const title = req.params.title;
    const fetchedBooks = await axios.get('https://grzegorzsmol-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai');
    const data = fetchedBooks.data;

    if (Object.keys(data).length) {

        for (const [key, book] of Object.entries(data)) {

            if (title === book.title) {
                return res.status(200).json(book);
            } else {
                return res.status(404).json({ message: "Book was not found" });
            }

        }

    } else {
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
