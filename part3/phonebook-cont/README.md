# Phonebook (Cont.)

A continuation of the phonebook application from part 2. This version of the app includes a backend server that stores the phonebook data in a MongoDB database.

A live version of the frontend is available [here](https://phonebook-frontend-eight.vercel.app/)

## Running the App

To run the app, follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the app in the browser:

   ```
   http://localhost:5173
   ```

## Setting API URL

To set your own API URL in the `person.js` file, follow these steps:

1. Open the `person.js` file located in the `src` directory.

2. Find the section where the base URL is defined:

   ```javascript
   const baseUrl = '/api/persons'
   ```

3. Replace the existing URL with your own API URL. For example:

   ```javascript
   const baseUrl = 'https://your-api-url.com/api/persons'
   ```

4. Save the changes and restart the development server if it's running.
