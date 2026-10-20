# Loading improvements

- Inter and Oswald are served locally. The WOFF2 binaries are byte-for-byte
  copies of the previously referenced Google Fonts files, including all Unicode
  subsets. Duplicate declarations now use their existing variable weight ranges.
  Their original OFL licenses are included in `assets/fonts/`.
- Cyrillic fonts and the responsive home hero image are preloaded. Hero images
  have high fetch priority; the contact hero is no longer lazy-loaded.
- Header and footer markup is embedded in every customer-facing page. Boot no
  longer waits for component network requests. Shared source templates remain in
  `components/`; after editing them run `node scripts/sync-components.mjs` and
  commit the generated HTML as well. The command is repeatable.
- Content-hashed WOFF2 filenames receive a one-year immutable cache policy.
- No photograph, logo, image dimensions, image compression, text, or font design
  was changed.

## Validation

Compared with c540f9d in Chromium, using a 390 × 844 viewport, DPR 3,
150 ms network latency, 200 KB/s download and 4× CPU throttling, three cold
contexts per version:

| Measurement | Before (median) | After (median) |
| --- | ---: | ---: |
| First contentful paint | 2.528 s | 2.508 s |
| Largest contentful paint | 2.528 s | 2.508 s |
| Oswald Cyrillic response complete | 3.235 s | 0.622 s |
| Initial resource entries | 22 | 18 |

These are local diagnostic measurements with uncompressed static responses,
not a PageSpeed score or a prediction for Vercel. The main measured gain is
earlier availability of the intended fonts, rather than a large FCP/LCP change.

All eight customer-facing routes were opened without JavaScript exceptions.
The complete home page was inspected at 390 px and 1440 px widths without
horizontal overflow. Off-screen carousel images retain native lazy loading.
