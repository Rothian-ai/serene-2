# Deploying

## Vercel builds a commit only if it recognises the author

Vercel's Git integration checks the **author email of the commit** against the
accounts authorised on the project. If it cannot match one, it does not build
and it does not fail either: no email, no red cross, nothing in the GitHub
checks. The site simply keeps serving the last commit it did accept, which is
invisible unless you diff the deployed HTML against the branch.

This has bitten this project twice.

**Once from a collaborator.** Eight commits by a contributor with no Vercel
access sat on `beta` unbuilt. The code was fine; it type-checked and built.

**Once from the owner's own machine**, which is the surprising one. These
deployed:

    c831ec6  author 71801164+luismayrina@users.noreply.github.com   built
    02d94e9  author 71801164+luismayrina@users.noreply.github.com   built

and these, three commits later on the same machine, did not:

    8b34663  author admin@rothian.com                               skipped
    cfd7f62  author admin@rothian.com                               skipped
    668ae57  author admin@rothian.com                               skipped

Same person, same repository, same push. Only `user.email` differed, because
the global git config carries `admin@rothian.com` and Vercel has no way to know
that address belongs to an authorised account.

## What to do about it

**A. Deploy from Actions instead — the durable answer.** `deploy.yml` deploys
with a project token, so who wrote the commit stops mattering. It needs three
repository secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`);
they are documented at the top of that file. This is the only option that also
covers collaborators.

**B. Make the address recognisable.** Add `admin@rothian.com` as a verified
email on the GitHub account, at GitHub -> Settings -> Emails. Vercel then
matches it and every commit from this machine builds. Free, and about a minute.

**C. Set the identity per repository.** Already done here:

    git config --local user.email 71801164+luismayrina@users.noreply.github.com

Repo-local, so the global config is untouched. It fixes future commits from
this clone and nothing else — a fresh clone, or another machine, brings the
problem back.

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
