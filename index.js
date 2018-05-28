
//variables
let userInput = 'nothing', parsedResults, request, arr, output;
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

//functions
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
    } else if (x.startsWith('http') === true){
        httpRequest.requests[0].image.source.imageUri = x;
        request = httpRequest;
    } else {
        b64Request.requests[0].image.content = btoa(x);
        request = b64Request;
    }
}

//button behaviors
$('#btn-preview').on('click', function (event) {
    event.preventDefault();
    grabValue();
    if ($('#user-input').val() === ''){
        $('#warning-1').removeClass('hidden')
    } else {
        $('#url-input').addClass('hidden');
        checkInputType(userInput);
        renderPreview(userInput);
        }
    }
)

$('#btn-back').on('click', function (event){
    event.preventDefault();
    $('#url-input').removeClass('hidden');
    $('#preview').addClass('hidden');
    $('#warning-1').addClass('hidden');
    $('#user-input').val('');
})

$('#btn-go').on('click', function (event){
    event.preventDefault();
    $("#preview").addClass('hidden');
    $("#results").removeClass('hidden')
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
                parsedResults = 'Error: '+data.responses[0].error.message;
                output = " " + parsedResults;
            } else {
                parsedResults = data.responses[0].fullTextAnnotation.text;
                arr = parsedResults.split(' ');
                output = `<img id='img' src='${userInput}' alt="user's image" aria-live="polite"><div  class='container' aria-live="polite"><div class='row'>`;
                for (let i =0;i<arr.length;i++){
                    if (i%3===0){
                        output+="</div><div class='row'>";
                    } 
                    output += "<div class='col-xs col-sm'>"+arr[i]+"</div>";
                } 
                output+="</div></div>";
            }
        },

    })
    .then(function (){
        $("#insert-results").html(`
        ${output}
        `);
         return output
    })
})

$("#reset").on("click", function (event){
    $("#preview").addClass('hidden');
    $("#results").addClass('hidden');
    $("#url-input").removeClass("hidden");
    $('#user-input').val('');
    $('#warning-1').addClass('hidden');
    output = '';
})

