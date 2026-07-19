import type { WordResult } from "../types/ime";

interface Props {
  activeWord?: WordResult;
  onCommitCandidate: (
    candidateIndex: number
  ) => void;
}

export default function CandidatePopup({
  activeWord,
  onCommitCandidate,
}: Props) {
  if (!activeWord) {
    return null;
  }

  if (
    activeWord.candidates.length <= 1
  ) {
    return null;
  }

  return (
    <div
      role="listbox"
      aria-label={`Candidates for ${activeWord.original}`}
      style={{
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "6px",
        minWidth: "180px",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          color: "#666",
          padding: "2px 8px 6px",
          borderBottom: "1px solid #eee",
          marginBottom: "4px",
        }}
      >
        {activeWord.original}
      </div>

      {activeWord.candidates.map(
        (candidate, index) => (
          <div
            key={`${candidate}-${index}`}
            role="option"
            aria-selected={
              index ===
              activeWord.selectedIndex
            }
            onMouseDown={(e) => {
              e.preventDefault();
              onCommitCandidate(index);
            }}
            style={{
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              background:
                index ===
                activeWord.selectedIndex
                  ? "#ddd"
                  : "transparent",
              fontWeight:
                index ===
                activeWord.selectedIndex
                  ? "bold"
                  : "normal",
            }}
          >
            {candidate}
          </div>
        )
      )}
    </div>
  );
}
