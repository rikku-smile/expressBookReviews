const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let booksobject = Object.values(books)

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    // Check if user exists
    console.log(public_users);
    if (!isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User " + username + " successfully registered."});
    }
    return res.status(400).json({message: "User " + username + " already registered."});

  }
    return res.status(404).json({message: "Unable to register user. Check you have provided an username and password."});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // Based on this: https://discussions.edx.org/course-v1:IBM+CAD220EN+3T2022/posts/674f891d7febe50470781ddc
  // The ISBN refers to the number of the book of the bookds.js file
  const isbn=req.params.isbn;
    if (books[isbn]) {
    return res.send(books[isbn]);
    }
    return res.status(404).json({message: "ISBN " + isbn + " not found"});
//   return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author=req.params.author;
    let chosen_books = booksobject.filter((book) => 
        book.author === author);
    if (chosen_books.length != 0) {
        return res.send(chosen_books);
    }
    return res.status(404).json({message: "Author " + author + " not found"});        
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title=req.params.title;
    let chosen_books = booksobject.filter((book) => 
        book.title === title);
    if (chosen_books.length != 0) {
        return res.send(chosen_books); 
    }
    return res.status(404).json({message: "Title " + title + " not found"});        

  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn].reviews);
    }
    return res.status(404).json({message: "ISBN " + isbn + " not found"});

  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
