# Express Book Reviews

Express.js service that allows authenticated users to post book reviews. Unauthenticated users can only view books and their reviews.

The books list comes from a fake DB atm. It's an example of JWT token authentication and routing.

Available unauthenticated routes:

- /register
- /login
- /isbn/:isbn - Get book details based on ISBN
- /author/:author - Get book details based on author
- /title/:title - Get all books based on title
- /review/:isbn - Get book review

Available authenticated routes:

- GET auth/review/:isbn - Add a book review
- DELETE auth/review/:isbn - Delete a book review
