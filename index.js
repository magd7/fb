const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // For parsing HTML

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Endpoint to fetch the OG image from a URL
app.post('/fetch-og-image', async (req, res) => {
    const { url } = req.body;

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
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch the URL' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});






