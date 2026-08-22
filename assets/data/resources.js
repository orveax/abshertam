window.AIBSHER_DATA = window.AIBSHER_DATA || {};

window.AIBSHER_DATA.resources = Object.freeze({
  companyProfile: Object.freeze({
    configKey: 'companyProfileUrl',
    ar: 'الملف التعريفي',
    en: 'Company Profile',
    enabledWhenConfigured: true
  }),
  serviceBrochure: Object.freeze({
    configKey: 'serviceBrochureUrl',
    ar: 'دليل الخدمات المختصر',
    en: 'Service Brochure',
    enabledWhenConfigured: true
  })
});

window.AIBSHER_DATA.resourceUrl = function resourceUrl(resourceKey) {
  const resource = window.AIBSHER_DATA.resources[resourceKey];
  const config = window.AIBSHER_CONFIG || {};
  if (!resource) return '';
  return String(config[resource.configKey] || '').trim();
};

window.AIBSHER_DATA.resourceEnabled = function resourceEnabled(resourceKey) {
  return Boolean(window.AIBSHER_DATA.resourceUrl(resourceKey));
};
