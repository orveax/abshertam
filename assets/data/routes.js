window.AIBSHER_DATA = window.AIBSHER_DATA || {};

window.AIBSHER_DATA.routes = Object.freeze({
  home: Object.freeze({ ar: '/ar/', en: '/en/' }),
  services: Object.freeze({ ar: '/ar/services/', en: '/en/services/' }),
  companyTransactions: Object.freeze({ ar: '/ar/services/company-transactions/', en: '/en/services/company-transactions/' }),
  workResidenceVisas: Object.freeze({ ar: '/ar/services/work-residence-visas/', en: '/en/services/work-residence-visas/' }),
  attestationDocuments: Object.freeze({ ar: '/ar/services/attestation-documents/', en: '/en/services/attestation-documents/' }),
  certificatesRecords: Object.freeze({ ar: '/ar/services/certificates-records/', en: '/en/services/certificates-records/' }),
  connect: Object.freeze({ ar: '/ar/connect/', en: '/en/connect/' }),
  contact: Object.freeze({ ar: '/ar/contact/', en: '/en/contact/' }),
  location: Object.freeze({ ar: '/ar/location/', en: '/en/location/' }),
  faq: Object.freeze({ ar: '/ar/faq/', en: '/en/faq/' }),
  terms: Object.freeze({ ar: '/ar/terms/', en: '/en/terms/' }),
  privacy: Object.freeze({ ar: '/ar/privacy/', en: '/en/privacy/' })
});

window.AIBSHER_DATA.equivalentRoute = function equivalentRoute(routeKey, language) {
  const route = window.AIBSHER_DATA.routes[routeKey];
  if (!route || !route[language]) return window.AIBSHER_DATA.routes.home[language === 'en' ? 'en' : 'ar'];
  return route[language];
};
