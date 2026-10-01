# React + Vite

## Production verification

The landing page uses `/products/preview/featured` and `/products/preview/latest`
without query parameters. Both endpoints must return `{ success: true, data: [...] }`.
Catalog, detail, cart, wishlist, orders, and checkout remain authenticated. Guest
actions lead to login with the destination preserved; cart/wishlist actions can be
completed from the product page after login.

A non-secret localStorage flag (`sekjad-session-present`) enables cookie-based
session restoration after a successful sign-in. Fresh guests do not request token
refresh. The flag grants no access; only a server-issued token establishes a
session. Existing users without this new flag need to sign in once after deployment.
If browser storage is unavailable, sessions work until the page is reloaded.

`node scripts/verify-preview-flows.mjs` runs isolated Chromium browser checks
against a mock API, including guest routes/actions, login return, bearer requests,
and preview loading/empty/error states. Set `BROWSER_PATH` if Chromium is not in
one of the default Windows locations. This does not contact the production API.

Run `npm run lint`, `npm test`, and `npm run build` before deployment. Configure
the production `VITE_API_URL` and Google client ID before building. The hosting
server must serve `index.html` for application routes, including `/checkout/return`.

The payment return page verifies payment and refreshes cached cart/order data;
it never deletes the current cart. The backend must finalize payments idempotently
and reconcile only purchased quantities against the checkout snapshot, preserving
items added afterward. Verify this behavior in staging before accepting payments.

Before launch, check login, expired-session refresh, Google sign-in, logout,
checkout success/failure, old payment links, contact delivery, and direct-route
reloads against the deployed backend. Confirm production HTTPS, CORS, and refresh
cookie settings. Local tests do not validate these deployment settings.

## Contact form email

Both contact forms submit to `POST /api/v1/contact` through `VITE_API_URL`.
The backend uses `RESEND_API_KEY`, `MAIL_FROM`, and `CONTACT_TO`; never put
the API key in a `VITE_` environment variable.

For the current test setup, `MAIL_FROM` is
`Sekjad Enterprise <onboarding@resend.dev>` and `CONTACT_TO` is
`adebanjoisrael940@gmail.com`. This recipient must be the Resend account email
while using the onboarding sender. Restart the backend after changing its
environment. For production, configure a verified sender domain in Resend.

Submissions are validated and limited to three requests per IP per 15 minutes.
The visitor's email is used as Reply-To. Success means Resend accepted the
message; final inbox delivery is not guaranteed by that response.

## Google sign-in setup

Set `VITE_API_URL` to the backend API root (including `/api/v1`) and
`VITE_GOOGLE_CLIENT_ID` to the same public Web application client ID used by the
backend's `GOOGLE_CLIENT_ID`. See `.env.example`. Restart Vite after changing
environment values; rebuild for production.

In Google Cloud, authorize the exact frontend origins, including the local Vite
origin and port. Configure the consent screen and test users when in testing.
The popup flow needs no frontend client secret or redirect URI. The shared
Google button loads GIS once and sends its ID token as JSON to `/auth/google`.
Both login and registration establish the existing session and navigate to the
requested page or `/home`. Backend errors are displayed beside the button.
See [Google's JavaScript reference](https://developers.google.com/identity/gsi/web/reference/js-reference).

Before deploying the corresponding backend against an existing database, run
`node scripts/migrate-google-auth.js` in the backend repository during a
maintenance window with registration/profile writes stopped, then restart the
backend. This frontend repository does not contain that migration. Configure
backend `BASE_URL` CORS and refresh cookies for the frontend origin and production
HTTPS/site topology. Requests already use `withCredentials: true`.

Google accounts can fill in phone/name through the profile page. To create a
password, use the existing forgot/reset-password email OTP flow. Matching email
accounts that cannot be automatically linked must use their existing login method.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
