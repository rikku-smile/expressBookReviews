const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user has the same username
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUser = users.filter(
        (user) => {
            return(user.username === username && user.password === password);
        }
    )
    // console.log(validUser);
    if (validUser.length > 0 ) {
        return true;
    } else {
        return false;
    }
}

regd_users.get('/users',function (req, res) {
    //Write your code here
    return res.send(JSON.stringify(users,null,4));
    //return res.status(300).json({message: "Yet to be implemented"});
  });

//only registered users can login
regd_users.post("/login", (req,res) => {
        const username = req.body.username;
        const password = req.body.password;
        // Check if username or password is missing
        if (!username || !password) {
            return res.status(404).json({ message: "Error logging in. No username or password provided." });
        }

        // Authenticate user
        if (authenticatedUser(username, password)) {
            // Generate JWT access token
            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });
            // Store access token and username in session
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send("Logged in successfully");
        } else {
            return res.status(208).json({ message: "Invalid Login. Check username and password" });
        }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization['username'];
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }
  if (books[isbn]) {
    books[isbn].reviews[username]=review;
    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({message: "ISBN " + isbn + " not found"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    if (books[isbn]) {
        if (!books[isbn].reviews[username]) {
            return res.status(404).json({ message: "No review found for this user to delete" });
        }
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review removed successfully", reviews: books[isbn].reviews });
    } else {
      return res.status(404).json({message: "ISBN " + isbn + " not found"});
    }
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
