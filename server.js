const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT =3000;

// Store multiple API keys if needed
const apiKeys = ['2dd75c8da8ca46368966099abbe852a2, 65b479aea55047529eef5f407c431d60','8a980c0539164f38af6463cdbe651cf1','543b3f2fe08449b183c4abe5150f2f25'];
let currentApiKeyIndex = 0;

// Serve static files like CSS, JavaScript, and HTML
app.use(express.static(path.join(__dirname, 'public')));

// Handle API requests to fetch news data
app.get('/fetchData', async (req, res) => {
    const { search } = req.query;

    // Construct the API URL based on the search parameter
    let url;
    if (search === 'home') {
        url = `https://api.worldnewsapi.com/top-news?source-country=au&language=in&api-key=${apiKeys[currentApiKeyIndex]}`;
    } else {
        url = `https://api.worldnewsapi.com/search-news?api-key=${apiKeys[currentApiKeyIndex]}&text=${search}`;
    }

    for (let attempt = 0; attempt < apiKeys.length; attempt++) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 401 || response.status === 402) {
                    console.warn(`API key error. Trying next key...`);
                    currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;

                    // Update the URL with the new API key
                    if (search === 'home') {
                        url = `https://api.worldnewsapi.com/top-news?source-country=in&language=en&api-key=${apiKeys[currentApiKeyIndex]}`;
                    } else {
                        url = `https://api.worldnewsapi.com/search-news?api-key=${apiKeys[currentApiKeyIndex]}&text=${search}`;
                    }
                    continue; // Retry the fetch with the new key
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            const data = await response.json();
            res.json({ success: true, data });
            return;
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ success: false, message: "Error fetching data" });
            return;
        }
    }

    res.status(500).json({ success: false, message: "All API keys exhausted" });
});

// Default route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
























