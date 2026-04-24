//create variables 
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const wordInfoDiv = document.getElementById('word-info');
const wordTitle = document.getElementById('word-title');
const definitionParagraph = document.getElementById('definition');
const audioPlayer = document.getElementById('audio-player');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent page refresh
  const word = searchInput.value.trim();
  if (word) {
    fetchWordData(word);
  }
});

async function fetchWordData(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);//fetch data from API
    if (!response.ok) { // check if response is ok if not, throw an error
      throw new Error('Word not found');
    }
    const data = await response.json(); // parse the response as JSON
    displayWordData(data[0]); // display the first entry of the data
  }
  catch (error) {
    wordInfoDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
};

const displayWordData = (wordData) => {
  const word = wordData.word;
  const phonetics = wordData.phonetics;
  const meanings = wordData.meanings;

  wordTitle.textContent = word; // set the word title

  let audioUrl = '';
  phonetics.forEach(phonetic => {
    if (!audioUrl && phonetic.audio) {
      audioUrl = phonetic.audio; // get the first available audio URL
    }
  });

  if (audioUrl) {
    audioPlayer.src = audioUrl; // set the audio source
  }

  let definitionsHtml = ''; // initialize definitions HTML and reset the definition paragraph

  meanings.forEach(meaning => {
    definitionsHtml += `<p><strong>${meaning.partOfSpeech}:</strong></p>`;
    definitionsHtml += "<ul>";

    meaning.definitions.slice(0, 3).forEach(def => {
      definitionsHtml += `<li>${def.definition}</li>`; // add each definition to the list
    });

    definitionsHtml += "</ul>";
  });

  definitionParagraph.innerHTML = definitionsHtml; // set the definition paragraph HTML OUTSIDE the loop
};