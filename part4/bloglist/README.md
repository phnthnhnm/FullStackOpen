# Blog List

A simple blog list application built with Node.js and Express for the backend. It allows users to create, view, and delete blog posts. The application uses MongoDB for data storage.

## Running the Backend

To run the backend server, follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up the MongoDB database:

   - Create a MongoDB database.
   - Create a `.env` file in the root directory of the project.
   - Add the following environment variables to the `.env` file:

     ```
     MONGODB_URI=your-mongodb-uri
     TEST_MONGODB_URI=your-test-mongodb-uri
     PORT=3003
     ```

3. Start the backend server:

   ```bash
   npm start
   ```

4. The backend server will be running at:

   ```
   http://localhost:3003
   ```
