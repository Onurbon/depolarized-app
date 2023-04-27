import ONBOARDING_STEPS from "./steps";
import { Conversation, User } from "./types";

export const timeStatus = (conv: Conversation) => {
  const { startTime, terminated, terminatedAt } = conv;
  const now = Date.now();
  if (!startTime) {
    return {
      status: "Bug",
      details: "fix me",
    };
  }
  const start = startTime.toDate().getTime();
  if (now < start) {
    const days = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    return {
      status: "COMING UP",
      details: days === 1 ? "tomorrow" : `in ${days} days`,
    };
  }
  if (terminated) {
    const end = terminatedAt.toDate().getTime();
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return {
      status: "COMPLETED",
      details:
        days === 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`,
    };
  }
  const day = conv.currentDay!;
  const off = conv.firstTurnIsYes ? 0 : 1;
  const turn = (day + off) % 2 === 1 ? "yes" : "no";
  return {
    status: "ACTIVE",
    details: `round ${day} (${turn})`,
    turn,
    day,
  };
};

export const onboardingStepsLeft = (user: User) => {
  const completed = user.completedOnboardingSteps || [];
  return ONBOARDING_STEPS.filter((x) => !completed.includes(x.uid));
};
