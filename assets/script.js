let audio;

function synthesizeSpeech() {
  var text = document.getElementById("text-to-read").value;
  var voice = document.getElementById("voices").value;
  var apiKey = 'AIzaSyC9RjHTEnEVXJ_dD7McJ5vJKCN5fwDQRCQ'; // Replace with your Google Cloud API key

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
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Error:', textStatus, errorThrown);
    }
  });
}

// Function to stop audio playback
document.getElementById("stopButton").onclick = function() {
  if (audio) {
    audio.pause();
    audio = null;
  }
};