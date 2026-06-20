import type { WordResult }
from "../types/ime";

interface Props {
  activeWord?: WordResult;
}

export default function CandidatePopup({
  activeWord,
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
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        marginTop: "8px",
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "6px",
        minWidth: "180px",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}
    >
      {activeWord.candidates.map(
        (candidate, index) => (
          <div
            key={candidate}
            style={{
              padding:
                "4px 8px",
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