import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  // Populate your firebase configuration data here.
  apiKey: "AIzaSyAxLOOzzYl-kGDcW0lNAkXIMgN08DloFhs",
  authDomain: "voiceof-nation.firebaseapp.com",
  databaseURL: "https://voiceof-nation.firebaseio.com",
  projectId: "voiceof-nation",
  storageBucket: "voiceof-nation.appspot.com",
  messagingSenderId: "497176543156"
})

// Export the database for components to use.
// If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
export const db = firebaseApp.database()
