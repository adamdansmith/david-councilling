# David Billington Counselling

One-page Cloudflare **Pages** project with Pages Functions for the password editor and contact form. This follows the Harbour Town deployment pattern. The previous Worker is not needed after Pages is deployed and tested.

## Cloudflare Pages deployment

The existing Pages project is connected to this GitHub repository. Keep its current build output directory at the repository root (`.`). The `functions` directory is discovered automatically and `_routes.json` limits function requests to the editor and APIs. Deploy this commit from `main`, then check the public site and `/admin/` before deleting the old Worker.

The public site works without bindings. Its contact form will display an error until email delivery is configured.

## Editor setup

1. Create a Cloudflare KV namespace and bind it to the **Pages project** as `SITE_CONTENT` under Settings → Bindings. Set it for Production and Preview if you will use both.
2. Under the **Pages project's** Settings → Variables and Secrets, add encrypted `EDITOR_PASSWORD` and `EDITOR_SESSION_SECRET` (a separate random value of at least 32 characters). Set them for Production, and Preview if needed. Do not commit these values to GitHub. Redeploy after setting them.
3. Visit `/admin/`, sign in and save a change. The signed, HttpOnly, Secure, SameSite cookie lasts eight hours. Five incorrect attempts from one IP trigger a 15-minute limit. David does not need a GitHub or Cloudflare account.

## Contact form

The pre-redesign site had no email address in its source and its form posted to `#` without delivery code. The Wix form's inbox cannot be determined publicly. For email delivery, verify a sender domain with Resend and set encrypted Pages secrets `RESEND_API_KEY`, `CONTACT_FROM` (for example `David Billington Counselling <website@thejourneytowholeness.com>`) and `CONTACT_TO` (the inbox that should receive enquiries). Test receipt and reply-to before publishing the form as ready. Enquiries are not stored on the website.

Confirm copy, fee, availability, BACP status and a privacy notice with David before public launch. The portrait is the image already present in the original repository.

## Blog and search visibility

The homepage Blog link appears only after David publishes at least one post. The blog has its own page; its title and introduction can be changed in the website text editor. He can write and format posts in `/admin/` under **Blog posts**, save drafts, and change a published post back to draft. Drafts never appear in the public list or sitemap. Posts use server-rendered HTML, unique titles, descriptions, canonical URLs and BlogPosting structured data. The site also serves `/sitemap.xml` and `/robots.txt` from Pages Functions. The homepage describes counselling in Horndean, Hampshire, and support for ADHD, neurodiversity and anxiety. Search visibility still depends on the final domain, indexing and the quality of David's content; submit the eventual domain's sitemap in Google Search Console after launch.
