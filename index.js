const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // For parsing HTML
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// Serve the favicon.ico if needed (optional)
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(204); // No Content
});

// Endpoint to fetch the OG image from a URL
app.post('/fetch-og-image', async (req, res) => {
    const { url } = req.body;

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'publi', 'index.html'));
    });
    

    // Validate URL
    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        // Fetch the HTML content from the provided URL
        const response = await axios.get(url);
        const html = response.data;

        // Load the HTML into Cheerio for parsing
        const $ = cheerio.load(html);

        // Extract the Open Graph image meta tag
        const ogImage = $('meta[property="og:image"]').attr('content');

        if (ogImage) {
            res.json({ imageUrl: ogImage });
        } else {
            res.status(404).json({ error: 'No Open Graph image found' });
        }
    } catch (error) {
        console.error('Error fetching URL:', error.message || error);
        
        // Handle specific Axios errors
        if (error.response) {
            return res.status(error.response.status).json({
                error: `Failed to fetch the URL. Status code: ${error.response.status}`,
            });
        } else if (error.request) {
            return res.status(500).json({ error: 'No response received from the server' });
        } else {
            return res.status(500).json({ error: 'Axios request failed', details: error.message });
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
