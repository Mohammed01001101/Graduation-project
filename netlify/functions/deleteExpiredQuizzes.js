const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.scheduledDeleteExpiredQuizzes = functions.pubsub
  .schedule("every 24 hours") // مرة يوميًا
  .onRun(async (context) => {
    const now = new Date();

    const expiredQuizzes = await db.collection("groupQuizzes")
      .where("expiresAt", "<", now)
      .get();

    if (expiredQuizzes.empty) {
      console.log("✅ لا توجد اختبارات منتهية.");
      return null;
    }

    const batch = db.batch();

    expiredQuizzes.forEach(doc => {
      batch.delete(doc.ref);
      console.log(`🗑️ حذف: ${doc.id}`);
    });

    await batch.commit();
    console.log(`✅ تم حذف ${expiredQuizzes.size} اختبار منتهي.`);

    return null;
  });
