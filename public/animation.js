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
    ".": ".-.-.-",
    "?": "..--..",
    ";": "-.-.-.",
    ":": "---...",
    "/": "-..-.",
    "-": "-....-",
    "'": ".----.",
    "(": "-.--.",
    ")": "-.--.-",
    '"': ".-..-.",
    "!": "-.-.--",
    "@": ".--.-.",
    "&": ".-...",
    "=": "-...-",
    "+": ".-.-.",
    _: "..--.-",
};

let defaultMessage =
    "Love is what prevents tongues from speaking,, it is better for lover to announce what is burning inside his chest, I wish the beloved who without guilt abandoned me, as sleeping abandoned my eyelids, would visit me as my sickness did, We parted, you could not describe our face, you would not know what colors we have due to pain, Our breaths were so blazing that I pitied the righteous burning between us, I redeem myself for this beloved woman who has bid farewell, whenever I looked at her once, I exhaled twice, I denied the misfortunes of the eternity once, then I admitted it, until it became a habit for me, I traveled through the world and far lands until my camels were tired, and my days and nights were ruined, I stopped that travelling when the generosity of Badr ibn Ammar prevented me from going on, and their, I reached everything I had ever wished for, No bowl can accommodate the majesty of Abi Al-Hussein's generosity, even if the bowl has been as wide as time, He ignored mentioning his bravery because it was well known, and Talking about it made even the coward brave";

// let centerX, centerY, radius, prevRadius, angle, dir, letterCount, letterSize;
let song;
let morse_sound;
let poem;
let song_flag = 0;
let img;
let colors;
let play;
let default_next_message = {
    email: "default",
    name: "Abū al-Ṭayyib Al-Mutanabbī",
    post: defaultMessage,
    image_name: "Abū al-Ṭayyib Al-Mutanabbī",
    _id: "",
};
let messageMorse;
let next_message = default_next_message;
let hu = 0; // hue
let height = window.innerHeight - 20;
let width = window.innerWidth - 10;
let starting_frame = 0;
let letterSize = 1;
let letterCount = 0;
let centerX = height / 2;
let centerY = height / 2;
let radius = 10;
let prevRadius = 10;
let angle = 0;
let dir = 1;
let paused = true;
let framesCurrent = 0;

function preload() {
    song = loadSound("audio.mp3");
    morse_sound = loadSound("morse.mp3");
    poem = loadSound("poem.mp3");
    img = loadImage("bg.png");
}
let myCanvas;

function setup() {
    myCanvas = createCanvas(height, height);
    myCanvas.parent("canvas");
    imageMode(CENTER);
    colorMode(HSB, 255);
    background(220);
    textAlign(CENTER, CENTER);
    frameRate(55);
    colors = ["#C07275", "#658ba2", "#57759f", "#52657a", "#2b263a"];
    dispImg();
    next_message = default_next_message;
    messageMorse = convertToMorse(next_message.post);
}

async function draw() {
    if (radius > height / 2 + 10 || letterCount >= messageMorse.length) {
        if (framesCurrent < 500) {
            framesCurrent++;
            return;
        }
        framesCurrent = 0;
        // setTimeout(pause, 10000);
        next_message = await update_message();
        messageMorse = convertToMorse(next_message.post);
        delete_message(next_message._id, next_message.email);
        dispImg();
    } else {
        animation(messageMorse, next_message.name);
    }

    if (!song.isPlaying() && !poem.isPlaying() && !paused) {
        if (song_flag === 1) {
            song.play();
            morse_sound.play();
            song_flag = 0;
            console.log("playing song");
        }
        else {
            poem.play();
            song_flag = 1;
            console.log("playing poem");
        }
    }
}

function convertToMorse(text) {
    console.log("converting to morse: ", text);
    let morse = "";
    for (let i = 0; i < text.length; i++) {
        let letter = text[i].toUpperCase();
        if (texttoMorse[letter] === undefined) {
            letter = " ";
        }
        morse += texttoMorse[letter] + " ";
    }
    return morse;
}
function takeScreenshot(email, name) {
    // take screenshot and save it of only height*height in the center of the canvas
    let imgWidth = height * (img.width / img.height);
    let imgHeight = height;
    if (name != "Abū al-Ṭayyib Al-Mutanabbī" && email != "default") {
        saveCanvas(myCanvas, + name + "_" + email, "png");
    }

}

function reset_animation() {
    // reset all variables
    starting_frame = 0;
    letterSize = 1;
    letterCount = 0;
    centerX = height / 2;
    centerY = height / 2;
    radius = 10;
    prevRadius = 10;
    angle = 0;
    dir = 1;
    paused = true;
}

function pause() {
    paused = !paused;
}
// message reading from db starts here
function dispImg() {
    imageMode(CENTER);
    let imgWidth = height * (img.width / img.height);
    let imgHeight = height;
    // image height offset
    image(img, height / 2 - 3, height / 2, imgWidth, imgHeight);
}

async function update_message() {
    try {
        pause();

        const response = await fetch("/message", { method: "GET" });
        const data = await response.json();

        console.log("data received: ", data.dataToSend.data[0]);
        let curr_Data = data.dataToSend.data[0];

        if (!curr_Data) {
            curr_Data = default_next_message;
            console.log("default");
        } else {
            console.log("curr_Data: ", curr_Data);
        }
        takeScreenshot(curr_Data.email, curr_Data.name);
        reset_animation();

        console.log("reading: ", curr_Data.post);
        pause();

        return curr_Data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        return default_next_message;
        // Handle errors here
    }
}

async function delete_message(id, email) {
    try {
        if (email === "default") {
            return;
        }
        const response = await fetch("/message/" + id, {
            method: "DELETE",
        });
        const data = await response.json();
        console.log("deleted: ", data);
    } catch (error) {
        console.error("Error fetching data: ", error);
        // Handle errors here
    }
}

function animation(displayText, name) {
    if (paused) {
        console.log("paused");
        return;
    }
    if (letterCount < displayText.length) {
        let letter = displayText[letterCount];
        letterCount++;
        starting_frame++;
        letterSize = ceil(starting_frame / (map(displayText.length, 300, 1000, 5, 40) / 3));
        console.log("displayText.length, letter size", displayText.length, map(displayText.length, 300, 1000, 10, 40));
        textSize(letterSize / 1.3);
        let letterWidth = textWidth(letter);
        let angleIncrease = (letterWidth / radius) * dir;
        let radiusIncrease = letterSize / 40;
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
        // write name in at the top of the bowl
        let radius_text = height / 2.5; // Adjust the radius_text as needed
        textAlign(CENTER, CENTER);
        textSize(30);
        fill(150, 150, 150);

        push();
        translate(centerX, centerY);

        let totalLetters = name.length;
        let angleStep = PI / totalLetters; // Half of the circle

        for (let i = 0; i < totalLetters; i++) {
            let x_text = cos(angleStep * i) * radius_text;
            let y_text = -sin(angleStep * i) * radius_text; // Negative sign to move text upwards
            let angle = atan2(y_text, x_text); // Calculate the angle of the letter
            let rotation = angle + HALF_PI; // Rotate the letter by 90 degrees
            push();
            translate(x_text, y_text);
            rotate(rotation);
            text(name.charAt(totalLetters - 1 - i), 0, 0); // Display letters in reverse order
            pop();
        }

        pop();
    }
}

function keyPressed() {
    if (keyCode === "P".charCodeAt(0) && !paused) {
        song.pause();
        poem.pause();
        morse_sound.pause();
        pause();
        console.log("paused");
    } else if (keyCode === "R".charCodeAt(0) && paused) {
        if (!song.isPlaying()) {
            song.play();
            morse_sound.play();
        }
        pause();
        console.log("resumed");
    }
}

// Archive stuff
/*
function take_screenshot() {
    // take screenshot and save it
    saveCanvas("./screenshot" + next_message.name, "png");
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
*/
