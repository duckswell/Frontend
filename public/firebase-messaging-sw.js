importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyBRe7sFc-V9OPuRtUXqGRoi8yl8rz_buyQ",
  authDomain: "duckswell-70e59.firebaseapp.com",
  projectId: "duckswell-70e59",
  storageBucket: "duckswell-70e59.firebasestorage.app",
  messagingSenderId: "220891791796",
  appId: "1:220891791796:web:c9ccec25e9c8cb67f5b2e1",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[sw.js] 백그라운드 메시지 수신 완료:", payload);
});
