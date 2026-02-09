export default function manifest() {
  return {
    name: "Pod Pirate",
    short_name: "PodPirate",
    description:
      "PodPirate is your ultimate destination for discovering, streaming, and managing your favorite podcasts. Set sail on an audio adventure with our intuitive platform, where you can explore a vast ocean of content, from the latest episodes to timeless classics.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1024",
    theme_color: "#3d5a80",
    id: "/",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
        purpose: "maskable",
      },
    ],
    lang: "en",
    dir: "auto",
    display_override: ["fullscreen", "minimal-ui", "standalone"],
    categories: ["personalization", "productivity", "utilities"],
    edge_side_panel: {
      preferred_width: 786,
    },
  };
}
