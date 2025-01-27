
import { getDocument } from 'pdfjs-dist'; // Import the PDF.js library

const ratePerPage = 2; // $2 per page
const pagesPerDay = 5; // 5 pages per day for review
let uploadedFile; // Variable to store the uploaded file

$w.onReady(() => {

    $w('#submitButtontest').onClick((event) => {
        $w('#counter1').text = 'test.';
    })

    $w('#pdfUpload').onChange(() => {
        const file = $w('#pdfUpload').value[0]; // Get the uploaded file
        if (file) {
            uploadedFile = file; // Save the file for later use
            $w('#outputText').text = 'File selected. Click Submit to process it.';
        } else {
            uploadedFile = null;
            $w('#outputText').text = 'No file selected. Please upload a PDF.';
        }
    });

      // Submit Button: Process the uploaded PDF file
    $w('#submitButton').onClick(async () => {
        if (!uploadedFile) {
            $w('#outputText').text = 'No file selected. Please upload a PDF first.';
            return;
        }

        try {
            $w('#outputText').text = 'Uploading and processing the PDF...';

            // Step 1: Upload the file to Wix Media Manager
            const uploadResult = await $w('#pdfUpload').uploadFile(uploadedFile);
            const fileUrl = uploadResult.url; // Get the URL of the uploaded file

            // Step 2: Fetch the file content from its URL
            const response = await fetch(fileUrl);
            const arrayBuffer = await response.arrayBuffer();

            // Step 3: Process the PDF using PDF.js
            const pdf = await getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages; // Get the number of pages

            // Step 4: Calculate the pricing and review time
            const totalPrice = numPages * ratePerPage;
            const reviewDays = Math.ceil(numPages / pagesPerDay);

            // Step 5: Display the results
            $w('#outputText').text = `
                Total Pages: ${numPages}
                Total Price: $${totalPrice}
                Estimated Review Time: ${reviewDays} days
            `;
        } catch (error) {
            console.error('Error processing the PDF:', error);
            $w('#outputText').text = 'Failed to process the PDF. Please try again.';
        }
    });

});