(function () {

            var width = 320; // We will scale the photo width to this
            var height = 0; // This will be computed based on the input stream

            var streaming = false;

            var video = null;
            var canvas = null;
            var photo = null;
            var startbutton = null;
            var textOutput = null;

            function startup() {
                video = document.getElementById('video');
                canvas = document.getElementById('canvas');
                photo = document.getElementById('photo');
                textOutput = document.getElementById('textOutput');
                startbutton = document.getElementById('startbutton');

                navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                })
                    .then(function (stream) {
                        video.srcObject = stream;
                        video.play();
                    })
                    .catch(function (err) {
                        console.log("An error occurred: " + err);
                    });

                video.addEventListener('canplay', function (ev) {
                    if (!streaming) {
                        height = video.videoHeight / (video.videoWidth / width);

                        if (isNaN(height)) {
                            height = width / (4 / 3);
                        }

                        video.setAttribute('width', width);
                        video.setAttribute('height', height);
                        canvas.setAttribute('width', width);
                        canvas.setAttribute('height', height);
                        streaming = true;
                    }
                }, false);

                startbutton.addEventListener('click', function (ev) {
                    takepicture();
                    ev.preventDefault();

                    /* my code for image to text */
                    var canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, width, height);
                    var dataURL = canvas.toDataURL('image/png');
                    var imageData = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');

                    // Send the base64-encoded image data to the OCR endpoint
                    fetch('/extract_text', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: 'image_data=' + encodeURIComponent(imageData)
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            // Update the textOutput element with the extracted text
                            textOutput.textContent = data.text;
                        })
                        .catch(function (error) {
                            console.log('An error occurred:', error);
                        });

                }, false);

                clearphoto();
            }


            function clearphoto() {
                var context = canvas.getContext('2d');
                context.fillStyle = "#AAA";
                context.fillRect(0, 0, canvas.width, canvas.height);

                var data = canvas.toDataURL('image/png');
                photo.setAttribute('src', data);
            }

            function takepicture() {
                var context = canvas.getContext('2d');
                if (width && height) {
                    canvas.width = width;
                    canvas.height = height;
                    context.drawImage(video, 0, 0, width, height);

                    var data = canvas.toDataURL('image/png');
                    photo.setAttribute('src', data);
                } else {
                    clearphoto();
                }
            }

            window.addEventListener('load', startup, false);
        })();