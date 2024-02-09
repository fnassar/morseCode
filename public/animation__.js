let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceselect = document.querySelector("select");
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];
    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};
// document.querySelector ("button").addEventListener ("click", () =>{
// speech.text = document.querySelector ("textarea") .value;
// window.speechSynthesis.speak(speech) ;


const texttoMorse = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    0: "-----",
    " ": " ",
    ",": "--..--",
};
const morsetoText = {
    ".-": "A",
    "-...": "B",
    "-.-.": "C",
    "-..": "D",
    ".": "E",
    "..-.": "F",
    "--.": "G",
    "....": "H",
    "..": "I",
    ".---": "J",
    "-.-": "K",
    ".-..": "L",
    "--": "M",
    "-.": "N",
    "---": "O",
    ".--.": "P",
    "--.-": "Q",
    ".-.": "R",
    "...": "S",
    "-": "T",
    "..-": "U",
    "...-": "V",
    ".--": "W",
    "-..-": "X",
    "-.--": "Y",
    "--..": "Z",
    ".----": 1,
    "..---": 2,
    "...--": 3,
    "....-": 4,
    ".....": 5,
    "-....": 6,
    "--...": 7,
    "---..": 8,
    "----.": 9,
    "-----": 0,
    " ": " ",
    "--..--": ",",
};
// message reading from db starts here
let defaultMessage =
    "Love is what prevents tongues from speaking,, it is better for lover to announce what is burning inside his chest, I wish the beloved who without guilt abandoned me, "; /*as sleeping abandoned my eyelids, would visit me as my sickness did, We parted, you could not describe our face, you would not know what colors we have due to pain, Our breaths were so blazing that I pitied the righteous burning between us, I redeem myself for this beloved woman who has bid farewell, whenever I looked at her once, I exhaled twice, I denied the misfortunes of the eternity once, then I admitted it, until it became a habit for me, I traveled through the world and far lands until my camels were tired, and my days and nights were ruined, I stopped that travelling when the generosity of Badr ibn Ammar prevented me from going on, and their, I reached everything I had ever wished for, No bowl can accommodate the majesty of Abi Al-Hussein's generosity, even if the bowl has been as wide as time, He ignored mentioning his bravery because it was well known, and Talking about it made even the coward brave";*/
let default_next_message = {
    email: "default",
    name: "default",
    post: defaultMessage,
    image_name: "default",
    readOut: false,
    _id: "",
};

let next_message = default_next_message;

/*
1. fetch first data from db
2. convert to morse
3. display morse
4. save morse, name, email and text to new db
5. remove old db entry animation display
6. refresh page and repeat
7. if no more data display default message
*/
// convert
function convertToMorse(text) {
    let morse = "";
    for (let i = 0; i < text.length; i++) {
        let letter = text[i].toUpperCase();
        morse += texttoMorse[letter] + " ";
    }
    return morse;
}

let messageMorse = convertToMorse(defaultMessage);

// animation starts here
let started = false;
let centerX, centerY, radius, prevRadius, angle, dir, letterCount, letterSize;
let hu = 0; // hue
let lapse = 0; // mouse timer
let height = window.innerHeight - 20;
let width = window.innerWidth - 10;
let song;
let letterCountPause = 0;
let img;
let colors;
let starting_frame = 0;

function preload() {
    song = loadSound("audio.mp3");
    img = loadImage("bg.png");
}

function setup() {
    imageMode(CENTER);
    createCanvas(width, height);
    colorMode(HSB, 255);
    background(220);
    textAlign(CENTER, CENTER);
    // make frameRate slower
    frameRate(55);

    letterSize = 1;
    letterCount = messageMorse.length + 1;
    centerX = width / 2;
    centerY = height / 2;
    radius = 10;
    prevRadius = 10;
    angle = 0;
    dir = 1;
    colors = ["#C07275", "#658ba2", "#57759f", "#52657a", "#2b263a"];
    messageMorse = convertToMorse(defaultMessage);
    dispImg();
    // image(img, width / 2, height / 2, imgWidth, imgHeight);
    // center img
}
function dispImg() {
    imageMode(CENTER);
    let imgWidth = width;
    let imgHeight = img.height * (imgWidth / img.width);
    // image height offset
    image(img, width / 2, height / 2, imgWidth, imgHeight);
}

function draw() {
    let letter = messageMorse[letterCount];
    // %messageMorse.length
    if (letterCount <= messageMorse.length - 1 && started) {
        // console.log(letterCount);
        // no line break
        console.log(letter + " " + messageMorse.length);
        letterCount = letterCount + 1;
        // if (frameCount % 2 == 0) letterSize = ceil(frameCount / 40);
        starting_frame = starting_frame + 1;
        letterSize = ceil(starting_frame / 40);

        textSize(letterSize / 1.3);
        let letterWidth = textWidth(letter);

        let angleIncrease = (letterWidth / radius) * dir;
        let radiusIncrease = letterSize / 50;

        angle += angleIncrease / 1.5;
        radius += radiusIncrease / 5;

        let x = cos(angle) * radius + centerX;
        let y = sin(angle) * radius + centerY;

        push();
        translate(x, y);
        rotate(angle + HALF_PI * dir);
        // fill(hu % 255, 200, 200);
        fill(colors[letterCount % colors.length]);
        text(letter, 0, 0);
        hu++;
        pop();

        // angle += angleIncrease / 2;
        // radius += radiusIncrease / 2;
    }
    if (
        started &&
        (radius > height / 2 || letterCount >= messageMorse.length)
    ) {
        console.log(starting_frame);
        new_message();
        // add code to restart animation using next message
    }
    // write name on top
    // if all text message is animated then take ss of image and update message and db /archive post
}

//fixes negative values
function mod(m, n) {
    return ((m % n) + n) % n;
}

function mousePressed() {
    if (!started) {
        if (!song.isPlaying()) {
            song.play();
        }
        dispImg();
        // letterCount = 0;
        started = true;
    }
}

function keyPressed() {
    if (keyCode === "P".charCodeAt(0) && letterCountPause == 0) {
        song.pause();
        letterCountPause = letterCount;
        started = false;
    } else if (keyCode === "R".charCodeAt(0)) {
        if (!song.isPlaying()) {
            song.play();
        }
        letterCount = letterCountPause;
        letterCountPause = 0;
        started = true;
    }
}
// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }
function takeScreenshot() {
    // take screenshot of
    // saveCanvas("./screenshot" + next_message.name, "png");
}

function reset_animation(curr_Data) {
    next_message.email = curr_Data.email;
    next_message.name = curr_Data.name;
    next_message.post = curr_Data.post;
    next_message.readOut = curr_Data.readOut;
    next_message._id = curr_Data._id;
    // if readOut is true then read out message --- fetch api to do that in a diff function
    if (next_message.readOut) {
        readMessage(next_message.post);
    } else {
        // makes sure music is playing
        if (!song.isPlaying()) {
            song.play();
        }
    }

    dispImg();
    messageMorse = convertToMorse(next_message.post);
    letterSize = 1;
    letterCount = 0;
    centerX = width / 2;
    centerY = height / 2;
    radius = 10;
    prevRadius = 10;
    angle = 0;
    dir = 1;
    starting_frame = 0;
    textSize(20);
    fill(255);
    text(next_message.name, width / 2, 20);
}

function readMessage(next_message) {
    // pause music
    // fetch api to read out message
    // fetch("/readOut", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(next_message),
    // })
    //     .then((res) => res.json())
    //     .then((data) => {
    //         console.log("readOut", data);
    //     });
    console.log("reading out message");
}

// fetch and backend communication starts here
function new_message() {
    let curr_Data = {};
    fetch("/message", { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data.dataToSend.data[0]);
            curr_Data = data.dataToSend.data[0];
            if (curr_Data == undefined) {
                curr_Data = default_next_message;
            }
            reset_animation(curr_Data);
            setTimeout(update_archive, 1000);
            // fetch("/message/" + next_message._id, {
            //     method: "DELETE",
            // })
            //     .then((res) => res.json())
            //     .then((data) => {
            //         console.log(data);
            //     });
            // post message to archive with ss of message with name and email
        });
    console.log("reading: ", curr_Data.post);
}

function update_archive() {
    // take ss of message
    console.log("updating archive", next_message);
    takeScreenshot();
    // post message to archive with ss of message with name and email
    let save_message = {
        email: next_message.email,
        name: next_message.name,
        post: next_message.post,
        readOut: next_message.readOut,
        image_name: "screenshot" + next_message.name,
    };

    fetch("/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(save_message),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("archive", data);
        });
}
