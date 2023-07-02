from flask import Flask, render_template, request, redirect, url_for
import pygame
import base64
import os
import random
from typing import List, AnyStr
import cv2

from playsound import playsound, PlaysoundException
from cvzone.HandTrackingModule import HandDetector
import requests
import jsonify
import tempfile
from roboflow import Roboflow

app = Flask(__name__)

sound = ("static/sounds/")


cap = cv2.VideoCapture(0)
cap.set(3, 1280)
cap.set(4, 720)
detector = HandDetector(detectionCon=0.8)
count = 0
random_number = 0
name=""
res = 0
def play_sound_from_url(url):
    response = requests.get(url)
    if response.status_code == 200:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as file:
            file.write(response.content)
            temp_file_path = file.name

        # Initialize the mixer module
        pygame.mixer.init()
        # Load the audio file
        pygame.mixer.music.load(temp_file_path)
        # Play the audio file
        pygame.mixer.music.play()

        # Wait until playback finishes
        while pygame.mixer.music.get_busy():
            continue

        # Clean up
        pygame.mixer.music.stop()
        pygame.mixer.quit()

    else:
        print('Error downloading the audio file.')


# audio_link = f'<a href="{"https://audio-previews.elements.envatousercontent.com/files/277616326/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22KFCNRZ8-the-correct-answer.mp3%22"}">Ссылка на аудио</a>'
correct_effect = 'https://audio-previews.elements.envatousercontent.com/files/277616326/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22KFCNRZ8-the-correct-answer.mp3%22'
incorrect_effect = 'https://audio-previews.elements.envatousercontent.com/files/210354847/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22BQY5HXR-wrong.mp3%22'
indexes = [0, 1, 2]

letters = {"apple.mp3": "a", "balloon.mp3": "b", "cake.mp3": "c"}
arr_letters = ["apple.mp3", "balloon.mp3", "cake.mp3"]

arr_missed_words = ["b_sket", "key_oard", "bis_uit"]
arr_missed_words_files = ["basket.mp3", "kboard.mp3", "biscuit.mp3"]
missed_words = {"basket.mp3": "a", "kboard.mp3": "b", "biscuit.mp3": "c"}

urls_arr_easy_letters = []

target = ["a", "b_sket"]
level = ['medium']
score_math=0
target_word = [""]


# play_sound_from_url(correct_effect)
# playsound(sound+"kboard.mp3")
# playsound(sound+"apple.mp3")
# play_sound_from_url(correct_effect)
def easy(let: str) -> None:
    if let == target[0]:
        # playsound(sound + "Correct-sound-effect.mp3")
        play_sound_from_url(correct_effect)
    else:
        # playsound(sound + "wrong-effect.mp3")
        # playsound(sound + "badsound.mp3")
        play_sound_from_url(incorrect_effect)


# easy('b')
def medium(cls: AnyStr) -> None:
    if cls == missed_words[target[0]]:
        # playsound(sound + "Correct-sound-effect.mp3")

        # playsound(sound + "correct-effect.mp3")

        play_sound_from_url(correct_effect)
    else:
        # playsound(sound + "badsound.mp3")

        # playsound(sound + "wrong-effect.mp3")
        play_sound_from_url(incorrect_effect)
    # a = input()


rf = Roboflow(api_key="uoK086RgdPOr44CLPG3p")
project = rf.workspace().project("alphabet-and-digits")
model = project.version(4).model

numbers=[1,2,3,4,5,6,7,8,9]
@app.route('/')
def home():
    return render_template('index.html')



@app.route('/second')
def second():
    return render_template('second.html')


@app.route('/algebra')
def algebra():
    global count, random_number
    if count <= 100:
        random_number = random.randint(1, 5)
        name = "Please show number " + str(random_number)
        count += 1
    return render_template('algebra.html', name=name, results=res)


@app.route('/alpha')
def alpha():
    return render_template('alpha.html', wrd=target[1])


@app.route('/perform_action', methods=['POST'])
def perform_action():
    # Code to perform the desired action

    wrd = my_function(target, level)  # Call your Python function here
    # print(wrd)
    resp = {
        'wrd': wrd
    }
    return '', 204


def my_function(target, level):
    random.shuffle(indexes)
    if level[0] == 'medium':
        # Code for your custom function
        # playsound(sound+"missed_letter.mp3")
        # random.shuffle(indexes)
        # target[0] = "kboard.mp3"
        target[1] = arr_missed_words[indexes[0]]
        target[0] = arr_missed_words_files[indexes[0]]
        playsound(sound + target[0])
        return target[1]
        # print('Custom function executed!')
    if level[0] == 'easy':
        target[0] = arr_letters[indexes[0]]
        playsound(sound + target[0])


# Define route for extracting text from the image
@app.route('/extract_text', methods=['POST'])
def extract_text():
    if level[0] == 'medium':
        # Get the base64-encoded image data from the request
        image_data = request.form['image_data']

        # Decode the image data
        image_data = base64.b64decode(image_data)

        # Save the image in the "images" folder
        image_path = os.path.join('images', 'captured_image.png')
        with open(image_path, 'wb') as f:
            f.write(image_data)

        # Perform OCR or any other desired processing on the image
        result = model.predict(image_path, confidence=40, overlap=30).json()
        labels = result['predictions']
        # if labels is not:
        print(target[0])
        if labels:
            # pass
            # print(target[0])
            medium(labels[0]['class'])
        else:
            print('error')
        # print(labels[0]['class'])

        # Return the labels found on the image
        return jsonify({'labels': labels})
    if level[0] == 'easy':
        # Get the base64-encoded image data from the request
        image_data = request.form['image_data']

        # Decode the image data
        image_data = base64.b64decode(image_data)

        # Save the image in the "images" folder
        image_path = os.path.join('images', 'captured_image.png')
        with open(image_path, 'wb') as f:
            f.write(image_data)

        # Perform OCR or any other desired processing on the image
        result = model.predict(image_path, confidence=40, overlap=30).json()
        labels = result['predictions']
        # if labels is not:
        print(target[0])
        if labels:
            # pass
            # print(target[0])
            easy(labels[0]['class'])
        else:
            print('error')
        # print(labels[0]['class'])

        # Return the labels found on the image
        return jsonify({'labels': labels})

@app.route('/extract_text1', methods=['POST'])
def extract_text1():
    global res
    # Get the base64-encoded image data from the request
    image_data = request.form['image_data']

    # Decode the image data
    image_data = base64.b64decode(image_data)

    # Save the image in the "images" folder
    image_path = os.path.join('images', 'captured_image.png')
    with open(image_path, 'wb') as f:
        f.write(image_data)

    img = cv2.imread(image_path)
    img = cv2.flip(img, 1)
    imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Detect hands in the image
    hands, img_draw = detector.findHands(imgRGB)

    # Count the number of fingers
    if hands:
        hand = hands[0]
        fingers = detector.fingersUp(hand)
        finger_count = fingers.count(1)
    else:
        finger_count = 0
    print("Detected finger count:", finger_count)

    # Compare the detected finger count with the random number
    if finger_count == random_number:
        res += 1

    return '', 204

    # Return the labels found on the image

@app.route('/second', methods=['GET', 'POST'])
def shortenurl():
    if request.method == 'POST':
        return redirect(url_for('second'))
    elif request.method == 'GET':
        return redirect(url_for('home'))
    else:
        return 'Not a valid request method for this route'


@app.route('/alpha', methods=['GET', 'POST'])
def short():
    if request.method == 'POST':
        return redirect(url_for('alpha'))
    elif request.method == 'GET':
        return redirect(url_for('home'))
    else:
        return 'Not a valid request method for this route'


@app.route('/algebra', methods=['GET', 'POST'])
def short_algebra():
    if request.method == 'POST':
        return redirect(url_for('algebra'))
    elif request.method == 'GET':
        return redirect(url_for('home'))
    else:
        return 'Not a valid request method for this route'
