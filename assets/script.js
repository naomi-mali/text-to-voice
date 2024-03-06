let isPaused = false;
let isMuted = false;
const apiKey = 'AIzaSyC9RjHTEnEVXJ_dD7McJ5vJKCN5fwDQRCQ';
const chunkSize = 500; // Adjust chunk size as needed

// Function to synthesize speech for a chunk of text
async function synthesizeSpeechForChunk(chunk, voice) {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            input: { text: chunk },
            voice: { languageCode: 'en-US', name: voice },
            audioConfig: { audioEncoding: 'MP3' }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return new Audio('data:audio/mp3;base64,' + data.audioContent);
}

// Function to split text into smaller chunks
function splitTextIntoChunks(text) {
    const chunks = [];
    const words = text.split(' ');
    let currentChunk = '';

    for (let i = 0; i < words.length; i++) {
        currentChunk += words[i] + ' ';
        if (currentChunk.length >= chunkSize || i === words.length - 1) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
        }
    }

    return chunks;
}

// Function to synthesize speech for the entire text
async function synthesizeSpeech() {
    const text = document.getElementById("text-to-read").value;
    const voice = document.getElementById("voices").value;
    const chunks = splitTextIntoChunks(text);

    // Stop previous audio playback if exists
    stopSpeech();

    // Synthesize speech for each chunk asynchronously
    for (let i = 0; i < chunks.length; i++) {
        const audioChunk = await synthesizeSpeechForChunk(chunks[i], voice);
        audioChunk.volume = isMuted ? 0 : document.getElementById("volumeRange").value;
        audioChunk.onended = function() {
            if (!isPaused) {
                playNextAudioChunk(i + 1);
            }
        };
        audioQueue.push(audioChunk);
    }

    // Start playing audio chunks
    playNextAudioChunk(0);
}

// Function to play the next audio chunk in the queue
function playNextAudioChunk(index) {
    if (index < audioQueue.length) {
        const audioChunk = audioQueue[index];
        audioChunk.play();
    }
}

// Function to pause or resume audio
function pauseSpeech() {
    isPaused = !isPaused;
    if (isPaused) {
        audioQueue.forEach(audioChunk => {
            audioChunk.pause();
        });
    } else {
        const currentIndex = audioQueue.findIndex(audio => !audio.paused);
        playNextAudioChunk(currentIndex);
    }
}

// Function to stop audio
function stopSpeech() {
    isPaused = false;
    audioQueue.forEach(audioChunk => {
        audioChunk.pause();
        audioChunk.currentTime = 0;
    });
    audioQueue = [];
}

// Event listener for volume change
document.getElementById("volumeRange").addEventListener("change", function() {
    isMuted = this.value == 0;
    audioQueue.forEach(audioChunk => {
        audioChunk.volume = isMuted ? 0 : this.value;
    });
});

// Function to toggle volume container visibility
function toggleVolume() {
    const volumeContainer = document.getElementById("volumeContainer");
    volumeContainer.style.display = volumeContainer.style.display === "none" ? "block" : "none";
}

// Array to store audio chunks
let audioQueue = [];