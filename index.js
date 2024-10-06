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

  // Basic URL validation
  try {
    new URL(url);  // This will throw if URL is invalid
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  try {
    // Fetch the HTML content from the provided URL with a timeout of 10 seconds
    const response = await axios.get(url, { timeout: 10000 });
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
      // The server responded with a status code that falls out of the range of 2xx
      return res.status(error.response.status).json({
        error: `Failed to fetch the URL. Status code: ${error.response.status}`,
        details: error.response.statusText || 'No additional details',
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(500).json({ error: 'No response received from the URL' });
    } else if (error.code === 'ECONNABORTED') {
      // Handle Axios timeout
      return res.status(504).json({ error: 'Request to the URL timed out' });
    } else {
      // Other Axios errors or unexpected issues
      return res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
    }
  }
}
