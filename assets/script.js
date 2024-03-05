let audio;
let isPaused = false;
let isMuted = false;
const apiKey = 'AIzaSyC9RjHTEnEVXJ_dD7McJ5vJKCN5fwDQRCQ';

// Function to synthesize speech
async function synthesizeSpeech() {
    const text = document.getElementById("text-to-read").value;
    const voice = document.getElementById("voices").value;

    // Stop previous audio playback if exists
    if (audio) {
        stopSpeech();
    }

    try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: { text },
                voice: { languageCode: 'en-US', name: voice },
                audioConfig: { audioEncoding: 'MP3' }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        audio = new Audio('data:audio/mp3;base64,' + data.audioContent);
        playAudio();
    } catch (error) {
        console.error('Error:', error);
        // Handle error gracefully, show a message to the user
    }
}

// Function to play audio
function playAudio() {
    audio.play();
    audio.onpause = function() {
        if (isPaused) {
            audio.pause();
        }
    };
    audio.volume = isMuted ? 0 : document.getElementById("volumeRange").value;
}

// Function to pause or resume audio
function pauseSpeech() {
    if (audio) {
        if (!isPaused) {
            audio.pause();
            isPaused = true;
        } else {
            audio.play();
            isPaused = false;
        }
    }
}

// Function to stop audio
function stopSpeech() {
    isPaused = false;
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio = null;
    }
}

// Event listener for volume change
document.getElementById("volumeRange").addEventListener("change", function() {
    if (audio) {
        audio.volume = this.value;
        isMuted = this.value == 0;
    }
});

// Function to toggle volume container visibility
function toggleVolume() {
    const volumeContainer = document.getElementById("volumeContainer");
    volumeContainer.style.display = volumeContainer.style.display === "none" ? "block" : "none";
}