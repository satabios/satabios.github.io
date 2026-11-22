# Tea & Forever — responsive wedding invitation

One responsive website serves phones, tablets, and desktop computers. There is one set of content and one RSVP form, not separate desktop and mobile copies.

## Open and host

Open `index.html` in a browser. Keep `settings.js` next to it.
For GitHub Pages, upload `index.html`, `settings.js`, and `.nojekyll` to the published folder. No npm install, server, or build is needed. Artwork, fonts, and animation libraries are embedded in the HTML.

## Edit once for every screen

Edit `settings.js`, save, and reload. Keep quotation marks and commas valid; do not rename the property keys.

- `event`: wedding date, venue, address, city, muhurtham, lunch time, and directions link.
- `content`: all invitation text, organized by section. Edit the values on the right. The keys remain stable even if the words change. Multi-line headings have a separate value for each styled line.
- `site.readingScale`: 1 is the default size; 1.1 makes text 10% larger. It is limited to 0.9–1.3.
- `site.ink`, `site.accent`: text and accent colours, in six-digit hex format. Artwork colours remain part of the paintings.
- `site.paper`: base page paper colour; the individual painted scenes retain their coordinated backgrounds.
- `site.mobilePaperWash`: 0.65–0.98; higher values soften the artwork behind mobile text more strongly.
- `motion.enabledByDefault`: desktop default. A visitor’s saved motion choice and system reduced-motion preference take precedence. Mobile layouts and touch-first devices use still artwork.
- `rsvp.endpoint`: the Google Apps Script web app URL ending in `/exec`, or the endpoint of a compatible JSON form service. Keep it blank until the service is deployed. Never put secret API keys here.
- `rsvp.maxPartySize`: 1–30; updates the choices and validation together.

Text containing `{{event.date}}`, `{{event.venue}}`, `{{event.address}}`, `{{event.city}}`, `{{event.muhurtham}}`, or `{{event.lunchTime}}` automatically reuses that shared event value. Keep these placeholders wherever you want automatic synchronization. To write literal braces, remove or change the placeholder.

Changing a value updates desktop and mobile on the next load. A cached browser may need a hard refresh after a GitHub update.

## Mobile composition

The mobile header holds Sections and RSVP. Section headings and opening copy sit over the paintings, with a soft paper wash for readability. Longer sections flow into the paper beneath the artwork. Biographies stack on phones and sit side by side on tablets. RSVP inputs use 16px text and larger touch targets. The paintings are still, and section links jump directly to the destination.

## A single downloadable HTML after later edits

The supplied standalone HTML is a snapshot of the current settings. For a fresh standalone after editing `settings.js`, run:

    python3 export-standalone.py

This uses only Python's standard library and writes `wedding-rsvp-mobile-desktop.html`. The GitHub Pages version reads `settings.js` directly and does not need this step.

## RSVP status

Only Name and People in your party are requested. Until an endpoint is supplied, submission displays “Replies aren’t open yet.” With Google Sheets, the illustrated thank-you appears once the script confirms it saved the reply. Edit the thank-you text under `content["final-words"]`.

### Connect the RSVP spreadsheet

1. With the account that owns or edits the RSVP spreadsheet, open that Sheet and choose **Extensions → Apps Script**. Paste the contents of `google-sheets/Code.gs` into the script editor and save. If the sheet already has an Apps Script project, keep its code and check for existing `doGet` or `doPost` functions before adding the RSVP script.
2. Choose **Deploy → New deployment → Web app**. Select **Execute as: Me** and **Who has access: Anyone**. Authorize the script to write to the spreadsheet. The deployment accepts replies from guests without Google accounts. Set the spreadsheet's own sharing to **Restricted** to keep the guest list private.
3. Copy the Web app URL ending in `/exec` into `rsvp.endpoint` in `settings.js`. The `/dev` test URL requires editor access. Keep `index.html` and the edited `settings.js` together on GitHub Pages. To update the standalone HTML too, rerun `python3 export-standalone.py`.
4. Open the invitation in a private window and submit a sample reply. Check for one row in **Wedding RSVP Replies** and the illustrated thank-you on the site. The script creates the tab on the first reply.

The script points at the supplied RSVP spreadsheet. The web app can append or confirm a submission, and it returns only confirmation metadata. Other form services can still accept a JSON POST with `name` and `guests` and return a successful HTTP status.

## Verification

Checked the mobile layout in Chromium at 320px, 390px, 430px, 768px, and 1049px, and checked the desktop layout at 1440px. Tested the Sections menu, Motion toggle, RSVP link, and thank-you screen with a simulated RSVP response. Hardware-accelerated WebGL and a live RSVP submission were outside this check.
