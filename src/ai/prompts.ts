const recap: string = `
I'm going to give you the transcript of a debate.
Please summarize what has been said so far, highlighting which 
key arguments have been made on each side and where the two side still seem to disagree.
Use the past tense, and start with "QUICK RECAP:"
$TEXT
`;

const common_ground: string = `
I'm going to give you the transcript of a debate. 
Please try and find some points where the participants seem to agree.
Use the past tense and start with "COMMON GROUND:" 
$TEXT
`;

const next_directions: string = `
I'm going to give you the transcript of a debate.
I want you to act like a debate moderator and propose a two or three possible 
directions for this debate. For each direction, propose a clear question and 
try to explain why this would be an interesting thing to dig into.
$TEXT
`;

const ratings: string = `
I'm going to give you the transcript of a debate.
At the end of it you will find a last argument under "LAST ARGUMENT" 
and we would like to give the author some feedback on it. 
More specifically, we want to give him some ratings, in a scale of 1 to 5, 
on each of the following dimensions:

- Strong: Does the author make a strong and convincing case? (as opposed to, e.g. using hand-wavy arguments or boring platitude)
- Concise: Is this short and dense in information? (as opposed to feeling very long and slow to read)
- Respectful: Does the author sound like they are respecting people from the other side of the conversation?
- Factual: Is the arguments based on concrete facts? (as opposed to, e.g. being very subjective and ideological)

Please format the result as follows: 

Strong: x/5 - (some brief explanation...)
Concise: x/5 - (some brief explanation...)
Respectful: x/5 - (some brief explanation...)
Factual: x/5 - (some brief explanation...)

$TEXT
`;

const completeness: string = `
I'm going to give you the transcript of a debate.

Please provide a brief bullet point summary of the key claims made in the argument before last
(meaning the one provided under "ARGUMENT BEFORE LAST"). For each of these claims, look at 
whether the last argument (the one under "LAST ARGUMENT") included an answer. 

Write "ANSWERED" next the initial claims that were indeed answered, and provide a short 
summary of how it was addressed in the last argument.
Write "IGNORED?" next the claims which don't seem to have be recognized or addressed. 

Please format this using a numbered list and preface all this with a summary
saying "The last argument answered X our of Y main claims:"

$TEXT
`;

const strong_words: string = `
I'm going to give you the transcript of a debate and would like some feedback on 
the last argument (the one under "LAST ARGUMENT").

Looking at the arguments try and identify the 2-5 strongest words or 
expressions and explain why someone might find them exaggerated or even inappropriate.
You can also includes words and expressions that one might find "triggering" if/when 
taken out of context. 

Use a numbered list with blank lines between items.

Starts with a sentence like 
"This argument contains X expressions that may come up strong:", 
where X is the number of strong words or expressions that was found.

$TEXT
`;

const platitudes: string = `
I'm going to give you the transcript of a debate and would like some feedback on 
the last argument (the one under "LAST ARGUMENT").

Looking at this argument, try and identify which sentences or expressions sounds 
like unnecessary platitudes or boring general statements. We're particularly interested 
in finding sentences that are making the argument verbose or over-polite without 
adding anything useful.   

Use a numbered list with blank lines between items. 

Starts with a sentence like 
"This argument seems to contain X possible platitude", 
where X is the number of platitudes that were found. 

$TEXT
`;

const complexity: string = `
I'm going to give you the transcript of a debate and would like some feedback on 
the last argument (the one under "LAST ARGUMENT").

Looking at this argument, try and identify which parts maybe the most difficult for 
a reader to understand. We're interested in flagging complexity that may result from 
a sentence between too long, containing very complex words, using the passive voice 
for no good reason, using too many adverbs, using convoluted logic, or anything like that.  

Use a numbered list with blank lines between items. 

Starts with a sentence like "I have identified the following potential source of complexity in this argument:". 

$TEXT
`;

const tone_and_style: string = `
I'm going to give you the transcript of a debate and would like some feedback on 
the last argument (the one under "LAST ARGUMENT").

Looking at this argument, try and describe how this sounds in terms of tone and style.
For instance explain whether the author sounds angry, relaxed, curious, open, close-minded, 
lazy, conscientious, wise, naive, radical, woke, racist, fun, etc... 
When giving negative feedback with strong accusations (e.g. of racism or wokeness), 
try and give an explanation. Please also describe the general writing style. 

Use a numbered list, leaving some blank lines between items. Keep it short, with no more than 5 points. 

Starts with a sentence like "I would characterize the tone and style of this argument as follow:". 

$TEXT
`;

const describe_speaker: string = `
I'm going to give you the transcript of a debate and would like you to think about the
person who wrote the last argument (the one under "LAST ARGUMENT").

Looking at the argument that they wrote and the credentials they have given,
try and describe in a few words: 
- what this person might look like physically 
- what is their mood and style
- what may be their facial expression or posture

I want the output to be in the form of a prompt which I will be able to 
give to another AI called DALL-E, so it needs to be describing an image very clearly.  

Make sure to include the credentials of the author but don't include their name. 
Start with "DALL-E PROMPT: The speaker is...".
Also add the following sentence at the end: "Ultra realistic photo, high resolution."

$TEXT
`;

const congratulate_win: string = `
I'm going to give you the transcript of a debate and would like you to give really 
positive feedback to the person who wrote the last argument (the one under "LAST ARGUMENT").

Looking at their argument, you will congratulate them for having won the best argument and 
explain what was so great about it. 

Try and pick a fair and honest compliment and make sure it does not sound like cheap flattery.
But if several options are possible, try and pick the compliment which is most likely 
to help the author feel happy and proud.

Start with "Congratulations! You argument has won this round because..."

$TEXT
`;

const looser_prize: string = `
I'm going to give you the transcript of a debate and would like you to find some kind of 
prize to the person who wrote the last argument (the one under "LAST ARGUMENT").

The prize can be anything like "Best rebuttal", "Most persuasive", "Best delivery", 
"Most creative ", "Most factual", "Most knowledgeable", "Most pragmatic", "Most insightful" 
or you can use other adjectives. 

Try and pick a fair and honest compliment and make sure it does not sound like cheap flattery.

Start with "You did not win this round but you've been awarded the prize ... because ... "

$TEXT
`;

const next_arg = (style: string): string => `
I'm going to give you the transcript of a debate and would like you to help me draft 
the next argument. This must address the claims made in the last argument (the one under "LAST ARGUMENT") 
and made new claims to defend the other side of the debate. 

Provide the generated in this format: 

CREDENTIALS: ... 
SUMMARY: ... 
FULL ARGUMENT: ... 

A credential is like a title or diploma or anything relevant to establish the speaker's credibility. 
Speakers can have up to three credentials, separated by commas. 
The summary consist of a couple of sentences. 
The full argument must be at least a few paragraphs long.

${style}

$TEXT
`;

const next_arg_polite = next_arg(`
Be respectful, open minded and genuinely curious to understand the other side.  
Be factual and provide numbers where they can while citing their sources. 
`);

const next_arg_witty = next_arg(`
Your writing style is that of a very witty, smart and wise person who care 
a lot about making very precise and sharp arguments. The style is creative and 
a little bit edgy and humorous. Your are respectful, but not politically correct 
and don't hesitate to speak the truth. Your style is a little bit similar to 
that of Stephen Fry, Churchill, Oscar Wilde, Mark Twain or Tina Fey. 
You avoid platitudes but you like to make your writings entertaining. 
`);

const next_arg_cringe = next_arg(`
Your arguments you choose to make are (discreetly) chosen to provoke the other side, 
essentially telling things that is going to make them cringe. You are no a 
full blown troll nor a terrible person but you're clearly on the contrarian 
side and you are just annoying enough that some people feel the urge to 
correct you. You try and sound factual but the arguments you make are all a little 
bit hand-wavy and ideological. 
`);

const next_arg_bombastic = next_arg(`
Your style is bombastic and similar to that of Donald Trump or Andrew Tate.  
You make bold and exaggerated statements with a lot of energy. 
`);

const add_references = `
I'm going to give you the transcript of a debate.
At the end of it you will find a last argument under "LAST ARGUMENT" and we would like to give the author some feedback on it. 

Please identify which claims in this argument would be worth backing up with references and provide examples of precise references, preferably with links. Present the suggestions in bullet points and try to remain concise. 

$TEXT

`;

export const promptsTree = [
  {
    categoryName: "Feedback for last author",
    prompts: [
      { uid: "complex", name: "Complexity", prompt: complexity },
      { uid: "complete", name: "Completeness", prompt: completeness },
      { uid: "ratings", name: "Ratings", prompt: ratings },
      { uid: "string", name: "Strong words", prompt: strong_words },
      { uid: "platitudes", name: "Platitudes", prompt: platitudes },
      { uid: "tone", name: "Tone & Style", prompt: tone_and_style },
      { uid: "reference", name: "Add references", prompt: add_references },
    ],
  },
  {
    categoryName: "Prepare to end round",
    prompts: [
      { uid: "win", name: "Congratulate Win", prompt: congratulate_win },
      { uid: "loose", name: "Looser's Prize", prompt: looser_prize },
    ],
  },
  {
    categoryName: "Moderation message",
    prompts: [
      { uid: "recap", name: "Recap", prompt: recap },
      { uid: "common", name: "Common Ground", prompt: common_ground },
      { uid: "direction", name: "Next direction", prompt: next_directions },
    ],
  },
  {
    categoryName: "Kick off next round",
    prompts: [
      {
        uid: "polite",
        name: "Next argument (Polite)",
        prompt: next_arg_polite,
      },
      { uid: "witty", name: "Next argument (Witty)", prompt: next_arg_witty },
      {
        uid: "cringe",
        name: "Next argument (Cringe)",
        prompt: next_arg_cringe,
      },
      {
        uid: "strong",
        name: "Next argument (Strong)",
        prompt: next_arg_bombastic,
      },
    ],
  },
  {
    categoryName: "Miscellaneous",
    prompts: [{ uid: "face", name: "Speaker Face", prompt: describe_speaker }],
  },
];
