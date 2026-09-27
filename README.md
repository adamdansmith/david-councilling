# David Billington Counselling

One-page Cloudflare Worker site. David can change text and prices at `/admin/` using a password, as with the Harbour Town gigs editor. A GitHub account and Cloudflare Access are not needed to sign in.

## Editor setup

1. Create a Cloudflare KV namespace and bind it to the Worker as `SITE_CONTENT`. Until bound, the public site uses `content.json` and editing is unavailable.
2. Add encrypted Worker secrets `EDITOR_PASSWORD` and `EDITOR_SESSION_SECRET` (a separate random value of at least 32 characters). Do not put either value in GitHub. Redeploy after adding them.
3. Visit `/admin/`, sign in with the password and save a change. A signed, HttpOnly, Secure, SameSite cookie lasts eight hours. Five incorrect attempts from one IP trigger a 15-minute limit.

## Contact form

The old site's form is hosted by Wix and does not expose its notification recipient publicly. The new form therefore needs its delivery destination configured. Set up a verified sending domain with Resend and add encrypted Worker secrets `RESEND_API_KEY`, `CONTACT_TO` (David's current enquiry inbox) and `CONTACT_FROM` (a verified sender such as `Website <hello@example.com>`). Send a test message and confirm receipt and reply-to. Until configured, the form reports that delivery failed and David's phone number remains available.

Enquiries are not stored by the site. Add a practice privacy notice and Cloudflare rate limiting or Turnstile before public launch. Confirm the price, availability, BACP status and copy with David. The portrait is the photo already present in this repository.
