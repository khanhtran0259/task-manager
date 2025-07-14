
const admin = require("firebase-admin");

const serviceAccount = require("./configFirebase.json");

admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://task-management-a4134-default-rtdb.asia-southeast1.firebasedatabase.app"
});
module.exports = admin.database();