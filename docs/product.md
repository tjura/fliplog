# Product behavior

FLIPLOG helps adult recreational learners keep a private current record of
trampoline and air-track acrobatics between coached practices.

## Catalogue and navigation

The public catalogue has 20 surface-specific skills in four groups of five.
Surface and group filters narrow the list. Each detail shows an original SVG,
description, orientation note, foundation links and sources. Back to skills
preserves the selected catalogue filters and scroll position.

The same movement on different surfaces has separate IDs and progress.
Groups organize browsing; they do not define a training sequence.

## Self-ratings

| Value     | Label                     |
| --------- | ------------------------- |
| No record | Not started               |
| 1         | Started learning          |
| 2         | Working on the basics     |
| 3         | Building consistency      |
| 4         | Usually consistent        |
| 5         | Consistent in my practice |

Opening a skill creates no record. Selecting a rating changes a draft; Save
commits it. The confirmed value and update date remain visible. Cancelled reset
keeps the record; confirmed reset clears only the selected skill.

Save errors retain the draft and last confirmed value, with retry feedback.
An expired session offers sign-in. A full auth navigation discards the in-memory
draft, so the learner reselects it after returning. Login never submits a draft.

## Foundation reminders and My progress

Foundation links stay on the same surface. A saved self-rating of at least 4
changes a reminder's recorded state. Lowering or clearing a foundation
recomputes that state while preserving any rating on the dependent skill.
Guests see that personal foundation state requires sign-in.

My progress lists only the signed-in user's non-null records and supports the
same filters. It distinguishes an empty journal from a filter with no matches,
with links to browse skills or clear filters.

## Scope

Email/password accounts protect the journal. There is no email verification,
password recovery, session history, coach account, social feed or offline sync.

Sign-in distinguishes incorrect credentials, rate limits and unavailable account
access. Error feedback stays generic; Retry preserves the intended return page.

Descriptions and illustrations identify movements. Groups, reminder edges and
the threshold are editorial; advanced content has not been validated as a
coaching curriculum. Ratings do not override a coach's equipment, preparation
or supervision decisions. [Catalogue sources](catalogue.md) explain the context.

The interface uses native controls, labelled rating radios, visible focus,
44px rating targets and reduced-motion CSS. The
[release checklist](quality.md#manual-release-checklist) covers mobile and
accessibility checks.
