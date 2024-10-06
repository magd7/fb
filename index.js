const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

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
      return res.json({ imageUrl: ogImage });
    } else {
      return res.status(404).json({ error: 'No Open Graph image found' });
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
}
