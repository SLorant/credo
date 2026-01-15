import type { CookieConsentConfig } from "vanilla-cookieconsent";

// Declare global types for Google Analytics, GTM, and Clarity
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}

// Function to load Microsoft Clarity
const loadClarity = () => {
  (function (
    c: any,
    l: any,
    a: string,
    r: string,
    i: string,
    t?: any,
    y?: any
  ) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", "v1wynobsex");
};

// Function to load Google Analytics
const loadGoogleAnalytics = () => {
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", "G-RDK71PZNMY");

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-RDK71PZNMY";
  document.head.appendChild(script);
};

// Function to load Google Tag Manager
const loadGoogleTagManager = () => {
  // Initialize dataLayer for GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  // Load GTM script
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-NMVVMCKK";
  document.head.appendChild(script);

  // Add GTM noscript iframe
  const noscript = document.createElement("noscript");
  const iframe = document.createElement("iframe");
  iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-NMVVMCKK";
  iframe.height = "0";
  iframe.width = "0";
  iframe.style.display = "none";
  iframe.style.visibility = "hidden";
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);
};

// Load GTM immediately (necessary cookie)
if (typeof window !== "undefined") {
  loadGoogleTagManager();
}

export const config: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "box wide",
      position: "bottom center",
    },
    preferencesModal: {
      layout: "box",
      position: "right",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      readOnly: true,
    },
    /*   functionality: {}, */
    analytics: {
      services: {
        clarity: {
          label:
            '<a href="https://clarity.microsoft.com/" target="_blank">Microsoft Clarity</a>',
          onAccept: () => {
            console.log("clarity accepted");
            loadClarity();
          },
          onReject: () => {
            console.log("clarity rejected");
          },
          cookies: [
            {
              name: /^_clck/,
            },
            {
              name: /^_clsk/,
            },
            {
              name: "CLID",
            },
            {
              name: "ANONCHK",
            },
            {
              name: "MR",
            },
            {
              name: "SM",
            },
          ],
        },
      },
    },
    marketing: {
      services: {
        ga4: {
          label:
            '<a href="https://marketingplatform.google.com/about/analytics/terms/us/" target="_blank">Google Analytics 4</a>',
          onAccept: () => {
            console.log("ga4 accepted");
            loadGoogleAnalytics();
          },
          onReject: () => {
            console.log("ga4 rejected");
          },
          cookies: [
            {
              name: /^_ga/,
            },
            {
              name: "_gid",
            },
            {
              name: "_gat",
            },
          ],
        },
      },
    },
  },
  language: {
    default: "hu",
    autoDetect: "browser",
    translations: {
      hu: {
        consentModal: {
          title: "Weboldalunk sütiket használ",
          description:
            "A weboldal sütiket (cookie-kat) használ a tartalom és a hirdetések személyre szabása, valamint a forgalom elemzése érdekében.",
          acceptAllBtn: "Összes elfogadása",
          acceptNecessaryBtn: "Összes elutasítása",
          showPreferencesBtn: "Testreszabás",
          footer:
            '<a href="/adatkezeles" style="margin: 4px 0px;">Adatkezelési szabályzat</a>' /* \n<a href="#link">Terms and conditions</a> */,
        },
        preferencesModal: {
          title: "Sütik testreszabása",
          acceptAllBtn: "Összes elfogadása",
          acceptNecessaryBtn: "Összes elutasítása",
          savePreferencesBtn: "Mentés és bezárás",
          closeIconLabel: "Bezárás",
          serviceCounterLabel: "szolgáltatás|szolgáltatások",
          sections: [
            {
              title: "Cookie-nyilatkozat",
              description:
                "A weboldal sütiket (cookie-kat) használ a tartalom és a hirdetések személyre szabása, valamint a forgalom elemzése érdekében. A webhely használatával kapcsolatos információk megosztásra kerülnek a hirdetési és elemző partnerekkel, akik ezeket összekapcsolhatják egyéb, a szolgáltatásaik használata során gyűjtött, vagy a partnerek számára korábban rendelkezésre bocsátott adatokkal.",
            },
            {
              title:
                'Elengedhetetlenül szükséges <span class="pm__badge">Mindig bekapcsolva</span>',
              description:
                "Az elengedhetetlenül szükséges sütik lehetővé teszik a webhely alapvető funkcióit, például a felhasználói bejelentkezést és a fiókkezelést. A weboldal nem használható megfelelően az elengedhetetlenül szükséges sütik nélkül.",
              linkedCategory: "necessary",
            },
            {
              title: "Teljesítmény",
              description:
                "A teljesítmény-sütiket, pl. analitikai sütiket annak nyomon követésére használják, hogy hogyan használják a látogatók a weboldalt. Ezek a sütik nem használhatók egy adott látogató közvetlen azonosítására.",
              linkedCategory: "analytics",
            },
            {
              title: "Célzás",
              description:
                "A célzó sütiket a különböző webhelyek látogatóinak, pl. tartalompartnereknek, banner hálózatoknak az azonosítására használják. Ezeket a sütiket a vállalatok felhasználhatják a látogatók érdeklődési profiljának létrehozására vagy releváns hirdetések más webhelyeken való megjelenítésére.",
              linkedCategory: "marketing",
            },
            /*  {
              title: "Funkcionalitás",
              description:
                "A funkcionális sütik a webhelylátogatók adataira, pl. nyelvre, időzónára, bővített tartalomra való emlékezést szolgálják.",
              linkedCategory: "functionality",
            }, */
            {
              title: "A sütikről",
              description: `A cookie-k (sütik) kis méretű szöveges fájlok, amelyek a meglátogatott webhelyeken keresztül kerülnek a böngészésre használt eszközre. Alkalmazásuk a hatékony navigációt és egyes funkciók végrehajtását szolgálja. A weboldal megfelelő működéséhez elengedhetetlen sütik külön hozzájárulás nélkül is elhelyezhetők, míg minden egyéb típusú süti használatához, illetve böngészőben való tárolásához előzetes jóváhagyás szükséges.
                          <br/>  <br/>Az Adatvédelmi szabályzat oldalon bármikor megváltoztathatja a sütik használatához való hozzájárulását.
                           <br/>A reklámaink személyre szabása és hatékonyságának mérése érdekében sütiket is használunk. További részletekért látogasson el a Google Adatvédelmi irányelvek oldalra.`,
            },
          ],
        },
      },
    },
  },
};
