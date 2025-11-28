export const gdscriptKeywords = [
  "if",
  "else",
  "for",
  "while",
  "func",
  "var",
  "const",
  "class_name",
  "extends",
  "signal",
  "match",
  "return",
  "break",
  "continue",
  "await"
];

export const gdscriptLanguageConfiguration = {
  comments: {
    lineComment: "#"
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string"] }
  ]
};

export const gdscriptMonarchTokens = {
  tokenizer: {
    root: [
      [/#.*/, "comment"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      [/[a-zA-Z_]\w*/, {
        cases: {
          "@keywords": "keyword",
          "@default": "identifier"
        }
      }],
      [/[{}()\[\]]/, "@brackets"],
      [/[0-9]+/, "number"],
      [/[=+\-*/]/, "operator"]
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
    ]
  },
  keywords: gdscriptKeywords
};

