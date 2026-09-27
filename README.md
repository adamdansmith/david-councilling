# David Billington Counselling

A one-page Cloudflare Worker site with a text and price editor at `/admin/` and a contact form.

The existing Worker build configuration is retained. Its static assets are served through the Worker, which handles the editor and contact API.

## Before the editor can be used

1. Create a Cloudflare KV namespace. Bind it to this Worker as `SITE_CONTENT` in Cloudflare settings. Until it is bound, `content.json` supplies the public copy, and saving is disabled.
2. Set up Cloudflare Access for the site's `/admin/*` and `/api/admin/*` routes, allowing only David's email. Set Worker environment variables `ACCESS_TEAM_DOMAIN` (for example `team.cloudflareaccess.com`, without the protocol) and `ACCESS_AUD` (the Access application's audience tag). The Worker verifies the Access JWT again on each editor request. The editor refuses access until this is configured.
3. Open `/admin/` as David, edit a line and save it, then refresh the public page to verify the change.

## Contact form

Set up a verified sending domain with Resend. Add Worker secrets `RESEND_API_KEY`, `CONTACT_TO` (David's email) and `CONTACT_FROM` (a verified sender such as `Website <hello@example.com>`). Then test the form and confirm that David receives the message and can reply to its sender. Without these secrets, the form explains that the message could not be sent and displays David's public phone number nearby.

The form does not store enquiries on the site. Add a practice privacy notice and Cloudflare rate limiting or Turnstile before public launch. Confirm the price, availability, BACP status and copy with David. The portrait is the photo already present in this repository.
