import type { Metadata } from "next";
import StealthOverlayContent from "./StealthOverlayContent";

export const metadata: Metadata = {
  title: "Zoom-Invisible Stealth HUD Overlay | CrackTheLoop",
  description:
    "Excludes the assistance overlay window from screen share platforms including Zoom, Teams, Meet, Slack, and OBS. Built with native Win32 Display Affinity exclusion systems.",
  keywords: [
    "stealth overlay HUD",
    "Zoom invisible screen share",
    "Win32 Display Affinity bypass",
    "interview assistant overlay",
    "proctoring safe interview helper",
  ],
};

export default function StealthOverlayPage() {
  return <StealthOverlayContent />;
}
