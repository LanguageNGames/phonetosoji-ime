import {useEffect,useRef,useState} from "react";
import { convertSentence } from "./utils/convertSentence";
import { mergeResults } from "./utils/mergeResults";
import { userFrequency, saveUserFrequency } from "./data/userFrequency";
import { replaceActiveWord } from "./utils/replaceActiveWord";
import CandidatePopup from "./components/CandidatePopup";
import getCaretCoordinates from "textarea-caret";
import {loadUserDictionary, saveUserDictionary,} from "./data/userDictionary";


export default function App() {
  const [displayText, setDisplayText] = useState("");
  const [results, setResults] = useState(convertSentence(""));
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const textareaRef =useRef<HTMLTextAreaElement>(null);
  const activeWord = results[activeWordIndex];
  const [popupPosition, setPopupPosition] = useState({top: 0, left: 0,});
  const [userDictionary, setUserDictionary] = useState(loadUserDictionary());

  const [newEnglish,
    setNewEnglish] =
    useState("");

  const [newPhonetosoji,
    setNewPhonetosoji] =
    useState("");

  function deleteUserWord(
    phonetic: string,
    word: string
  ) {
    const updated = {
      ...userDictionary,
    };

    updated[phonetic] =
      updated[phonetic].filter(
        (entry) => entry !== word
      );

    if (
      updated[phonetic].length === 0
    ) {
      delete updated[phonetic];
    }

    setUserDictionary(
      updated
    );

    saveUserDictionary(
      updated
    );
  }

  function addUserWord() {
    if (
      !newEnglish.trim() ||
      !newPhonetosoji.trim()
    ) {
      return;
    }

    const key =
      newPhonetosoji
        .trim()
        .toLowerCase();

    const value =
      newEnglish
        .trim()
        .toUpperCase();

    if (
      userDictionary[key]?.includes(value)
    ) {
      return;
    }

    const updated = {
      ...userDictionary,
      [key]: [
        ...(userDictionary[key] ?? []),
        value,
      ],
    };

    setUserDictionary(
      updated
    );

    saveUserDictionary(
      updated
    );

    setNewEnglish("");
    setNewPhonetosoji("");
  }

  useEffect(() => {
    updatePopupPosition();
  }, []);

  function updatePopupPosition() {
    if (!textareaRef.current) {
      return;
    }

    const textarea =
      textareaRef.current;

    const coords =
      getCaretCoordinates(
        textarea,
        textarea.selectionStart
      );

    const lineHeight =
      Number.parseInt(
        getComputedStyle(textarea)
          .lineHeight,
        10
      ) || 24;

    setPopupPosition({
      top:
        coords.top -
        textarea.scrollTop +
        lineHeight,

      left:
        coords.left -
        textarea.scrollLeft,
    });
  }

  function commitCurrentCandidate() {
    const activeWord =
      results[activeWordIndex];

    if (!activeWord) {
      return;
    }

    const selectedWord =
      activeWord.candidates[
        activeWord.selectedIndex
      ];

    if (!selectedWord) {
      return;
    }

    const newText =
      replaceActiveWord(
        displayText,
        activeWordIndex,
        selectedWord
      );

    setDisplayText(
      newText + " "
    );
  }

  function cycleCandidateForward() {
    const activeWord =
      results[activeWordIndex];

    if (!activeWord) {
      return;
    }

    if (
      activeWord.candidates.length <= 1
    ) {
      return;
    }

    const nextIndex =
      (activeWord.selectedIndex + 1) %
      activeWord.candidates.length;

    selectCandidate(
      activeWordIndex,
      nextIndex
    );
  }

  function handleKeyDown(
    e: React.KeyboardEvent<
      HTMLTextAreaElement
    >
  ) {
    if (e.key === "Tab") {
      e.preventDefault();

      cycleCandidateForward();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      commitCurrentCandidate();
      return;
    }
  }

  function handleInputChange(
  value: string
  ) {
    setDisplayText(value);

    const newResults =
      convertSentence(value);

    setResults((current) =>
      mergeResults(
        current,
        newResults
      )
    );
  }

  function selectCandidate(
    wordIndex: number,
    candidateIndex: number
  ) {
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
    const selectedWord =
      results[wordIndex]
        ?.candidates[candidateIndex];
    const cursor = textareaRef.current?.selectionStart ?? 0;
        
    const newText =
      replaceActiveWord(
        displayText,
        wordIndex,
        selectedWord
      );

    setDisplayText(newText);

    requestAnimationFrame(() => {
      textareaRef.current?.setSelectionRange(
        cursor,
        cursor
      );
    });

    if (selectedWord) {
      userFrequency[selectedWord] =
        (userFrequency[selectedWord] ?? 0)
        + 1;

      saveUserFrequency(
        userFrequency
      );
    }
    setResults((current) =>
      current.map((word, index) => {
        if (index !== wordIndex) {
          return word;
        }

        return {
          ...word,
          selectedIndex: candidateIndex,
          converted: true,
          display:
            word.candidates[candidateIndex],
        };
      })
    );
  }

  function updateActiveWord(
    value: string,
    cursorPosition: number
  ) {
    const beforeCursor =
      value.slice(0, cursorPosition);

    const words =
      beforeCursor.split(/\s+/);

    const index =
      Math.max(0, words.length - 1);

    setActiveWordIndex(index);
  }

  return (
    <div
      style={{
        padding: "2rem",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <h1>Phonetosoji Translator</h1>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        {/* Input Panel */}
        <div
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <textarea
            ref={textareaRef}
            value={displayText}
            onChange={(e) => {
              handleInputChange(
                e.target.value
              );

              updateActiveWord(
                e.target.value,
                e.target.selectionStart
              );

              updatePopupPosition();
            }}
            onClick={(e) => {
              updateActiveWord(
                e.currentTarget.value,
                e.currentTarget.selectionStart
              );

              updatePopupPosition();
            }}
            onKeyDown={handleKeyDown}
           onKeyUp={(e) => {
              updateActiveWord(
                e.currentTarget.value,
                e.currentTarget.selectionStart
              );

              updatePopupPosition();
            }}
            placeholder="Type phonetosoji here..."
            style={{
              width: "100%",
              fontSize: "1.2rem",
              padding: "1rem",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: popupPosition.left,
              top: popupPosition.top,
              zIndex: 1000,
            }}
          >
            <CandidatePopup
              activeWord={activeWord}
            />
          </div>
          </div>
          <div
            style={{
              width: "200px",
              border: "1px solid #ccc",
              padding: "1rem",
            }}
          >
            <h3>
              Personal Dictionary
            </h3>

            <input
              placeholder="English"
              value={newEnglish}
              onChange={(e) =>
                setNewEnglish(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Phonetosoji"
              value={newPhonetosoji}
              onChange={(e) =>
                setNewPhonetosoji(
                  e.target.value
                )
              }
              style={{
                marginTop: "0.5rem",
              }}
            />

            <button
              onClick={addUserWord}
              style={{
                marginTop: "1rem",
                width: "100%",
              }}
            >
              Add Word
            </button>
            <h4>Custom Words</h4>
            <ul>
              {Object.entries(userDictionary)
                .flatMap(([phonetic, words]) =>
                  words.map((word) => ({
                    phonetic,
                    word,
                  }))
                )
                .map(({ phonetic, word }) => (
                  <li
                    key={`${phonetic}-${word}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                    }}
                  >
                    <span>
                      {phonetic} → {word}
                    </span>

                    <button
                      onClick={() =>
                        deleteUserWord(
                          phonetic,
                          word
                        )
                      }
                    >
                      X
                    </button>
                  </li>
                ))}
            </ul>

          
          
          {/* <div
            style={{
              marginTop: "1rem",
              padding: "0.5rem",
              border: "1px solid #ccc",
            }}
          >
            Active Word Index: {activeWordIndex}
          </div> */}
          
          
          {/* <div
            style={{
              marginTop: "1rem",
              padding: "0.5rem",
              border: "1px solid #ccc",
            }}
          >
            <strong>Raw Input:</strong>

            <p>{rawInput}</p>
          </div> */}
        </div>
        
        {/* <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <h3>Selected Words</h3>
          <DictionaryInspector />

          <p>
            {results
              .map((result) => result.display)
              .join(" ")}
          </p>
        </div> */}

        {/* Candidate Panel */}
        {/* <div
          style={{
            width: "350px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <h2>Matches</h2>

          <CandidateList
            results={results}
            activeWordIndex={activeWordIndex}
            onSelectCandidate={selectCandidate}
          />
        </div> */}
      </div>
    </div>
  );
}