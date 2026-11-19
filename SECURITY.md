# Security

## How this site is protected
- **No server, no database, no accounts.** The site is static HTML/CSS/JS on GitHub Pages (served over HTTPS only). There is nothing on a server to break into and no student data stored anywhere except the student's own browser.
- **Content-Security-Policy** (in `index.html`) allows scripts only from this site. No inline scripts, `eval`, plugins or form posts.
- **Anti-clickjacking:** `js/boot.js` refuses to render inside another site's frame.
- **Output escaping:** all text, including question data and the candidate name, is HTML-escaped before display. Saved progress and results read from `localStorage` are validated before use.
- **Links** to external sites use `rel="noopener noreferrer"`, and only `https://` and `mailto:` links are allowed.
- **Repository:** the `main` branch is protected against force-push and deletion, and secret scanning with push protection is enabled.

## Reporting a vulnerability
Please use **GitHub → Security → Report a vulnerability** on this repository (private reporting). Do not open a public issue for security problems.
