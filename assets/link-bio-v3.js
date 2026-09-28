(() => {
  "use strict";

  const CANONICAL_URL = window.location.href;
  const params = new URLSearchParams(window.location.search);
  const languageButtons = Array.from(document.querySelectorAll(".language-button[data-language]"));
  const shareButton = document.getElementById("share-button");
  const shareStatus = document.getElementById("share-status");
  const profileTitle = document.getElementById("profile-title");

  let currentLanguage = "en";

  const copy = {
    en: {
      brand: "Recep Özcan",
      pageTitle: "Recep Özcan | Official Links",
      officialLinks: "Official links",
      share: "Share",
      shareAria: "Share Profile",
      tagline: "Wedding Documentary & Event Photographer & Videographer",
      subline: "Photoshop, Premiere Pro, After Effects",
      portfolioTitle: "Portfolio",
      portfolioDetail: "Coming soon",
      linkedinTitle: "LinkedIn",
      linkedinDetail: "Coming soon",
      instagramTitle: "Instagram",
      instagramDetail: "@receppozcann",
      recArtTitle: "Rec Art Wedding",
      recArtDetail: "@recartajans",
      siriusTitle: "SİRİUS DAVET EVİ",
      siriusDetail: "@siriusdavetsalonu",
      contactTitle: "WhatsApp",
      contactDetail: "Message me on WhatsApp",
      disclaimer: "Wedding Documentary & Event Photography Portfolio.",
      privacy: "",
      shareOpened: "Share menu opened.",
      linkCopied: "Link Copied!",
      copyFailed: "Copy failed."
    },
    tr: {
      brand: "Recep Özcan",
      pageTitle: "Recep Özcan | Resmî Bağlantılar",
      officialLinks: "Resmî bağlantılar",
      share: "Paylaş",
      shareAria: "Profili paylaş",
      tagline: "Wedding Documentary & Event Photographer & Videographer",
      subline: "Photoshop, Premiere Pro, After Effects",
      portfolioTitle: "Portfolyo",
      portfolioDetail: "Yakında eklenecek",
      linkedinTitle: "LinkedIn",
      linkedinDetail: "Yakında eklenecek",
      instagramTitle: "Instagram",
      instagramDetail: "@receppozcann",
      recArtTitle: "Rec Art Wedding",
      recArtDetail: "@recartajans",
      siriusTitle: "SİRİUS DAVET EVİ",
      siriusDetail: "@siriusdavetsalonu",
      contactTitle: "WhatsApp",
      contactDetail: "WhatsApp üzerinden iletişime geçin",
      disclaimer: "Düğün Belgeseli ve Etkinlik Fotoğrafçılığı Portfolyosu.",
      privacy: "",
      shareOpened: "Paylaşım menüsü açıldı.",
      linkCopied: "Bağlantı Kopyalandı! ✓",
      copyFailed: "Kopyalama başarısız oldu."
    }
  };

  const t = key => copy[currentLanguage][key] || copy.en[key] || key;
  const text = (selector, key) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = t(key);
  };

  const applyLanguage = (language, { persist = false } = {}) => {
    const nextLanguage = language === "tr" ? "tr" : "en";
    currentLanguage = nextLanguage;
    document.documentElement.lang = nextLanguage;

    languageButtons.forEach(button => {
      button.setAttribute("aria-pressed", button.dataset.language === nextLanguage ? "true" : "false");
    });

    profileTitle.textContent = t("brand");
    document.title = t("pageTitle");
    text("#eyebrow-text", "officialLinks");
    text("#share-label-text", "share");
    shareButton.setAttribute("aria-label", t("shareAria"));
    text("#tagline-text", "tagline");
    text("#subline-text", "subline");

    text("#portfolioTitle", "portfolioTitle");
    text("#portfolioDetail", "portfolioDetail");
    
    text("#linkedinTitle", "linkedinTitle");
    text("#linkedinDetail", "linkedinDetail");

    text("#instagramTitle", "instagramTitle");
    text("#instagramDetail", "instagramDetail");

    text("#recArtTitle", "recArtTitle");
    text("#recArtDetail", "recArtDetail");

    text("#siriusTitle", "siriusTitle");
    text("#siriusDetail", "siriusDetail");

    text("#contactTitle", "contactTitle");
    text("#contactDetail", "contactDetail");

    text("#footer-disclaimer", "disclaimer");
    

    if (persist) {
      try { localStorage.setItem("recep-language", nextLanguage); } catch (_) {}
    }
  };

  const savedLanguage = () => {
    try {
      const value = localStorage.getItem("recep-language");
      return value === "tr" || value === "en" ? value : "";
    } catch (_) { return ""; }
  };

  const browserLanguage = () =>
    (navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "en";

  const chooseInitialLanguage = () => {
    const explicit = params.get("lang");
    if (explicit === "tr" || explicit === "en") return explicit;
    const saved = savedLanguage();
    if (saved) return saved;
    return browserLanguage();
  };

  const announce = message => {
    shareStatus.textContent = "";
    window.setTimeout(() => { shareStatus.textContent = message; }, 20);
  };

  const wireEvents = () => {
    languageButtons.forEach(button => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.language, { persist: true });
      });
    });

    shareButton.addEventListener("click", async () => {
      const shareData = { title: t("brand"), text: t("tagline"), url: CANONICAL_URL };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          announce(t("shareOpened"));
          return;
        }
        await navigator.clipboard.writeText(CANONICAL_URL);
        announce(t("linkCopied"));
      } catch (error) {
        if (error && error.name === "AbortError") return;
        try { await navigator.clipboard.writeText(CANONICAL_URL); announce(t("linkCopied")); }
        catch (_) { announce(t("copyFailed")); }
      }
    });
  };

  const initialize = () => {
    applyLanguage(chooseInitialLanguage());
    wireEvents();
  };

  initialize();
})();
