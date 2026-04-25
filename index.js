//create variables 
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const wordInfoDiv = document.getElementById('word-info');
const wordTitle = document.getElementById('word-title');
const definitionParagraph = document.getElementById('definition');
const examplesParagraph = document.getElementById('examples');
const audioPlayer = document.getElementById('audio-player');

const clearPreviousData = () => {
  wordTitle.textContent = '';
  definitionParagraph.innerHTML = '';
  examplesParagraph.innerHTML = '';
  audioPlayer.src = '';
};
searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent page refresh
  const word = searchInput.value.trim();
  if (!word) { // if input is empty, display a message and return
    wordInfoDiv.innerHTML = '<p>Please enter a word to search.</p>';
    return;
  }
  if (!isNaN(word)) { // if input is a number, display a message and return
    wordInfoDiv.innerHTML = '<p>Please enter a word, not a number.</p>';
    return;
  }

  clearPreviousData(); // clear previous data before fetching new data 
  fetchWordData(word); // call the function to fetch word data
});


async function fetchWordData(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);//fetch data from API
    if (!response.ok) { // check if response is ok if not, throw an error
      throw new Error('Word not found');
    }
    const data = await response.json(); // parse the response as JSON
    wordInfoDiv.innerHTML = ''; // clear any previous error message
    displayWordData(data[0]); // display the first entry of the data
    searchInput.value = ''; // clear the input field after successful search
  }
  catch (error) {
    wordInfoDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
};

const displayWordData = (wordData) => {
  const word = wordData.word;
  const phonetic = wordData.phonetic; // get the phonetic text if available
  const phonetics = wordData.phonetics;
  const meanings = wordData.meanings;

  // Display word title with phonetic text
  wordTitle.textContent = word;
  if (phonetic) {
    wordTitle.textContent += ` (${phonetic})`;
  }

  let audioUrl = '';
  phonetics.forEach(phoneticObj => {
    if (!audioUrl && phoneticObj.audio) {
      audioUrl = phoneticObj.audio; // get the first available audio URL
    }
  });

  if (audioUrl) {
    audioPlayer.src = audioUrl; // set the audio source
  }

  definitionParagraph.innerHTML = ''; // clear previous definitions
  examplesParagraph.innerHTML = ''; // clear previous examples

  let exampleCount = 0;

  meanings.forEach(meaning => {
    const partOfSpeechPara = document.createElement('p');
    const partOfSpeechStrong = document.createElement('strong');
    partOfSpeechStrong.textContent = `${meaning.partOfSpeech}:`;
    partOfSpeechPara.appendChild(partOfSpeechStrong);
    definitionParagraph.appendChild(partOfSpeechPara);

    const definitionsList = document.createElement('ul');
    meaning.definitions.slice(0, 3).forEach(def => {
      const listItem = document.createElement('li');
      listItem.textContent = def.definition; // add each definition to the list
      definitionsList.appendChild(listItem); // manipulate the DOM to display the definitions

      if (def.example) {
        if (exampleCount === 0) {
          const examplesLabel = document.createElement('strong');
          examplesLabel.textContent = 'Example Sentences:';
          examplesParagraph.appendChild(examplesLabel);
          examplesParagraph.appendChild(document.createElement('br'));
        }

        const exampleText = document.createElement('span');
        exampleText.className = 'example-sentence';
        exampleText.textContent = def.example;
        examplesParagraph.appendChild(exampleText);
        examplesParagraph.appendChild(document.createElement('br'));
        exampleCount += 1;
      }
    });
    definitionParagraph.appendChild(definitionsList);

    // Display synonyms if available
    if (meaning.synonyms && meaning.synonyms.length > 0) {
      const synonymsPara = document.createElement('p');
      const synonymsStrong = document.createElement('strong');
      synonymsStrong.textContent = 'Synonyms:';
      synonymsPara.appendChild(synonymsStrong);
      synonymsPara.append(` ${meaning.synonyms.slice(0, 5).join(', ')}`);
      definitionParagraph.appendChild(synonymsPara);
    }
  });

  if (exampleCount === 0) {
    examplesParagraph.textContent = 'No example sentences available.';
  }
};

