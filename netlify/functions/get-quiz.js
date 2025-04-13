const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase admin only once
let app;
if (!app) {
  app = initializeApp({
    credential: applicationDefault(),
  });
}

const db = getFirestore();

exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing quiz code' }),
    };
  }

  try {
    const docRef = db.collection('groupQuizzes').doc(code);
    const doc = await docRef.get();

    if (!doc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Quiz not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(doc.data()),
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};
