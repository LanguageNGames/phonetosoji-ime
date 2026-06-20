import {useEffect,useRef,useState} from "react";
import { convertSentence } from "./utils/convertSentence";
import { mergeResults } from "./utils/mergeResults";
import { userFrequency, saveUserFrequency } from "./data/userFrequency";
import { replaceActiveWord } from "./utils/replaceActiveWord";
import CandidatePopup from "./components/CandidatePopup";
import getCaretCoordinates from "textarea-caret";



export default function App() {
  const [displayText, setDisplayText] = useState("");
  const [results, setResults] = useState(convertSentence(""));
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const textareaRef =useRef<HTMLTextAreaElement>(null);
  const activeWord = results[activeWordIndex];
  const [popupPosition, setPopupPosition] = useState({top: 0, left: 0,});

  /* useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.setSelectionRange(
      caret.start,
      caret.end
    );
  }, [displayText]); */

  /* useEffect(() => {
    setDisplayText(
      buildDisplayText(results)
    );
  }, [results]); */

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
              minHeight: "400px",
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