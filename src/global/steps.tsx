import { OnboardingStep } from "./types";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    name: "Enter your name", uid: "addname", details:
      'Tip: you can add and change your name on the account page (this page) any time.' +
      'Your name will not be shown to other users but we will use it when corresponding with you. ' +
      'Using your real name is optional but may help us verify the credentials that you want associated with your account.'
  },
  {
    name: "Add a company email", uid: "addemail", details:
      'Tip: you can add an email on the account page (this page).'
  },
  {
    name: "Verify your email", uid: "verifemail", details:
      'Tip: an verification email is automatically sent after you add or change your email on the account page (this page).' +
      'Search your spam folder if necessary and follow the instructions to complete the verification.' +
      'You might need to refresh this page or close and reopen the app to see the change.'
  },
  {
    name: "Request one new credential", uid: "requestonecred", details:
      'Tip: scroll down to the bottom of the account page (this page) to find the list of your credentials.' +
      'You will also find a button to request new credentials.'
  },
  {
    name: "Open one completed conversation", uid: "openonecompleted", details:
      'Tip: you can look for completed conversations on the home page.'
  },
  {
    name: "Open one active conversation", uid: "openoneactive", details:
      'Tip: you can look for active conversations on the home page.'
  },
  {
    name: "Register to an upcoming conversation", uid: "registerupcoming", details:
      'Tip: you can look for upcoming conversations on the home page.'
  },
  {
    name: "Post an argument", uid: "postsomearg", details:
      'Tip: open an active conversation and scroll to the bottom of the page.'
  },
  {
    name: "Rate some argument", uid: "ratesomearg", details:
      'Tip: open an argument and look for an icon looking like a star, in the bottom of your screen.'
  },

];

export default ONBOARDING_STEPS