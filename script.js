// Function to update the ID card preview with data from inputs
function updateIdCardPreview() {
    // Get values from input fields
    const name = document.getElementById('employeeName').value.toUpperCase() || 'N/A';
    const position = document.getElementById('employeePosition').value.toUpperCase() || 'N/A';
    const site = document.getElementById('employeeSite').value.toUpperCase() || 'N/A';
    const idNumber = document.getElementById('idNumber').value.toUpperCase() || 'N/A';
    
    // Format dates for display
    const issueDate = document.getElementById('dateOfIssue').value;
    const expiryDate = document.getElementById('dateOfExpiry').value;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString + 'T00:00:00'); // Add T00:00:00 to avoid timezone issues
        // Format as DD-MM-YYYY
        return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    // Update the preview elements
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewPosition').textContent = position;
    document.getElementById('previewSite').textContent = site;
    document.getElementById('previewIdNumber').textContent = idNumber;
    document.getElementById('previewIssueDate').textContent = formatDate(issueDate);
    document.getElementById('previewExpiryDate').textContent = formatDate(expiryDate);
}

// Function to handle image file loading for photo and signature
function handleImageUpload(inputElementId, previewElementId) {
    const input = document.getElementById(inputElementId);
    const preview = document.getElementById(previewElementId);
    
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Function to download the generated ID card
function downloadIdCard() {
    const idCard = document.getElementById('id-card');
    
    // Use html2canvas library to capture the ID card container
    // The library is loaded in index.html via CDN
    html2canvas(idCard, {
        scale: 3, // Increase scale for higher resolution image
        useCORS: true, // Needed if images are loaded from external sources (though not here)
        backgroundColor: '#FFFFFF' // Ensure card background is white on the final image
    }).then(canvas => {
        // Convert canvas to a data URL and trigger download
        const link = document.createElement('a');
        link.download = `JobConnectID_${document.getElementById('idNumber').value || 'New'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        console.error("Error during ID card capture:", err);
        alert("Could not generate ID card image. Check console for details.");
    });
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Image Upload Handlers
    handleImageUpload('employeePhotoUpload', 'previewPhoto');
    handleImageUpload('issuerSignatureUpload', 'previewSignature');

    // 2. Data Update Handler
    const inputFields = document.querySelectorAll('#input-section input[type="text"], #input-section input[type="date"]');
    inputFields.forEach(input => {
        input.addEventListener('input', updateIdCardPreview);
    });

    // 3. Generate Button (updates all fields, though 'input' event covers most changes)
    document.getElementById('generateIdCard').addEventListener('click', updateIdCardPreview);

    // 4. Download Button Handler
    document.getElementById('downloadIdCard').addEventListener('click', downloadIdCard);

    // Initial update on load
    updateIdCardPreview();
});