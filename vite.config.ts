import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "HALE - 여드름 시술 애프터케어",
        short_name: "HALE",
        description: "피부과 시술 후 AI 기반 맞춤형 사후 관리 서비스",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone", // 상단 주소창을 없애고 네이티브 앱처럼 보이게 함
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/icons.svg",
            sizes: "192x192",
            type: "image/svg",
          },
          {
            src: "/icons.svg",
            sizes: "512x512",
            type: "image/svg",
          },
          {
            src: "/icons.svg",
            sizes: "512x512",
            type: "image/svg",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
