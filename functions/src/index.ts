/* eslint-disable */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
admin.initializeApp();
const db = getFirestore();

// docs: https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const newUserSignup = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("users").doc(user.uid).set({
    name: user.displayName,
    phone: user.phoneNumber,
    email: user.email,
    credentials: [],
    // ...
  });
});

export const userDeleted = functions.auth.user().onDelete((user) => {
  return admin.firestore().collection("users").doc(user.uid).delete();
});

const update = (obj: any, key: string, delta: number) => {
  if (!obj[key]) obj[key] = 0;
  obj[key] += delta;
  if (!obj[key]) delete obj[key];
};

export const aggregateReviews = functions.firestore
  .document("conversations/{convId}/arguments/{argId}/reviews/{userId}")
  .onWrite(async (change, context) => {
    const { after, before } = change;

    // views
    const newView = !before.exists && after.exists;

    // edits
    const hasEditsBefore = before.exists && !!before.data()?.edits;
    const hasEditsAfter = after.exists && !!after.data()?.edits;

    // ratings
    const ratingsBefore = before.exists ? before.data()?.ratings || {} : {};
    const ratingAfter = after.exists ? after.data()?.ratings || {} : {};
    const addedRatings = Object.keys(ratingAfter).filter(
      (k) => !ratingsBefore[k]
    );
    const removedRatings = Object.keys(ratingsBefore).filter(
      (k) => !ratingAfter[k]
    );
    const changedRatings = Object.keys(ratingsBefore).filter(
      (k) => ratingAfter[k]
    );

    // flags
    const flagsBefore = before.exists ? before.data()?.flags || [] : [];
    const flagsAfter = after.exists ? after.data()?.flags || [] : [];
    const addedFlags = flagsAfter.filter((k: any) => !flagsBefore.includes(k));
    const removedFlags = flagsBefore.filter(
      (k: any) => !flagsAfter.includes(k)
    );

    // comments
    const commentsBefore = before.exists ? before.data()?.comments?.length : 0;
    const commentsAfter = after.exists ? after.data()?.comments?.length : 0;

    // start transaction...
    const { convId, argId } = context.params;
    const argRef = db.doc(`conversations/${convId}/arguments/${argId}`);
    await db.runTransaction(async (transaction) => {
      const argDoc = await transaction.get(argRef);
      const data = argDoc.data();

      // views
      const reviewers = (data!.reviewers || 0) + (newView ? 1 : 0);

      // edits
      let editCounts = data?.editCounts || 0;
      if (hasEditsBefore) editCounts--;
      if (hasEditsAfter) editCounts++;

      // ratings
      const ratingCounts = data?.ratingCounts || {};
      const ratingTotalStars = data?.ratingTotalStars || {};
      removedRatings.forEach((k) => {
        update(ratingCounts, k, -1);
        update(ratingTotalStars, k, -ratingsBefore[k]);
      });
      addedRatings.forEach((k) => {
        update(ratingCounts, k, 1);
        update(ratingTotalStars, k, ratingAfter[k]);
      });
      changedRatings.forEach((k) => {
        update(ratingTotalStars, k, ratingAfter[k] - ratingsBefore[k]);
      });

      // flags
      const flagCounts = data?.flagCounts || {};
      removedFlags.forEach((k: any) => {
        update(flagCounts, k, -1);
      });
      addedFlags.forEach((k: any) => {
        update(flagCounts, k, 1);
      });

      // comments
      let commentCounts = data?.commentCounts || 0;
      commentCounts -= commentsBefore;
      commentCounts += commentsAfter;

      // final update
      transaction.update(argRef, {
        ratingCounts,
        ratingTotalStars,
        flagCounts,
        commentCounts,
        editCounts,
        reviewers,
      });
    });
  });

export const someOtherFunc = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const countUserNotifications = functions.firestore
  .document("users/{userId}/notifications/{notificationId}")
  .onWrite(async (change, context) => {
    let delta = 0;
    if (change.before.exists) delta--;
    if (change.after.exists) delta++;
    const { userId } = context.params;
    const userRef = db.doc(`users/${userId}`);
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const userData = userDoc.data();
      const prev = userData?.notificationCounts || 0;
      transaction.update(userRef, {
        notificationCounts: prev + delta,
      });
    });
  });

export const checkStuffEveryMorning = functions.pubsub
  .schedule("15 9 * * *")
  .timeZone("Europe/London")
  .onRun((context) => {
    console.log("another test...");
    console.log("This will perhaps be run every day at 9:15am....");
    functions.logger.info("Hello from checkStuffEveryMorning", {
      structuredData: true,
    });
    functions.logger.info("Hello again  checkStuffEveryMorning with context", {
      context,
    });
    return null;
  });
