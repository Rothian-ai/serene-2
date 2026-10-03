# Deploying

## Where production runs

Production is the Vercel project `serene-2` on the admin@rothian.com account,
connected to `Rothian-ai/serene-2`. It builds the `beta` branch and serves it at
www.serenebay.ae and serenebay.ae. `main` is not production.

Until 26 Sep 2026 this repository lived at `luismayrina/serene-2` and deployed
from Luis Mayrina's Vercel. That copy is stale and nothing deploys from it, so
push to `Rothian-ai/serene-2` only. A clone that still has the old address as
its `origin` needs re-pointing:

    git remote set-url origin https://github.com/Rothian-ai/serene-2.git

## Vercel builds a commit only if it recognises the author

Vercel's Git integration checks the **author email of the commit** against the
accounts with access to the project. If it cannot match one, it does not build
the commit, and the site keeps serving the last commit it did accept. That is
easy to miss unless you compare the deployed site with the branch.

On this project the recognised author is **admin@rothian.com** (GitHub:
`Rothian-ai`), the account that owns it. A commit authored as anyone else, a
collaborator or a personal address on the same machine, is not built.

The previous project was bitten by this twice: eight commits by a collaborator
with no Vercel access sat on `beta` unbuilt, and later the owner's own commits
were skipped because they carried an address that project did not recognise.

## What to do about it

**A. Set the identity in every clone you commit from.**

    git config --local user.name "Rothian-ai"
    git config --local user.email admin@rothian.com

Repo-local, so the global config is untouched. It covers future commits from
that clone only; a fresh clone, or another machine, needs the same two lines.

**B. Deploy from Actions instead — the durable answer.** `deploy.yml` deploys
with a project token, so who wrote the commit stops mattering. It needs three
repository secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`);
they are documented at the top of that file. This is the only option that also
covers collaborators.

## Checking whether the branch is actually live

`git log` says nothing about what is deployed. Compare the rendered output:

    node scripts/warm-cache.mjs           # every property, timings and cache state

and grep the live HTML for a string only the newest commit introduces. A build
hash works too: the stylesheet is `/assets/root-<hash>.css` in both the local
`build/client/index.html` and the served page, and the hashes should agree.

A deploy also empties the CDN cache in front of the catalogue, and Amelia takes
about ten seconds per project, so re-run the warmer after one.

## While the Actions secrets are missing

The Deploy workflow shows a red cross on every push because the three
`VERCEL_*` repository secrets have never been added. That cross is noise, not
a failed deploy: the Vercel Git integration is what actually builds `beta`,
and it only builds commits whose author email it recognises (see above).
Until the secrets exist, judge a deploy by the site itself, not by Actions.
