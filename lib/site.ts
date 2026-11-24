/**
 * Single source of truth for frequently edited external destinations and
 * identifiers. Reference these instead of hardcoding URLs in components.
 */
export const siteConfig = {
  url: "https://sidmofya.com",
  motif54Url: "https://motif54.com",
  copperCloudUrl: "https://coppercloud.ai",
  aiResearchUrl: "https://ai.sidmofya.com",
  copperResearchUrl: "https://ai.sidmofya.com/copper",
  partnerRoomUrl: "https://partnerroom.sidmofya.com",
  linkedinUrl: "https://www.linkedin.com/in/sidmofya",
  sovereignTeaUrl:
    "https://www.linkedin.com/newsletters/sovereign-tea-6995822130919550977/",
  contactEmail: "sid@sidmofya.com",
  kwazuriSignupTag: "kwazuri_interest",
} as const;

export const mainSiteShareImage = {
  url: "/sid-mofya-social.png",
  width: 1200,
  height: 630,
  alt: "Sid Mofya | Capital, Infrastructure & Story",
} as const;

export function currentYear() {
  return new Date().getFullYear();
}
