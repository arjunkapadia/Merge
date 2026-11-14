# 15 Minutes in Leonida: GTA VI trial petition

A fan petition asking **Netflix** and **Rockstar Games** to let Netflix subscribers play the
**first 15 minutes of GTA VI** on a **single-day pass**, with a **launch discount** for anyone who
wants to buy after the trial, if Rockstar agrees.

- `index.html` is the whole site (one file, no build step).
- `backend/Code.gs` is a free Google Apps Script backend that saves signatures to a Google Sheet.

Out of the box the page runs in **preview mode**: signatures are saved only in your own browser.
That's fine for filming a reel. To collect real signatures from the public, connect the backend
(takes about 5 minutes).

## 1. Connect the signature backend (Google Sheets)

1. Create a new Google Sheet, for example "GTA VI petition signatures".
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the starter code, paste in everything from `backend/Code.gs`, and save.
4. Click **Deploy → New deployment**, choose type **Web app**, and set:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, approve the permissions, and copy the **Web app URL** (ends in `/exec`).
6. Open `index.html`, find `const ENDPOINT = "";` near the bottom, and paste the URL between the quotes.

Signatures now land in the `Signatures` tab of your sheet, with duplicates blocked by email.
The live counter and "Latest signatures" list read from the same sheet.

If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## 2. Put the page online (free)

Pick one:

- **Netlify Drop**: go to app.netlify.com/drop and drag the project folder in. You get a link right away.
- **GitHub Pages**: in this repo go to **Settings → Pages**, set the source to this branch and the root folder, and save. The page appears at `https://<your-username>.github.io/<repo>/`. (Free Pages hosting needs a public repo.)
- **Vercel**: import the repo, no settings needed.

Put the final link in your Instagram/TikTok bio so people can sign from the reel.

## 3. Reel script (about 30 seconds)

Film yourself on one side and the petition page on screen (scroll from the headline to the
form, then show the counter going up after you sign).

> **[Hook, 0–3s]** "What if every Netflix subscriber could play GTA VI for free... for 15 minutes?"
>
> **[The ask, 3–12s]** "I started a petition asking Netflix and Rockstar to do a one-day GTA VI trial.
> Fifteen minutes of real gameplay, through the Netflix subscription you already pay for."
>
> **[The payoff, 12–20s]** "If you love it, you get a discount to buy the full game. Rockstar has
> to say yes, so we need to show them how many of us want this."
>
> **[Show signing, 20–26s]** "It takes 20 seconds. Name, email, done." *(sign on screen, counter ticks up)*
>
> **[CTA, 26–30s]** "Link's in my bio. Sign it, share it, and tag Netflix and Rockstar Games."

Caption idea: *15 minutes. One day. Netflix x GTA VI. Petition link in bio. #GTA6 #GTAVI #Netflix #RockstarGames*

## Keep it clean

- The page says plainly that it is an **independent fan petition**, not affiliated with Netflix,
  Rockstar Games or Take-Two. Keep that line, and don't add their logos or official artwork.
- **Nothing is sold** on the page. The "I'd buy at a discount" box is a pledge, so you can show
  Rockstar how many trial players would convert. Don't promise a discount in the reel; say
  "if Rockstar agrees".
- The counter only shows real signatures. Don't seed it with fake numbers.
- You're collecting emails, so only use them for what the form says (dedupe and updates).
