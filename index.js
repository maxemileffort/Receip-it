// receipt image: https://expressexpense.com/images/sample-gas-receipt.jpg

let userUrl = '';
let fileToUpload = '';

function renderPreview (x) {
    $('#insert-preview').html(`<img src='${x}' alt="user's image">`);
    $('#preview').removeClass('hidden');
}

function grabValue () {
    userUrl = $('#user-input').val();
}

$('#btn-preview').on('click', function (event) {
    event.preventDefault();
    $('#url-input').addClass('hidden');
    grabValue();
    renderPreview(userUrl);
})

$('#btn-back').on('click', function (event){
    event.preventDefault();
    $('#url-input').removeClass('hidden');
    $('#preview').addClass('hidden');
    $('#user-input').val('');
})

$('#btn-go').on('click', function (event){
    event.preventDefault();
    //add functionality that parses text from image here
    $("#insert-results").html(`<p>Processing...</p>`);
    //Snippet from https://ocr.space/ocrapi
    //Prepare form data
    var formData = new FormData();
    //formData.append("file", fileToUpload);
    formData.append("url", userUrl);
    formData.append("language", "eng");
    formData.append("apikey", "3434f8d79088957");
    formData.append("isOverlayRequired", true);
    //Send OCR Parsing request asynchronously
    jQuery.ajax({
        url: 'https://api.ocr.space/parse/image',
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (ocrParsedResult) {
            //Get the parsed results, exit code and error message and details
            var parsedResults = ocrParsedResult["ParsedResults"];
            var ocrExitCode = ocrParsedResult["OCRExitCode"];
            var isErroredOnProcessing = ocrParsedResult["IsErroredOnProcessing"];
            var errorMessage = ocrParsedResult["ErrorMessage"];
            var errorDetails = ocrParsedResult["ErrorDetails"];
            var processingTimeInMilliseconds = ocrParsedResult["ProcessingTimeInMilliseconds"];
            //If we have got parsed results, then loop over the results to do something
            if (parsedResults != null) {
                //Loop through the parsed results
                $.each(parsedResults, function (index, value) {
                    var exitCode = value["FileParseExitCode"];
                    var parsedText = value["ParsedText"];
                    var errorMessage = value["ParsedTextFileName"];
                    var errorDetails = value["ErrorDetails"];
                    var textOverlay = value["TextOverlay"];
                    var pageText = '';
                    switch (+exitCode) {
                        case 1:
                            pageText = parsedText;
                            break;
                        case 0:
                        case -10:
                        case -20:
                        case -30:
                        case -99:
                        default:
                            pageText += "Error: " + errorMessage;
                            break;
                    }

    //                 $.each(textOverlay["Lines"], function (index, value) {
    // // ..........................
    // // ..........................
    // // ..........................
    // // LOOP THROUGH THE LINES AND GET WORDS TO DISPLAY ON TOP OF THE IMAGE AS OVERLAY
    // // ..........................
    // // ..........................
    // // ..........................
    // });
    $("#insert-results").html(`<img src='${userUrl}' alt="user's image"><p>${pageText}</p>`)
    $("#preview").addClass('hidden');
    $("#results").removeClass('hidden');
    });
    }
    }
    });
})

$("#reset").on("click", function (event){
    $("#preview").addClass('hidden');
    $("#results").addClass('hidden');
    $("#url-input").removeClass("hidden");
    $('#user-input').val('');
})

