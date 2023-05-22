# Depolarized App

Depolarized is a social application designed to encourage deep and balanced conversations on complex topics while leveraging modern LLMs to simplify (and eventually automate some of) the work of moderators and facilitators. 

### Quick overview

https://github.com/Onurbon/depolarized-app/assets/3934784/d43b44ac-636f-4442-a837-26d312e2980f

## Conversation format

- The conversations have two sides and are moderated by admin users (aka facilitators)
- The facilitators can use LLMs in a custom-built AI playground (pre-loaded with the conversation's history) to prepare helpful feedback for contributors
- Contributors from each side are encouraged to collaborate on producing strong arguments while demonstrating openness, curiosity and respect for the other side
- Users can suggest specific changes, which are shown to the author as a "diff" in the UI, and the author can then accept or reject the changes
- Users can also vote, rank and comment on arguments
- The facilitator eventually decides manually the winning argument for each round (although, the plan would have been to automate this)

See also `./SCREENSHOTS.md` for screenshots.

## Examples of AI features

The AI playground can be accessed by any admin user on desktop by clicking the "AI Playground" button on the top right. This will open a side panel with some buttons corresponding to different prompts. Below is a short description of some of the prompts that we have found useful during beta testing.

- **Complexity** - look for sources of complexity in the last argument
- **Completeness** - check that it answers all the points made by the previous author
- **Ratings** - rate the argument (is it strong, concise, respectful and factual)
- **Strong words** - look for expressions or phrases which may be exaggerations
- **Platitudes** - look for expressions or phrases which are too vague or generic
- **Tone & Style** - how does the author "sound" (e.g. dismissive, aggressive, relax...)
- **Add references** - suggest links and references to back up the claims made in the argument
- **Congratulate Win** - prepare a message to congratulate the author for winning the round
- **Loozer's Prize** - explain politely to the author that they didn't win this time
- **Recap** - short summary of what different authors have argued so far
- **Common Ground** - find some points of agreement between the last two authors
- **Next direction** - propose 2-3 possible directions for the rest of the conversation
- **Next argument (X)** - what might the next contributor write as a response (in style X)
- **Speaker face** - (just to play with DALL-E) guess what the author might looks like

You can see and extend the list of prompts in `./src/ai/prompts`.

## About the code

Depolarized was built as a progressive web app with **TypeScript**, **React**, **Tailwind**, **Firebase** and **ChatGPT**. 

### Disclaimer 

You're looking at a prototype, not a production-ready app. It was built in a couple of weeks in Feb 2023 to test some product ideas. Most features seemed to work during beta testing, but you should expect plenty of bugs and rough edges.

### How to run

1. Set up a [Firebase](https://firebase.google.com/) project with Firestore, Functions, Phone Auth and a Blaze plan
2. Set up an [OpenAI](https://platform.openai.com/) account for ChatGPT (**warning**: your key is used in the front-end, so you'll want to set some strict [usage limits](https://platform.openai.com/account/billing/limits))
3. Look at `./src/secrets.ts` to find the list of required variables and create a `.env.local` file to populate them
4. Run `npm start` to start the app locally or `firebase deploy` to deploy to production
5. Sign up with a phone number using any 6-digit code as invite code
6. In the Firestore UI, look at the new document in the `users` collection and manually set the `isAdmin` field to `true`
7. As an admin user you'll then be able to initiate conversations, moderate conversations and use the AI playground.

### Technical pointers

If you came here for the code (rather than the product or the AI prompts), here are some bits you might find interesting:

- The UI state is managed in `./src/global` using Redux-like patterns (synchronous global state and actions) but without any heavy framework, and only using `immer` to minimize boilerplate.
- The component `./src/components/InfoModal.tsx` made it super easy to document everything in the app with smart info bubbles and carousels.
- The UI components in `./src/components` are all built with Tailwind and are fully responsive. One new trick I learnt was to extend existing React prop types to (e.g. `extends React.ComponentPropsWithoutRef<"button">`) to make sure that the components are fully compatible with the original HTML elements.
- The app is aware of its current bundle version and will automatically invite user refresh the page when a new version is deployed. The magic for that is in `./src/refresh.tsx`.
- The home page (`./src/pages/home`) responds nicely to different screen sizes, using two separate screens on mobile and a single-screen layout with two columns on larger screens (similar to WhatsApp's desktop app).
- Some notifications are sent to users (inside the app) when they receive feedback from others (e.g. comments or suggested edits). The code is in `./src/pages/notifications`.
- All the reviews (ratings, comments, edits) made on an argument are aggregated by the `aggregateReviews` function in `./functions/src/index.ts`. This one took a while because debugging Firebase Functions is still painfully slow, even when using a local test environment.

### Known issues

Many things could have been done better. Just to list a few:

- The extra abstraction in the file `./src/firebase.ts` was probably unnecessary. It would have been best to just use the firebase libraries directly.
- It would have also been better to add a `className` prop to Tailwind components like `Button` to make them more flexible (instead of introducing many variations like `ButtonSmall`, `ButtonSmallGrey`,...).
- The Firebase rules in `./firestore.rules` were written in a rush but they should be improved to prevent users from accessing data they shouldn't be able to access.

## Credits

This work was done in collaboration with Andrew Lewis-Pye, who made major contributions to the product's designs and recruited many of the beta testers, who in turn contributed to the project with their feedback and ideas.
