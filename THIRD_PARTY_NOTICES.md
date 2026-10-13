# Third-party notices

FLIPLOG's MIT license covers its original code, copy and SVG geometry. It does
not relicense dependencies or the upstream license texts in `third_party/`. The
repository contains dependency manifests rather than vendored implementation
code. Installed packages keep their own notices; the runtime also includes
`third_party/` to cover packages that omit root license files and the bundled
native image libraries.

| Component                                                   | License                                        | Original source                                                                     |
| ----------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| Next.js 16.4.0 and @next packages                           | MIT                                            | https://github.com/vercel/next.js                                                   |
| React / React DOM 19.3.0; client-only / server-only markers | MIT                                            | https://github.com/facebook/react                                                   |
| Better Auth 1.7.7; @better-auth/utils 0.4.2 / 0.5.0         | MIT                                            | https://github.com/better-auth/better-auth and https://github.com/better-auth/utils |
| better-sqlite3 13.0.3                                       | MIT; embedded SQLite is public domain          | https://github.com/WiseLibs/better-sqlite3 and https://sqlite.org/copyright.html    |
| sharp 0.35.5                                                | Apache-2.0                                     | https://github.com/lovell/sharp/tree/v0.35.5                                        |
| sharp-libvips packages 1.3.4 / libvips 8.18.7               | LGPL-3.0-or-later and bundled library licenses | https://github.com/lovell/sharp-libvips                                             |
| caniuse-lite 1.0.30001815                                   | CC-BY-4.0                                      | https://github.com/browserslist/caniuse-lite                                        |

Browser compatibility data comes from [Can I use](https://caniuse.com), provided
through caniuse-lite by its upstream authors. It is used unchanged by the
framework; FLIPLOG does not claim authorship of this data.

Other resolved runtime packages declare MIT, ISC, BSD-3-Clause or 0BSD licenses.
Their versions and source locations are recorded in package-lock.json and their
installed package metadata. The official Node/Debian image retains its own
software notices, including Node's bundled third-party components.

The native sharp/libvips packages are unmodified, dynamically loaded libraries.
Their bundled-library notice is copied verbatim in
[sharp-libvips.NOTICE.md](third_party/sharp-libvips.NOTICE.md); it lists each
library's terms. GPLv3/LGPLv3 texts are retained alongside it. Corresponding
source, build scripts and source download versions are available from the
sharp-libvips repository and the installed `versions.json`. A modified image
may replace/rebuild these shared libraries following
[sharp's native installation instructions](https://sharp.pixelplumbing.com/install/).
The demo uses original inline SVGs and does not call the image optimizer.

Upstream texts in `third_party/` are preserved verbatim and excluded from
formatting. This notice is not a claim that every dependency uses MIT.
