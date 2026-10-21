# AC Law website

Static website for AC Law Firm. Includes Home, About, Consultation, six service pages and five complete resources, plus redirects from the former articles routes.

## Build and preview

Use Node.js 24 or later. No dependency installation is needed.

```sh
node build.mjs
python3 -m http.server 4173 --directory dist
```

The build generates HTML. The CSS, browser JavaScript and assets in `dist/` are maintained source files, so retain them when rebuilding. Resource content and site settings are in `data/`. The same output works at a domain root or a GitHub Pages project path.

## Deployment

In repository Settings → Pages, select GitHub Actions as the source. Pushing to `main` builds and deploys only `dist/`. The workflow can also be run manually. `.nojekyll` is included.

The consultation form posts to the approved Formspree endpoint. It is in normal enquiry mode following the owner's successful delivery test. Automated local checks intercepted submissions and did not send messages.

The initial migration retains `noindex,nofollow` while final content is reviewed. This requests search-engine exclusion; the GitHub Pages URL is publicly reachable. Review indexing and canonical/share metadata when the final public destination is agreed.

A custom domain is configured separately after the initial deployment is checked. Preserve existing email DNS records when connecting the domain. No CNAME file is included yet.

Fonts are served locally. Font licences are in `dist/assets/`.
