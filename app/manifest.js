export default function manifest() {
  return {
    name: "Daylight — Todo List",
    short_name: "Daylight",
    description: "A calm, minimal todo app with category and priority tagging.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f1e9",
    theme_color: "#203b42",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
