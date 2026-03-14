import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.defaultTitle,
    short_name: "bastow.de",
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "browser",
    background_color: "#f5f5f5",
    theme_color: "#517fa6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
