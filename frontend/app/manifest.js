export default function manifest() {
  return {
    name: "DevSpark - Software Development Agency",
    short_name: "DevSpark",
    description:
      "We craft exceptional digital experiences that transform businesses and delight users.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
