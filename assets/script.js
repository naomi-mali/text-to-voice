let audio;
let isPaused = false;
let isMuted = false;
const apiKey = 'AIzaSyC9RjHTEnEVXJ_dD7McJ5vJKCN5fwDQRCQ'; // Replace with your Google Cloud API key

function synthesizeSpeech() {
    var text = document.getElementById("text-to-read").value;
    var voice = document.getElementById("voices").value;

    // Stop previous audio playback if exists
    if (audio) {
        audio.pause();
        audio = null;
    }

    // Make a POST request to Google Cloud Text-to-Speech API
    $.ajax({
        type: 'POST',
        url: 'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + apiKey,
        contentType: 'application/json',
        data: JSON.stringify({
            input: {
                text: text
            },
            voice: {
                languageCode: 'en-US',
                name: voice // Set the selected voice
            },
            audioConfig: {
                audioEncoding: 'MP3'
            }
        }),
        success: function(data) {
            // Play the audio
            audio = new Audio('data:audio/mp3;base64,' + data.audioContent);
            audio.play();
            audio.onpause = function() {
                if (isPaused) {
                    audio.pause();
                }
            };
            audio.volume = isMuted ? 0 : document.getElementById("volumeRange").value; // Update volume based on slider value
            
            // Update volume icon based on volume level
            updateVolumeIcon(audio.volume);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });
}

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

function stopSpeech() {
    isPaused = false;
    if (audio) {
        audio.pause();
        audio.currentTime = 0; // Reset audio playback to the beginning
        audio = null;
    }
}

// Add event listener for volume change
document.getElementById("volumeRange").addEventListener("change", function() {
    if (audio) {
        audio.volume = this.value;
        if (this.value == 0) {
            isMuted = true;
        } else {
            isMuted = false;
        }
        
        // Update volume icon based on volume level
        updateVolumeIcon(this.value);
    }
});

// Function to update volume icon
function updateVolumeIcon(volumeLevel) {
    var volumeIcon = document.getElementById("volumeIcon");
    if (volumeLevel == 0) {
        volumeIcon.className = "fa-solid fa-volume-mute volume-icon";
    } else if (volumeLevel < 0.5) {
        volumeIcon.className = "fa-solid fa-volume-down volume-icon";
    } else {
        volumeIcon.className = "fa-solid fa-volume-high volume-icon";
    }
}

// Function to toggle volume container visibility
function toggleVolume() {
    var volumeContainer = document.getElementById("volumeContainer");
    volumeContainer.style.display = volumeContainer.style.display === "none" ? "block" : "none";
}