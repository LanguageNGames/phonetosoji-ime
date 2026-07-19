import {
  useEffect,
  useRef,
  useState,
} from "react";

import getCaretCoordinates from "textarea-caret";

import CandidatePopup from "./components/CandidatePopup";

import { convertSentence } from "./utils/convertSentence";
import { mergeResults } from "./utils/mergeResults";

import {
  getActiveTokenIndex,
  getTokenRanges,
} from "./utils/tokenRanges";

import {
  applyOriginalPunctuation,
  parsePhonetosojiToken,
} from "./utils/parsePhonetosojiToken";

import {
  userFrequency,
  saveUserFrequency,
} from "./data/userFrequency";

import {
  loadUserDictionary,
  saveUserDictionary,
} from "./data/userDictionary";

export default function App() {
  const [displayText, setDisplayText] =
    useState("");

  const [results, setResults] =
    useState(convertSentence(""));

  const [
    activeWordIndex,
    setActiveWordIndex,
  ] = useState<number>(0);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const activeWord =
    results[activeWordIndex];

  const [
    popupPosition,
    setPopupPosition,
  ] = useState({
    top: 0,
    left: 0,
  });

  const [
    userDictionary,
    setUserDictionary,
  ] = useState(loadUserDictionary());

  const [
    newEnglish,
    setNewEnglish,
  ] = useState("");

  const [
    newPhonetosoji,
    setNewPhonetosoji,
  ] = useState("");

  useEffect(() => {
    updatePopupPosition();
  }, [displayText, activeWordIndex]);

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
        getComputedStyle(textarea).lineHeight,
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

  function updateResultsForText(
    value: string
  ) {
    const newResults =
      convertSentence(value);

    setResults((current) =>
      mergeResults(
        current,
        newResults
      )
    );
  }

  function autoConvertSingleCandidateTokens(
    value: string,
    cursorPosition: number
  ): {
    text: string;
    cursorPosition: number;
  } {
    const ranges =
      getTokenRanges(value);

    if (ranges.length === 0) {
      return {
        text: value,
        cursorPosition,
      };
    }

    const wordResults =
      convertSentence(value);

    let text = value;
    let adjustedCursor =
      cursorPosition;

    for (
      let index = ranges.length - 1;
      index >= 0;
      index -= 1
    ) {
      const range = ranges[index];
      const result = wordResults[index];

      if (
        !range ||
        !result ||
        result.candidates.length !== 1
      ) {
        continue;
      }

      const parsed =
        parsePhonetosojiToken(
          range.text
        );

      const hasWhitespaceAfter =
        range.end < value.length &&
        /\s/.test(value[range.end]);

      const hasFinalPunctuation =
        parsed.suffix.length > 0;

      const cursorInsideToken =
        cursorPosition >= range.start &&
        cursorPosition <= range.end;

      const tokenIsStillBeingTyped =
        cursorInsideToken &&
        !hasFinalPunctuation &&
        !hasWhitespaceAfter;

      if (tokenIsStillBeingTyped) {
        continue;
      }

      const replacement =
        applyOriginalPunctuation(
          range.text,
          result.candidates[0]
        );

      if (replacement === range.text) {
        continue;
      }

      text =
        text.slice(0, range.start) +
        replacement +
        text.slice(range.end);

      const delta =
        replacement.length -
        range.text.length;

      if (range.end <= adjustedCursor) {
        adjustedCursor += delta;
      } else if (
        range.start < adjustedCursor &&
        range.end > adjustedCursor
      ) {
        adjustedCursor =
          range.start + replacement.length;
      }
    }

    return {
      text,
      cursorPosition: Math.max(
        0,
        Math.min(
          adjustedCursor,
          text.length
        )
      ),
    };
  }

  function updateActiveWord(
    value: string,
    cursorPosition: number
  ) {
    setActiveWordIndex(
      getActiveTokenIndex(
        value,
        cursorPosition
      )
    );
  }

  function setCandidateSelection(
    wordIndex: number,
    candidateIndex: number
  ) {
    setResults((current) =>
      current.map((word, index) => {
        if (index !== wordIndex) {
          return word;
        }

        if (
          word.candidates.length === 0
        ) {
          return word;
        }

        const safeIndex =
          Math.max(
            0,
            Math.min(
              candidateIndex,
              word.candidates.length - 1
            )
          );

        return {
          ...word,
          selectedIndex: safeIndex,
          display:
            word.candidates[safeIndex],
        };
      })
    );
  }

  function cycleCandidateForward() {
    const word =
      results[activeWordIndex];

    if (
      !word ||
      word.candidates.length <= 1
    ) {
      return;
    }

    const nextIndex =
      (word.selectedIndex + 1) %
      word.candidates.length;

    setCandidateSelection(
      activeWordIndex,
      nextIndex
    );
  }

  function commitCandidate(
    wordIndex: number,
    candidateIndex: number
  ) {
    const word =
      results[wordIndex];

    if (!word) {
      return;
    }

    const selectedWord =
      word.candidates[candidateIndex];

    if (!selectedWord) {
      return;
    }

    const ranges =
      getTokenRanges(displayText);

    const range =
      ranges[wordIndex];

    if (!range) {
      return;
    }

    const replacement =
      applyOriginalPunctuation(
        word.original,
        selectedWord
      );

    const before =
      displayText.slice(0, range.start);

    const after =
      displayText.slice(range.end);

    const needsSpace =
      after.length === 0 ||
      !/^\s/.test(after);

    const inserted =
      replacement +
      (needsSpace ? " " : "");

    const newText =
      before +
      inserted +
      after;

    const newCursorPosition =
      range.start + inserted.length;

    setDisplayText(newText);
    setResults(convertSentence(newText));

    userFrequency[selectedWord] =
      (userFrequency[selectedWord] ?? 0) + 1;

    saveUserFrequency(userFrequency);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(
        newCursorPosition,
        newCursorPosition
      );

      updateActiveWord(
        newText,
        newCursorPosition
      );

      updatePopupPosition();
    });
  }

  function commitCurrentCandidate() {
    const word =
      results[activeWordIndex];

    if (
      !word ||
      word.candidates.length === 0
    ) {
      return;
    }

    commitCandidate(
      activeWordIndex,
      word.selectedIndex
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

    if (
      e.key === "Enter" &&
      activeWord &&
      activeWord.candidates.length > 0
    ) {
      e.preventDefault();
      commitCurrentCandidate();
    }
  }

  function handleInputChange(
    value: string,
    cursorPosition: number
  ) {
    const autoConverted =
      autoConvertSingleCandidateTokens(
        value,
        cursorPosition
      );

    setDisplayText(
      autoConverted.text
    );

    updateResultsForText(
      autoConverted.text
    );

    updateActiveWord(
      autoConverted.text,
      autoConverted.cursorPosition
    );

    requestAnimationFrame(() => {
      textareaRef.current?.setSelectionRange(
        autoConverted.cursorPosition,
        autoConverted.cursorPosition
      );

      updatePopupPosition();
    });
  }

  function normalizeEnglishWord(
    value: string
  ) {
    const trimmed =
      value.trim();

    if (
      trimmed.toLowerCase() === "i"
    ) {
      return "I";
    }

    return trimmed.toLowerCase();
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
      normalizeEnglishWord(
        newEnglish
      );

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

    setUserDictionary(updated);
    saveUserDictionary(updated);

    setNewEnglish("");
    setNewPhonetosoji("");

    setResults(
      convertSentence(displayText)
    );
  }

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

    setUserDictionary(updated);
    saveUserDictionary(updated);

    setResults(
      convertSentence(displayText)
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <h1>
        Phonetosoji Translator
      </h1>

      <p
        style={{
          marginTop: "-0.5rem",
          color: "#555",
        }}
      >
        Type Phonetosoji. Single-match words convert
        automatically; press Tab to cycle choices
        and Enter to commit ambiguous words.
      </p>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <textarea
            ref={textareaRef}
            value={displayText}
            onChange={(e) =>
              handleInputChange(
                e.target.value,
                e.target.selectionStart
              )
            }
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
            placeholder="Type Phonetosoji here..."
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            style={{
              width: "100%",
              minHeight: "220px",
              fontSize: "1.2rem",
              lineHeight: "1.6",
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
            {activeWord &&
              activeWord.candidates.length > 1 && (
                <CandidatePopup
                  activeWord={activeWord}
                  onCommitCandidate={(candidateIndex) =>
                    commitCandidate(
                      activeWordIndex,
                      candidateIndex
                    )
                  }
                />
              )}
          </div>
        </div>

        <div
          style={{
            width: "240px",
            border: "1px solid #ccc",
            borderRadius: "8px",
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
            style={{
              width: "100%",
              boxSizing: "border-box",
            }}
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
              width: "100%",
              boxSizing: "border-box",
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

          <h4>
            Custom Words
          </h4>

          <ul
            style={{
              paddingLeft: "1rem",
            }}
          >
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
                    marginBottom: "0.35rem",
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
                    aria-label={`Delete ${word}`}
                  >
                    X
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
