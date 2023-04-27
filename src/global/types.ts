type TimeStamp = any;

export type Conversation = {
  id?: string;
  topic: string;
  prompt: string;
  context: string;
  moderator?: string;
  startTime: TimeStamp;
  firstTurnIsYes: boolean;
  orderPrio: number;
  currentDay?: number;
  terminated?: boolean;
  terminatedAt?: TimeStamp;
  wasGenerated?: boolean;
};

export type User = {
  id?: string;
  uid: string;
  phoneNumber: string;
  email?: string;
  emailVerified: boolean;
  displayName: string;
  isAdmin?: boolean;
  completedOnboardingSteps: string[];
  viewedInfoModals: string[];
  joinedConversations: string[];
  chosenSide: { [conversationId: string]: "yes" | "no" | "both" };
  notificationCounts?: number;
};

export type CredentialRequest = {
  id?: string;
  userID: string;
  credential: string;
  credentialEmail: string;
  evidence: string;
  status: "requested" | "rejected" | "bounced" | "approved" | "norequest";
  comment?: string; // comment from reviewer
  requestedAt: any; // date
  phoneNumber?: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
};

export type Argument = {
  id?: string;
  winning?: boolean;
  wonAt?: TimeStamp;
  day: number;
  turn: "yes" | "no" | "moderator";
  credentials: string[];
  conversationID: string; // ref for Conversation
  message: string; // one-paragraph summary
  details?: string; // long form, more like a blog post
  author: string; // userID
  posted: TimeStamp;
  // metadata...
  upvotes?: number;
  downvotes?: number;
  comments?: string[];
  flagCounts?: any;
  commentCounts?: number;
  editCounts?: number;
  ratingCounts?: any;
  ratingTotalStars?: any;
  reviewers?: number;
  // moderate message after if winning...
  moderatorComment?: string;
  draft?: boolean;
};

export type ReviewEdits = {
  originalMessage: string;
  modifiedMessage: string;
  originalDetails: string;
  modifiedDetails: string;
};

export type Review = {
  id?: string;
  path?: string;
  flags: string[];
  ratings: { [key: string]: number };
  edits?: ReviewEdits; // latest edits...
  previousEdits?: ReviewEdits[]; // for older versions
  comments: string[];
  firstViewedAt?: any; // timestamp
};

export type OnboardingStep = {
  uid: string;
  name: string;
  details?: any; // can be JSX
  completed?: boolean;
};

export type AuthorFeedback = "thanks" | "ignore" | "spam";

export type Iteration = {
  uid: string; // will typically be some kind of hash of the comment...
  type: "edit" | "comment";
  reviewerId: string;
  authorFeedback: AuthorFeedback;
  processedAt: any; // timestamp
  comment?: string;
  edits?: ReviewEdits; // original proposal from reviewers
  authorEdits?: ReviewEdits; // actual edits from author
};

export type FeedbackType = "comment" | "edits" | "flag" | "ratings";

export type UserNotification = {
  id?: string;
  type:
    | "edits-used"
    | "comment-used"
    | "new-argument"
    | "next-round"
    | "some-feedback";
  time: any; // timestamp
  argumentId?: string;
  message?: string;
  conversationId?: string;
  prompt?: string;
  edits?: ReviewEdits; // original proposal from reviewers
  authorEdits?: ReviewEdits; // actual edits from author
  comment?: string;
  feedbackType?: FeedbackType;
};

export type ScratchpadDoc = {
  text: string;
  saved: string; // local date string...
};
