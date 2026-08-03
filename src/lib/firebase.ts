import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBRe7sFc-V9OPuRtUXqGRoi8yl8rz_buyQ",
  authDomain: "duckswell-70e59.firebaseapp.com",
  projectId: "duckswell-70e59",
  storageBucket: "duckswell-70e59.firebasestorage.app",
  messagingSenderId: "220891791796",
  appId: "1:220891791796:web:c9ccec25e9c8cb67f5b2e1",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestFcmToken = async (): Promise<string | null> => {
  try {
    if (!("Notification" in window)) {
      console.warn("⚠️ 이 브라우저는 알림을 지원하지 않습니다.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("⚠️ 알림 권한이 거부되었습니다.");
      return null;
    }
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const readyRegistration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey:
        "BGiKpE2NHPF86DEOdyTWxy4-8K3GMV9UQj7WTEH8LEUezDvjZztkksFjzPw1LL9TPzUdWhWUxsMHwtUXWNfRTsg",
      serviceWorkerRegistration: readyRegistration,
    });

    if (token) {
      console.log(
        "[테스트용] 발급된 FCM 토큰 (복사해서 Firebase 콘솔에 입력):",
        token,
      );
      localStorage.setItem("fcm_token", token);
      return token;
    }

    return null;
  } catch (error) {
    console.error("FCM 토큰 발급 실패:", error);
    return null;
  }
};

export const onForegroundMessage = () => {
  onMessage(messaging, (payload) => {
    console.log("포그라운드 메시지 수신:", payload);

    if (Notification.permission === "granted") {
      new Notification(payload.notification?.title || "알림", {
        body: payload.notification?.body,
        icon: "/pwa-192x192.png",
      });
    }
  });
};
