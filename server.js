const path = require('path'); // import path module to use html files
const express = require('express'); // import express
const app = express(); // setup variable to access express features easier
const PORT = 3000; // choosing a port to run on
app.use(express.static('public')); // tell express where the static files are

/** 
 * get the html file and send it to the browser when accessing the index page
*/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**  
 * listening on the specified port and logging to the console that its running
*/
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})