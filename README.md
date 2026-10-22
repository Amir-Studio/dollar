# AUREL — A clearer view of value

A responsive, bilingual (English/Persian) market-reference website for gold and currency data.

## Deploy on GitHub Pages
1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose `main` and `/ (root)`, then save.
4. Once Pages finishes building, the site should be available at `https://amir-studio.github.io/dollar/`.

## Data and limitations
- Gold spot reference: public endpoint at Gold-API. Availability, latency, and terms are controlled by that provider.
- FX reference: open.er-api.com USD-base reference feed. These are not guaranteed tradable prices; **IRR values are not Iranian free-market quotes**.
- The chart panel explicitly reports that historical data is not connected. It does not generate a synthetic line or pretend to show historical prices.
- Gold estimator uses 31.1034768 grams per troy ounce and selected purity; excludes local premiums, fees, tax and dealer spreads.
- Quotes can fail to load if the provider, browser, or network blocks a request. The UI should report this rather than fabricate prices.

## Advertising
The page contains a responsive reserved ad slot, not a live network script. Add the ad network's exact publisher-approved tag only after the site is approved and the network's policies and regional eligibility have been checked. Do not add AMP components to this standard HTML page unless converting the entire page to a valid AMP document. Never click your own ads or encourage invalid traffic.

## Brand and contact
AUREL is a working brand concept. Public contact currently displayed: `amir0website@gmail.com` and `+98 902 513 1506`. Confirm these are appropriate for this project before launch; the `aurel.markets` domain is not claimed or assumed to be owned.

## Before monetization
- Verify data-source terms, accuracy and CORS behavior.
- Review the included draft privacy notice and confirm whether additional cookie/consent controls are legally required for the actual advertising setup.
- Replace the reserved ad slot with the provider's approved code.
- Test keyboard navigation, mobile layout, and all links.
- Do not present this site as a regulated financial service.
