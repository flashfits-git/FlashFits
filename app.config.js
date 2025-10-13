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
      BACKEND_URL: 'https://55a299101e7c.ngrok-free.app',
    },
  },
};
