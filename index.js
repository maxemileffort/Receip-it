// receipt image: https://expressexpense.com/images/sample-gas-receipt.jpg
// receipt image 2 : https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrjxKakkzNaFmCyk9UOasjJskivfQI9k5BZ-tRPoknCvp6w7ZTvA

let userUrl = '';
let parsedResults = '';

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
    let request = {
        "requests": [
            {
                "image": {
                    "source": {
                        "imageUri": userUrl
                    }
                },
                "features": [
                    {
                        "type": "TEXT_DETECTION"
                    }
                ]
            }
        ]
    }

    $.ajax({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBxx4H01kTSUh9qAR6qz7Tb0DUbnOXkeC0',
        contentType: 'application/json',
        data: JSON.stringify(request),
        processData: false,
        success: function (data) {
            if (data.responses[0].hasOwnProperty('error') === true){
                console.log('error caught')
                parsedResults = 'error: '+data.responses[0].error.message;
            } else {
                console.log('no error')
                parsedResults = data.responses[0].fullTextAnnotation.text;
            }
        }
    })
    .then(function (){
        $("#insert-results").html(`<img src='${userUrl}' alt="user's image"><p>${parsedResults}</p>`)
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

