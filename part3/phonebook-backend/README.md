# Phonebook Backend

The backend for the part 3 version of the phonebook app, this uses a MongoDB database to store the phonebook data.

A live version of the backend is available [here](https://phonebook-backend-cyan.vercel.app/)

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
     PORT=3001
     ```

3. Start the backend server:

   ```bash
   npm start
   ```

4. The backend server will be running at:

   ```
   http://localhost:3001
   ```
