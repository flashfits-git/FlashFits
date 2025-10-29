import 'dotenv/config';

export default {
  expo: {
    name: "FlashFits",
    slug: "FlashFits",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "flashfits",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    extra: {
      BACKEND_URL: 'https://8e07274ed203.ngrok-free.app',
      eas: {
        projectId: "a8cfd82d-d3f4-49fc-9d46-f7b817bfbc45"
      }
    },
    
  },
};
