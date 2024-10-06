async function fetchPreviewImage() {
    const url = document.getElementById('linkInput').value;
    const previewContainer = document.getElementById('previewContainer');
    const errorContainer = document.getElementById('error');
    const zaha = document.getElementById('zaha')
    
    previewContainer.innerHTML = ''; // Clear previous content
    errorContainer.innerHTML = '';   // Clear previous errors

    if (!url) {
        errorContainer.textContent = "Please enter a valid URL.";
        return;
    }

    try {
        const response = await fetch('/fetch-og-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (response.ok) {
            previewContainer.innerHTML = `<img src="${data.imageUrl}" class="preview-image" alt="Preview Image">`;
            zaha.innerHTML = `<h1>YABAAAIII</h1>`
        } else {
            errorContainer.textContent = data.error;
        }
    } catch (error) {
        console.error(error);
        errorContainer.textContent = "Error fetching the preview image. Please check the URL.";
    }
}