import type { WordResult } from "../types/ime";

interface CandidateListProps {
  results: WordResult[];
  activeWordIndex: number;
  onSelectCandidate: (
    wordIndex: number,
    candidateIndex: number
  ) => void;
}

function CandidateList({
  results,
  activeWordIndex,
  onSelectCandidate,
}: CandidateListProps) {
  if (results.length === 0) {
    return <p>Start typing...</p>;
  }

  const activeWord = results[activeWordIndex];
  
  if (
    activeWord &&
    activeWord.candidates.length <= 1
    ) {
    return (
        <div>
        No candidate selection needed
        </div>
    );
    }

  if (!activeWord) {
    return <p>No active word</p>;
  }

  return (
    <div
      style={{
        padding: "0.75rem",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "0.5rem",
        }}
      >
        {activeWord.original}
      </div>

      {activeWord.candidates.length === 0 ? (
        <div>No matches</div>
      ) : (
        <div>
          {activeWord.candidates.map((word, index) => (
            <div
              key={`${activeWord.id}-${word}`}
              onClick={() =>
                onSelectCandidate(
                  activeWordIndex,
                  index
                )
              }
              style={{
                cursor: "pointer",
                padding: "4px 0",
                fontWeight:
                  index === activeWord.selectedIndex
                    ? "bold"
                    : "normal",
              }}
            >
              {word}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CandidateList;