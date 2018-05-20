// receipt image: https://expressexpense.com/images/sample-gas-receipt.jpg
// receipt image 2 : https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrjxKakkzNaFmCyk9UOasjJskivfQI9k5BZ-tRPoknCvp6w7ZTvA

let userInput, parsedResults, request;
let b64Request = {
    "requests": [
        {
            "image": {
                "content": ''
            },
            "features": [
                {
                    "type": "TEXT_DETECTION"
                }
            ]
        }
    ]
}

let httpRequest = {
    "requests": [
        {
            "image": {
                "source": {
                    "imageUri": ''
                }
            },
            "features": [
                {
                    "type": "TEXT_DETECTION",
                }
            ]
        }
    ]
}

function renderPreview (x) {
    $('#insert-preview').html(`<img src='${x}' alt="user's image">`);
    $('#preview').removeClass('hidden');
}

function grabValue () {
    userInput = $('#user-input').val();
}

function trimContentType (str){
    str = str.replace('data:image/jpeg;base64,', '');
    return str;
}

function isBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

function checkInputType(x) {
    if (isBase64(trimContentType(x)) === true){
        b64Request.requests[0].image.content = trimContentType(x);
        request = b64Request;
        console.log('user input was base64');
    } else if (x.startsWith('http') === true){
        httpRequest.requests[0].image.source.imageUri = x;
        request = httpRequest;
        console.log('user input was http');
    } else {
        b64Request.requests[0].image.content = btoa(x);
        console.log(b64Request.requests[0].image.content);
        request = b64Request;
        console.log('user input was converted to base64');
    }
}

$('#btn-preview').on('click', function (event) {
    event.preventDefault();
    $('#url-input').addClass('hidden');
    grabValue();
    checkInputType(userInput);
    console.log(request);
    renderPreview(userInput);
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
    $("#insert-results").html('<p>Processing...</p>');
    $.ajax({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBxx4H01kTSUh9qAR6qz7Tb0DUbnOXkeC0',
        contentType: 'application/json',
        data: JSON.stringify(request),
        processData: false,
        success: function (data) {
            if (data.responses[0].hasOwnProperty('error') === true){
                console.log('error caught: ');
                console.log(data.responses[0]);
                parsedResults = 'error: '+data.responses[0].error.message;
            } else {
                console.log('no error')
                parsedResults = data.responses[0].fullTextAnnotation.text;
            }
        }
    })
    .then(function (){
        $("#insert-results").html(`<img src='${userInput}' alt="user's image"><p>${parsedResults}</p>`)
        $("#preview").addClass('hidden');
        $("#results").removeClass('hidden'); 
    })
})

$("#reset").on("click", function (event){
    $("#preview").addClass('hidden');
    $("#results").addClass('hidden');
    $("#url-input").removeClass("hidden");
    $('#user-input').val('');
})

