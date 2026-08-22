# Full 12-Route Source QA — AIBSHER TAMM Website v2

Status: SOURCE IMPLEMENTATION COMPLETE / SOURCE QA PASS WITH OPEN GATES
Date: 2026-08-22
Branch: `feature/website-transformation-foundation`
Production `main`: UNCHANGED

## Architecture checked
The implementation follows Website Content Freeze v2.0:
1. Home
2. Services Directory
3. Company Setup, Renewal, Changes & Licensing
4. Work, Residence & Visa Transactions
5. Attestation, Notary & Official Documents
6. Government Certificates & Selected Records
7. Connect
8. Contact
9. Location
10. FAQ
11. Terms
12. Privacy

Each route exists as an Arabic `/ar/` implementation and an English `/en/` semantic equivalent.

## Route-tree QA
PASS:
- Arabic and English route trees are structurally equivalent.
- `/services/` contains one directory plus four Master Service routes only.
- No separate public route was created for P01–P10.
- `assets/data/routes.js` resolves all 12 route groups to the new AR/EN trees.
- New routes remain staging `noindex,nofollow` until Production Candidate.

## Service/content QA
PASS:
- Transaction-Need First remains the public starting logic.
- Four Master Services only.
- Ten Launch Paths remain sequential sections inside the four Master Service pages.
- Contextual service CTAs preserve `master_service_id`, `path_id`, and `source_id` into Connect.
- WhatsApp remains support/follow-up and is not a parallel structured intake route.
- Mobile Service Unit remains a service channel/differentiator, not the business definition.

## Connect v2 QA
PASS at source level:
- Six steps only.
- Step 1 = Your Transaction; Customer Type is not a first-stage public decision.
- Not Sure route exists for human triage.
- URL service/path context can be preselected and edited.
- Session state/review/back-edit behavior retained.
- Sensitive document upload is not part of the current MVP.
- Appointment preference is explicitly not confirmation.
- No browser-generated fake Request ID.
- No fake success: Success requires a real endpoint response containing a Request ID.
- Endpoint-unavailable state uses an explicit handoff instead of pretending submission succeeded.

## Support/operational QA
PASS at source level:
- Contact = General Enquiry only; transaction intent routes to Connect.
- Location = current service point + status + service-point hours + directions/visit guidance.
- Service-point hours remain 06:00–15:30 Doha time.
- WhatsApp hours remain a separate configuration field.
- Current location uses approved Plus Code and map route.
- Walk-in is not presented as requiring a prior call.
- FAQ contains the approved 15-question support structure.

## Legal reader QA
PASS for structure/content preservation:
- Terms AR: sections 01–21.
- Terms EN: sections 01–21.
- Privacy AR: sections 01–15.
- Privacy EN: sections 01–15.
- Full legal bodies are used instead of the abbreviated legacy website reader.
- Official company details preserve W.L.L., CR 241512, Commercial Licence 333645, current operational service point, and approved phone number.
- Registered/correspondence address remains explicitly pending approval where the source says so.

## Legal alignment gate — OPEN
The approved legal source still contains historical wording such as appointment-booking-first descriptions and Customer Type references. These were NOT silently rewritten during website implementation because Terms/Privacy are locked legal bodies. Qatar legal review must decide whether those clauses should be amended to reflect Connect v2 / Transaction-Need First before Production.

## Configuration/truthfulness QA
PASS:
- Company Profile / Service Brochure URLs remain empty until approved final resources exist.
- Weather endpoint remains empty; no fabricated live weather is shown.
- Request/contact endpoints are not assumed to exist.
- Operating status uses the approved Doha timezone and service-point hours.

## SEO / release publishing QA — OPEN
Findings:
- `robots.txt` is valid and points to `https://abshertam.qa/sitemap.xml`.
- Current `sitemap.xml` still lists the legacy root and `.html` routes only; it does not yet contain the new `/ar/` and `/en/` route trees.
- The new v2 pages intentionally remain `noindex,nofollow` in staging.
- Canonical + `hreflang` pairs for the new AR/EN pages are not yet frozen for Production.
- Legacy root `.html` pages still coexist with the new route trees, so a redirect/canonical migration map must be approved before cutover.

Release rule:
- Do not remove `noindex` until sitemap, canonical, hreflang and redirect behavior are updated together for the approved hosting/deployment layer.
- Do not add platform-specific redirect syntax until the production hosting route mechanism is confirmed.

## Git control QA
PASS:
- Transformation branch is ahead of `main` and not behind it.
- Production `main` has not been modified by the rollout.
- PR remains Draft and unmerged.

## Open gates before Production
1. Browser visual QA across desktop/laptop widths.
2. iPad/tablet portrait + landscape QA.
3. Android + iPhone mobile QA.
4. Keyboard/focus/accessibility journey QA.
5. Header/Premium Menu final visual/component QA.
6. Canonical / hreflang / sitemap / redirect migration QA.
7. Backend decision + real Connect submission QA.
8. Contact endpoint decision or approved manual handoff policy.
9. Qatar legal review of Terms and Privacy alignment.
10. Approved Company Profile / Service Brochure URLs when final assets are available.
11. Remove staging noindex only at Production Candidate.

## Gate result
Content architecture: PASS.
Static 12-route implementation: PASS.
AR/EN structural parity: PASS.
Source behavior/truthfulness: PASS.
Legal body preservation: PASS.
SEO publishing migration: OPEN.
Visual/device QA: PENDING.
Backend submission QA: PENDING.
Qatar legal review: PENDING.
Production merge: NOT AUTHORIZED YET.
