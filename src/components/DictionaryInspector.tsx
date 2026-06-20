import { useState } from "react";
import { dictionary } from "../data/dictionary";

function DictionaryInspector() {
  const [search, setSearch] =
    useState("");

  const results = dictionary.filter(
    (entry) =>
      entry.english
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      entry.phonetosoji
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Dictionary Inspector</h2>

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search..."
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
        }}
      />

      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {results.map((entry) => (
          <div
            key={
              entry.english +
              entry.phonetosoji +
              (entry.marker ?? "")
            }
            style={{
              borderBottom:
                "1px solid #ddd",
              padding: "0.5rem 0",
            }}
          >
            <div>
              <strong>
                {entry.english}
              </strong>
            </div>

            <div>
              {entry.phonetosoji}
              {entry.marker
                ? `=${entry.marker}`
                : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DictionaryInspector;