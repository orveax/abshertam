# Route, Language & Conversion Contract

Status: Approved implementation contract

## Canonical page set
The public product is 12 bilingual page types:
1. Home
2. Services
3. Company Transactions
4. Work, Residence & Visa Transactions
5. Attestation, Notary & Official Documents
6. Government Certificates & Selected Records
7. Connect
8. Contact
9. Location
10. FAQ
11. Terms
12. Privacy

Each page type has an Arabic and English output under its language path.

## Language contract
- Arabic: /ar/... and document lang="ar", dir="rtl".
- English: /en/... and document lang="en", dir="ltr".
- Language switch links to the equivalent route in the other language.
- Never use JS text replacement as the primary bilingual architecture.
- Shared components may be generated/maintained from common source patterns, but rendered output is language-specific.
- Arabic and English content must be semantically equivalent, not literal word-for-word copies.

## Canonical conversion
Primary CTA label:
- AR: ابدأ طلبك
- EN: Start Your Request

Primary endpoint:
- /ar/connect/
- /en/connect/

## Context passing
Service-originated CTAs must pass context without forcing the user to repeat a choice.
Required logical fields:
- master_service_id
- path_id
- source_id
- language

Connect must:
1. preselect valid incoming service/path context;
2. allow the user to change it;
3. fall back safely when context is missing/invalid;
4. avoid duplicate service selection.

## Channel roles
- Connect: structured request creation.
- WhatsApp: enquiry, clarification, confirmation and follow-up.
- Contact: general enquiries.
- Location: directions, unit status, hours and visit guidance.
- FAQ: objection removal and clarity.
- Terms/Privacy: legal and data-governance reading.

## WhatsApp contract
- Not an equal Hero CTA.
- Delayed floating support on marketing/service pages.
- Hidden during active Connect form flow when it competes with task completion.
- May appear after successful request creation for follow-up with Request ID.
- Hidden on Terms/Privacy floating layer.

## Resource contract
Config-driven resources:
- companyProfilePdfUrl
- serviceBrochurePdfUrl

Rules:
- never expose a broken download button;
- activate only when a real approved production file exists;
- resource actions remain secondary to Start Your Request;
- track resource downloads when analytics is enabled.

## Navigation contract
Primary navigation remains concise:
Home / Services / Unit Location / FAQ / Contact / Start Your Request.

Master Services and Launch Paths are exposed through the Services experience / premium menu without overloading the top navigation.

## SEO language contract
Each localized page must eventually include:
- canonical URL;
- reciprocal hreflang for ar and en;
- correct title/description;
- localized Open Graph metadata where applicable;
- sitemap entries for both languages.
