// textAPI endpoint: https://textapis.p.mashape.com/ocr/
// receipt image: https://expressexpense.com/images/sample-gas-receipt.jpg
// receipt image 2 : https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrjxKakkzNaFmCyk9UOasjJskivfQI9k5BZ-tRPoknCvp6w7ZTvA

const endpoint = 'https://textapis.p.mashape.com/ocr/?url=https%3A%2F%2F';
const image1 = 'https://expressexpense.com/images/sample-gas-receipt.jpg';
const image2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrjxKakkzNaFmCyk9UOasjJskivfQI9k5BZ-tRPoknCvp6w7ZTvA';


let request = {
    "requests": [
        {
            "image": {
                "source": {
                    "imageUri":image2
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
        console.log(data);
    }
})
