const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// eslint-disable-next-line max-len
exports.addRegistrantEurope = functions.region("europe-west3").https.onCall((data, context) => {
  const uid = context.auth.uid;
  if (uid !== null) {
    const doc = admin.firestore().doc(`/registrants/${uid}`);
    doc.set({
      email: context.auth.token.email,
      firstName: data.firstName,
      lastName: data.lastName,
      yearGroup: data.yearGroup,
      uid: uid,
      isAdmitted: false,
      hasPaid: false,
      transferring: false,
      registrationTime: admin.firestore.Timestamp.now(),
    });
  }
});

// eslint-disable-next-line max-len
exports.transferAdmissionEurope = functions.region("europe-west3").https.onCall((data, context) => {
  const uid = context.auth.uid;
  const toEmailQuery = admin
      .firestore()
      .collection("registrants")
      .where("email", "==", data.toEmail);
  toEmailQuery.get().then((querySnapshot) => {
    if (!(querySnapshot.docs.length < 1)) {
      const snapshot = querySnapshot.docs[0];
      const toUid = snapshot.data().uid;
      const toEmail = snapshot.data().email;
      admin.firestore().collection("transferLogs").add({
        fromEmail: context.auth.token.email,
        toEmail: toEmail,
        resolved: false,
      });
      const fromDoc = admin.firestore().doc(`/registrants/${uid}`);
      fromDoc.update({transferring: true});
      const toDoc = admin.firestore().doc(`/registrants/${toUid}`);
      toDoc.update({transferring: true});
    }
  });
});

// eslint-disable-next-line max-len
exports.addExtraRegistrantEurope = functions.region("europe-west3").https.onCall((data, context) => {
  const uid = context.auth.uid;
  if (uid !== null) {
    const doc = admin.firestore().doc(`/extraRegistration/${uid}`);
    doc.set({
      email: context.auth.token.email,
      uid: uid,
      admitted: false,
      registrationTime: admin.firestore.Timestamp.now(),
    });
  }
});

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
