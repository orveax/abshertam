# Request & Contact Integration Contract — AIBSHER TAMM Website v2

Status: CONTRACT FROZEN / BACKEND NOT YET CONNECTED
Date: 2026-08-22
Branch: `feature/website-transformation-foundation`

## Purpose
Define the minimum backend contract required to connect Website v2 to a CRM/request-management layer without changing the approved customer journey or introducing fake success states.

This document is vendor-neutral. It does not assume a specific CRM product, hosting platform, database, or automation provider.

## Configuration
`assets/config.js` owns two explicit integration switches:

```js
requestEndpoint: '',
contactEndpoint: '',
```

Blank endpoint = integration disabled.

When disabled:
- Connect keeps only the non-sensitive transaction selection in browser session state and exposes a truthful manual handoff.
- Contact exposes approved WhatsApp/email handoff without placing the submitted message or contact details in the handoff URL.
- No Request ID is fabricated.
- No Success state is shown as if a backend accepted the record.

## A. Connect request endpoint
### Method
`POST`

### Content type
`application/json`

### Required frontend success condition
HTTP 2xx **and** response JSON containing a real request identifier:

```json
{
  "request_id": "AT-..."
}
```

`requestId` may be accepted temporarily by the frontend for compatibility, but the preferred canonical response key is `request_id`.

A 2xx response without a real request identifier is treated as a failure, not Success.

### Connect payload contract
The current normalized payload may contain:

```json
{
  "master_service_id": "MS01",
  "path_id": "P01",
  "not_sure": false,
  "source_id": "service-page",
  "website_language": "ar",
  "desired_outcome": "...",
  "progress_state": "not_started",
  "deadline_reason": "...",
  "readiness_summary": "some",
  "organization_name": "...",
  "representative_role": "...",
  "full_name": "...",
  "mobile": "+974...",
  "email": "...",
  "preferred_language": "ar",
  "preferred_next_step": "whatsapp",
  "appointment_date": "",
  "appointment_time": "",
  "consent": true,
  "consent_version": "connect-v2.1-2026-08-21",
  "client_state": "READY_TO_SUBMIT",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "utm_term": "",
  "utm_content": ""
}
```

Conditional/optional fields may be blank or omitted by the backend normalization layer, but the backend must preserve the service/path/source context when supplied.

### Backend validation rules
The backend must not trust browser validation alone.
At minimum it must validate:
- recognized `master_service_id` / `path_id` pair when supplied;
- `not_sure` route where path is intentionally unknown;
- `source_id` against known source IDs or the same bounded safe format used by the frontend (maximum 64 characters; letters, numbers, `.`, `_`, `:`, `-` only);
- UTM fields as optional attribution strings with control characters removed and a maximum length of 120 characters each;
- `full_name`;
- valid contact mobile format;
- required journey fields;
- explicit consent;
- bounded field lengths;
- allowed enum values;
- a practical request-body size limit;
- duplicate/replay controls appropriate to the chosen backend;
- basic abuse/rate-limit controls appropriate to a public unauthenticated form.

### Request state
Initial accepted CRM/request state should represent **received for review**, not service completion and not appointment confirmation.

Recommended neutral state name:
`RECEIVED_FOR_REVIEW`

The public Success copy remains:
request received → Request ID → team review → next-step communication.

### Security boundary
The initial Connect endpoint must not require or encourage:
- passwords;
- banking credentials;
- government portal credentials;
- sensitive identity-document upload in the current MVP.

Document upload remains OFF until secure storage, access control, retention, deletion, and audit rules are approved.

## B. General Contact endpoint
### Method
`POST`

### Content type
`application/json`

### Payload

```json
{
  "full_name": "...",
  "email": "...",
  "phone": "...",
  "subject": "...",
  "message": "...",
  "consent": "accepted"
}
```

### Boundary
This endpoint is **General Enquiry only**.
It must not create the same transaction-request workflow as Connect unless an explicit internal triage process later promotes an enquiry into a request.

### Success condition
Any HTTP 2xx response may be treated as a successful general-enquiry delivery, provided the backend has actually persisted or delivered the enquiry.

A Contact Request ID is optional unless future operational policy requires one.

## C. Error behavior
For both endpoints:
- network error, timeout, non-2xx response, malformed JSON where required, or missing Connect Request ID must not show false Success;
- entered customer data should remain available in the active form for correction/retry where practical;
- frontend error copy must not expose stack traces, infrastructure names, credentials, or internal IDs.

## D. CORS / origin contract
Production endpoint must explicitly allow the approved website origin:
`https://abshertam.qa`

Do not deploy permissive wildcard credential policies without a documented reason.

## E. Operational handoff contract
A successful Connect submission must create or deliver, at minimum:
- Request ID
- created timestamp
- transaction/service/path context
- customer contact details
- preferred follow-up method
- request summary/readiness
- language
- consent version
- source/UTM context when available

The operational team must be able to find the record by Request ID.

## F. QA required before enabling endpoints
1. Valid Connect submission returns real Request ID.
2. Not Sure submission reaches human triage.
3. Service/path context survives end-to-end.
4. Invalid payload is rejected server-side.
5. Oversized payloads and malformed attribution fields are rejected or normalized server-side.
6. Duplicate/retry behavior is known and documented.
7. Basic public-form abuse/rate-limit behavior is known and documented.
8. Backend failure produces frontend error, not Success.
9. Appointment preference remains unconfirmed until team action.
10. Contact enquiry reaches the correct operational inbox/queue.
11. CORS works only for approved origins/policies.
12. Privacy/retention handling matches approved policy.

## Release rule
Do not populate `requestEndpoint` or `contactEndpoint` in production config until the relevant endpoint passes this contract and integration QA.
