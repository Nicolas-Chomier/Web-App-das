// Datas for displaying elements
//"New Format": {IoList:{ni:8,no:6,ai:4,ao:1,ti:0},OpenAir:0,1,2,tag:"testTag"},
const dataElem = {
  Compresseurs: {
    "Open Air": {
      FIXE: {
        IoList: { ni: 0, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 1,
        tag: "Fixe",
      },
      VARIABLE: {
        IoList: { ni: 0, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 2,
        tag: "Variable",
      },
    },
    Classique: {
      simple: {
        IoList: { ni: 1, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "CP000",
      },
      "avec options": {
        IoList: { ni: 3, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "CP100",
      },
    },
    Surpresseur: {
      standard: {
        IoList: { ni: 1, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "SP000",
      },
    },
  },
  "Eléments-Métier": {
    Chilleur: {
      standard: {
        IoList: { ni: 1, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "CHIL000",
      },
    },
    "Secheur frigorifique": {
      standard: {
        IoList: { ni: 1, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "FRIG000",
      },
      "avec capteur d'hygrométrie integré": {
        IoList: { ni: 1, no: 1, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "FRIGYG000",
      },
    },
    "Secheur à adsorbtion": {
      standard: {
        IoList: { ni: 1, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "ADSO000",
      },
      "avec mode économique, sans capteur d'hygrométrie integré": {
        IoList: { ni: 1, no: 2, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "ADSOECO000",
      },
      "standard avec capteur d'hygrométrie integré": {
        IoList: { ni: 1, no: 1, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "ADSOHYG",
      },
      "avec mode économique, et capteur d'hygrométrie integré": {
        IoList: { ni: 1, no: 2, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "ADSOHYGECO000",
      },
    },
    "Separateur de condensat": {
      BEKOSPLIT: {
        IoList: { ni: 1, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "BEKO000",
      },
    },
    "Corps chauffants": {
      "Rechauffeur electrique": {
        IoList: { ni: 0, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "RECH000",
      },
      "Resistance de traçage": {
        IoList: { ni: 0, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "RESTRA000",
      },
    },
    Purgeur: {
      "standard sans retour de defaut": {
        IoList: { ni: 0, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "PURG000",
      },
      "standard avec retour de defaut": {
        IoList: { ni: 1, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "PURG100",
      },
      "piloté sans retour de defaut": {
        IoList: { ni: 0, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "PURG200",
      },
      "piloté avec retour de defaut": {
        IoList: { ni: 1, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "PURGFULL000",
      },
    },
  },
  Instrumentation: {
    "Capteur Pression": {
      standard: {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "PT000",
      },
      "avec 1 contact sec": {
        IoList: { ni: 1, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "PTSEC100",
      },
      "avec 2 contact sec": {
        IoList: { ni: 2, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "PTSEC200",
      },
    },
    Pressostat: {
      standard: {
        IoList: { ni: 1, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "PRESS000",
      },
    },
    "Capteur Debit": {
      standard: {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "FT000",
      },
      "avec compteur à impulsion": {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "FTPULSE000",
      }, // impulsion non definie !!
    },
    "Detecteur de Debit": {
      standard: {
        IoList: { ni: 1, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "DETECFLOW000",
      },
    },
    "Capteur de Temperature": {
      standard: {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "TT000",
      },
      "PT100 ou PT1000 ou Thermocouple": {
        IoList: { ni: 0, no: 0, ai: 0, ao: 0, ti: 1 },
        OpenAir: 0,
        tag: "TTX000",
      },
      "avec signal de commutation": {
        IoList: { ni: 1, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "TTSEC000",
      },
    },
    Thermostat: {
      standard: {
        IoList: { ni: 1, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "THERM000",
      },
    },
    Hygrometre: {
      standard: {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "HYGR000",
      },
    },
    "Capteur de niveau d'eau": {
      standard: {
        IoList: { ni: 1, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "WLVL000",
      },
    },
    Compteurs: {
      "Compteur d'eau": {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "WCPT000",
      },
      "Compteur d'energie thermique": {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "TCPT000",
      },
      "Compteur electrique": {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "ECPT000",
      },
    },
    "Capteur hybride": {
      "Débit & T°": {
        IoList: { ni: 1, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "F&T000",
      },
    },
  },
  "Eléments-Process": {
    "Vanne 2 voies": {
      "Pneumatique monostable sans retour de position": {
        IoList: { ni: 0, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V2PM000",
      },
      "Pneumatique monostable avec retour de position": {
        IoList: { ni: 2, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V2PM100",
      },
      "Pneumatique bistable sans retour de position": {
        IoList: { ni: 0, no: 2, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V2PB000",
      },
      "Pneumatique bistable avec retour de position": {
        IoList: { ni: 2, no: 2, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V2PB100",
      },
      "Motorisée simple sans retour de position": {
        IoList: { ni: 0, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V2M000",
      },
      "Motorisée simple avec retour de position": {
        IoList: { ni: 2, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V2M100",
      },
      "Motorisée pilotée sans retour de position": {
        IoList: { ni: 0, no: 0, ai: 0, ao: 1, ti: 0 },
        OpenAir: 0,
        tag: "V2MP000",
      },
      "Motorisée pilotée avec retour de position analogique": {
        IoList: { ni: 0, no: 0, ai: 1, ao: 1, ti: 0 },
        OpenAir: 0,
        tag: "V2MP100",
      },
    },
    "Vanne 3 voies": {
      "Pneumatique monostable sans retour de position": {
        IoList: { ni: 0, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V3PM000",
      },
      "Pneumatique monostable avec retour de position": {
        IoList: { ni: 2, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V3PM100",
      },
      "Pneumatique bistable sans retour de position": {
        IoList: { ni: 0, no: 2, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V3PB000",
      },
      "Pneumatique bistable avec retour de position": {
        IoList: { ni: 2, no: 2, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V3PB100",
      },
      "Motorisée simple sans retour de position": {
        IoList: { ni: 0, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V3M000",
      },
      "Motorisée simple avec retour de position": {
        IoList: { ni: 2, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "V3M100",
      },
      "Motorisée pilotée sans retour de position": {
        IoList: { ni: 0, no: 0, ai: 0, ao: 1, ti: 0 },
        OpenAir: 0,
        tag: "V3MP000",
      },
      "Motorisée pilotée avec retour de position analogique": {
        IoList: { ni: 0, no: 0, ai: 1, ao: 1, ti: 0 },
        OpenAir: 0,
        tag: "V3MP100",
      },
    },
    Registre: {
      "Motorisée simple sans retour de position": {
        IoList: { ni: 0, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "REGI000",
      },
      "Motorisée simple avec retour de position": {
        IoList: { ni: 2, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "REGI100",
      },
      "Motorisée pilotée sans retour de position": {
        IoList: { ni: 0, no: 0, ai: 0, ao: 1, ti: 0 },
        OpenAir: 0,
        tag: "REGI200",
      },
      "Motorisée pilotée avec retour de position, analogique": {
        IoList: { ni: 0, no: 0, ai: 1, ao: 1, ti: 0 },
        OpenAir: 0,
        tag: "REGI300",
      },
    },
    Souflante: {
      standard: {
        IoList: { ni: 1, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "SOUF000",
      },
    },
    "Pompe à eau": {
      standard: {
        IoList: { ni: 1, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "WPUMP000",
      },
    },
    "Pompe à vide": {
      standard: {
        IoList: { ni: 1, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "VPUMP000",
      },
    },
  },
  Analyseurs: {
    "Analyseur d'air": {
      ULTRAMAT: {
        IoList: { ni: 0, no: 0, ai: 2, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "ULTRAMAT",
      },
      "VAR-18": {
        IoList: { ni: 2, no: 0, ai: 2, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "VAR18",
      },
      "Analyseur d'oxygene": {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "ANOXY000",
      },
    },
  },
  Unitaire: {
    Input: {
      Numerical: {
        IoList: { ni: 1, no: 0, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "NI",
      },
      Analog: {
        IoList: { ni: 0, no: 0, ai: 1, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "AI",
      },
      Temperature: {
        IoList: { ni: 0, no: 0, ai: 0, ao: 0, ti: 1 },
        OpenAir: 0,
        tag: "TI",
      },
    },
    Output: {
      Numerical: {
        IoList: { ni: 0, no: 1, ai: 0, ao: 0, ti: 0 },
        OpenAir: 0,
        tag: "NO",
      },
      Analog: {
        IoList: { ni: 0, no: 0, ai: 0, ao: 1, ti: 0 },
        OpenAir: 0,
        tag: "AO",
      },
    },
  },
};
// Datas for displaying HMI
const dataHmi = {
  "IHM avec OpenAir": {
    "Gamme eXtrem": {
      '12"': "PFSCR03",
      '15"': "PFSCR04",
    },
    "Gamme budget": {
      '10"': "PFSCR05",
      '12"': "PFSCR06",
    },
    "Gamme premium": {
      '12"': "PFSCR07",
      '15"': "PFSCR08",
      '19"': "PFSCR09",
    },
  },
  "IHM sans OpenAir": {
    "Gamme compact": {
      '3_5"': "PFSCR01",
      '5_7"': "PFSCR02",
    },
    "Gamme eXtrem": {
      '12"': "PFSCR03",
      '15"': "PFSCR04",
    },
    "Gamme budget": {
      '10"': "PFSCR05",
      '12"': "PFSCR06",
    },
    "Gamme premium": {
      '12"': "PFSCR07",
      '15"': "PFSCR08",
      '19"': "PFSCR09",
    },
  },
};

var Proface = {
  HMI: {
    PFSCR01: {
      Denomination: "HMI",
      Pictures: HMILT4200,
      Series: "test",
      Infos: "test",
      Reference: "PFXLM4201TADAC",
      PanelCut: "test",
      Manufacturer: "PRO-FACE",
      Price: 562,
      PLCref: "PFXLM4201TADAC",
      Iolist: {
        ni: 12,
        no: 6,
        ai: 2,
        ao: 2,
        ti: 2,
      },
    },
    PFSCR02: {
      Denomination: "HMI",
      Pictures: HMILT4300,
      Series: "test",
      Infos: "test",
      Reference: "PFXLM4301TADAC",
      PanelCut: "test",
      Manufacturer: "PRO-FACE",
      Price: 578.31,
      PLCref: "PFXLM4301TADAC",
      Iolist: {
        ni: 12,
        no: 6,
        ai: 2,
        ao: 2,
        ti: 2,
      },
    },
    // testeur
    PFSCR03: {
      Denomination: "HMI",
      Pictures: HMI12SP5000X,
      Series: "SP5000X Series",
      Infos:
        'TFT Color LCD (Ultra High-brightness), 12" Wide 1,280 x 800 pixels (WXGA)',
      Reference: "PFXSP5690WAD",
      PanelCut: "W295 x H217 mm Panel thickness area: 1.6 to 5 mm",
      Manufacturer: "PRO-FACE",
      Price: 1162.35,
      PLCref: "PFXSP5B90",
      Iolist: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
    },
    PFSCR04: {
      Denomination: "HMI",
      Pictures: HMI15SP5000,
      Series: "",
      Infos: "",
      Reference: "",
      PanelCut: "",
      Manufacturer: "PRO-FACE",
      Price: 0,
      PLCref: "PFXSP5B90",
      Iolist: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
    },
    PFSCR05: {
      Denomination: "HMI",
      Pictures: HMI10SP5000,
      Series: "",
      Infos: "",
      Reference: "PFXSP5500WAD",
      PanelCut: "",
      Manufacturer: "PRO-FACE",
      Price: 0,
      PLCref: "PFXSP5B10",
      Iolist: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
    },
    PFSCR06: {
      Denomination: "HMI",
      Pictures: PFXSP5600WAD,
      Series: "",
      Infos: "",
      Reference: "PFXSP5600WAD",
      PanelCut: "",
      Manufacturer: "PRO-FACE",
      Price: 932.91,
      PLCref: "PFXSP5B10",
      Iolist: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
    },
    PFSCR07: {
      Denomination: "HMI",
      Pictures: PFXSP5600WPD,
      Series: "",
      Infos: "",
      Reference: "PFXSP5600WPD",
      PanelCut: "",
      Manufacturer: "PRO-FACE",
      Price: 0,
      PLCref: "PFXSP5B10",
      Iolist: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
    },
    PFSCR08: {
      Denomination: "HMI",
      Pictures: PFXSP5700WCD,
      Series: "",
      Infos: "",
      Reference: "PFXSP5700WCD",
      PanelCut: "",
      Manufacturer: "PRO-FACE",
      Price: 0,
      PLCref: "PFXSP5B10",
      Iolist: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
    },
    PFSCR09: {
      Denomination: "HMI",
      Pictures: HMI19SP5000,
      Series: "",
      Infos: "",
      Reference: "PFXSP5800WCD",
      PanelCut: "",
      Manufacturer: "PRO-FACE",
      Price: 0,
      PLCref: "PFXSP5B10",
      Iolist: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
    },
  },
  PLC: {
    PFXLM4201TADAC: {
      Denomination: "PLC",
      Reference: "PFXLM4201TADAC",
      Manufacturer: "PRO-FACE",
      Infos: "PLC & HMI all in one",
      Quantity: 1,
      Price: 560,
      MASTERCANOPEN: {
        Denomination: "*",
        Reference: "*",
        Manufacturer: "*",
        Infos: "*",
        Quantity: 1,
        Price: "*",
      },
    },
    PFXLM4301TADAC: {
      Denomination: "PLC",
      Reference: "PFXLM4301TADAC",
      Manufacturer: "PRO-FACE",
      Infos: "PLC & HMI all in one",
      Quantity: 1,
      Price: 560,
      MASTERCANOPEN: {
        Denomination: "*",
        Reference: "*",
        Manufacturer: "*",
        Infos: "*",
        Quantity: 1,
        Price: "*",
      },
    },
    PFXSP5B10: {
      Denomination: "PLC",
      Reference: "PFXSP5B10",
      Manufacturer: "PRO-FACE",
      Infos: "egerg",
      Quantity: 1,
      Price: 100,
      MASTERCANOPEN: {
        Denomination: "CANOPENMASTER",
        Reference: "canOpenRef",
        Manufacturer: "PRO-FACE",
        Infos: "feuhcue",
        Quantity: 1,
        Price: 65,
      },
    },
    PFXSP5B90: {
      Denomination: "PLC",
      Reference: "PFXSP5B90",
      Manufacturer: "PRO-FACE",
      Infos: "fefze",
      Quantity: 1,
      Price: 150,
      MASTERCANOPEN: {
        Denomination: "CANOPENMASTER",
        Reference: "canOpenRef",
        Manufacturer: "PRO-FACE",
        Infos: "feuhcue",
        Quantity: 1,
        Price: 65,
      },
    },
  },
  // Order to respect = Input Max Min Hybride, Output Max Min Hybride
  BOARD: {
    PFMOD01: {
      Description: "Module 16 entrées TOR",
      Interface: "Input x16",
      Denomination: "I/O Board",
      IoList: {
        ni: 16,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
      Reference: "TM3DI16G",
      Manufacturer: "PRO-FACE",
      Price: 118.98,
      Img: TM3DI16G,
    },
    PFMOD02: {
      Description: "Module 8 entrées TOR",
      Interface: "Input x8",
      Denomination: "I/O Board",
      IoList: {
        ni: 8,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
      Reference: "TM3DI8G",
      Manufacturer: "PRO-FACE",
      Price: 69.99,
      Img: TM3DI8G,
    },
    PFMOD03: {
      Description: "Module 16 sorties TOR",
      Interface: "Output x16",
      Denomination: "I/O Board",
      IoList: {
        ni: 0,
        no: 16,
        ai: 0,
        ao: 0,
        ti: 0,
      },
      Reference: "TM3DQ16TG",
      Manufacturer: "PRO-FACE",
      Price: 118.98,
      Img: TM3DI8G,
    },
    PFMOD04: {
      Description: "Module 8 sorties TOR",
      Interface: "Output x8",
      Denomination: "I/O Board",
      IoList: {
        ni: 0,
        no: 8,
        ai: 0,
        ao: 0,
        ti: 0,
      },
      Reference: "TM3DQ8TG",
      Manufacturer: "PRO-FACE",
      Price: 69.99,
      Img: TM3DI8G,
    },
    PFMOD05: {
      Description: "Module 4 entrées et sorties TOR",
      Interface: "Hybride 4/4",
      Denomination: "I/O Board",
      IoList: {
        ni: 4,
        no: 4,
        ai: 0,
        ao: 0,
        ti: 0,
      },
      Reference: "TM3DM8RG",
      Manufacturer: "PRO-FACE",
      Price: 0,
      Img: TM3DM8RG,
    },
    PFMOD06: {
      Description: "Module 8 entrées analogiques",
      Interface: "Input x8",
      Denomination: "I/O Board",
      IoList: {
        ni: 0,
        no: 0,
        ai: 8,
        ao: 0,
        ti: 0,
      },
      Reference: "TM3AI8G",
      Manufacturer: "PRO-FACE",
      Price: 180.66,
      Img: TM3DI8G,
    },
    PFMOD07: {
      Description: "Module 4 entrées analogiques et sondes de températures",
      Interface: "Input x4",
      Denomination: "I/O Board",
      IoList: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 4,
      },
      Reference: "TM3TI4G",
      Manufacturer: "PRO-FACE",
      Price: 0,
      Img: TM3DI8G,
    },
    PFMOD08: {
      Description: "Module 4 sorties analogiques",
      Interface: "Output x4",
      Denomination: "I/O Board",
      IoList: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 4,
        ti: 0,
      },
      Reference: "TM3AQ4G",
      Manufacturer: "PRO-FACE",
      Price: 207.33,
      Img: TM3DI8G,
    },
    PFMOD09: {
      Description: "Module 4 entrées et 2 sorties analogiques",
      Interface: "Hybride 4/2",
      Denomination: "I/O Board",
      IoList: {
        ni: 0,
        no: 0,
        ai: 4,
        ao: 2,
        ti: 0,
      },
      Reference: "TM3AM6G",
      Manufacturer: "PRO-FACE",
      Price: 0,
      Img: TM3DI8G,
    },
    PFMOD10: {
      Description: "Module coupleur CAnopen",
      Interface: "Tête de ligne\nCanopen",
      Denomination: "I/O Board",
      IoList: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
      Reference: "TM3BCCO",
      Manufacturer: "PRO-FACE",
      Price: 161.65,
      Img: TM3BCCO,
    },
    PFMOD11: {
      Description: "Module d'extension émetteur",
      Interface: "Rallonge\némettrice",
      Denomination: "I/O Board",
      IoList: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
      Reference: "TM3XTRA1",
      Manufacturer: "PRO-FACE",
      Price: 43.27,
      Img: TM3XTRA1,
    },
    PFMOD12: {
      Description: "Module d'extension récepteur",
      Interface: "Rallonge\nréceptrice",
      Denomination: "I/O Board",
      IoList: {
        ni: 0,
        no: 0,
        ai: 0,
        ao: 0,
        ti: 0,
      },
      Reference: "TM3XREC1",
      Manufacturer: "PRO-FACE",
      Price: 43.27,
      Img: TM3XREC1,
    },
  },
};
