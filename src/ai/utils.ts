import dedent from "dedent";

export type Message = {
  name: string;
  credentials: string;
  side: "yes" | "no";
  message: string;
};

export type Input = {
  prompt?: string;
  intro?: string;
  summary: string; // of previous arguments
  prev?: Message; // argument just before if any
  last: Message; // latest message
};

export const messageToString = (prefix: string, o: any) => dedent`
  -----------------
  ${prefix}\n[${o.name}, ${o.credentials} - arguing ${o.side}]:\n\n  
  ${o.message}\n\n
  `;

export const inputToString = (input: Input) =>
  dedent`
  ----------------------
  PROMPT: ${input.prompt}\n
  ----------------------
  INTRODUCTION:\n\n ${input.intro}\n 
  -----------------
  SUMMARY OF FIRST EXCHANGES:\n\n  ${input.summary} \n\n` +
  (input.prev ? messageToString("ARGUMENT BEFORE LAST", input.prev) : "") +
  messageToString("LAST ARGUMENT", input.last);
