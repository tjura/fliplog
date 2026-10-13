# Catalogue and sources

The canonical [typed catalogue](../src/features/catalogue/catalogue.ts) contains
20 variants representing 17 movement identities: 10 trampoline entries and
10 air-track entries, in four browsing groups of five.

## Data rules

Skill IDs F01–F20 remain stable because saved progress uses them. A movement on
another surface receives a separate ID: F11/F18 are tucked backflips, F12/F19
tucked frontflips and F13/F20 straight backflips. Progress never transfers between
them.

Foundation edges reference known IDs on the same surface. Catalogue validation
rejects unknown, duplicate, self-referencing and cyclic edges. A rating of at
least 4 changes an advisory reminder; it is not a prescribed teaching order.

To change an entry, update its description, orientation, source references and
art together. Do not reuse an existing ID for a different movement or surface.
Review domain tests and the rendered detail afterwards.

## Source context

Sources support movement names and equipment/coaching context. The four groups,
foundation graph and self-rating scale are our editorial choices. Competition
codes do not prescribe a learning progression on a park bed or inflatable track.
The app does not know the learner's venue, equipment model or coach.

| Source                                                                                                                                                                                           | Use                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| [FIG trampoline/tumbling code](https://www.gymnastics.sport/publicdir/rules/files/en_1.1%20-%20TRA%20Code%20of%20Points%202025-2028.pdf)                                                         | Somersault, shape and twisting terminology                     |
| [USA Gymnastics trampoline code](https://static.usagym.org/PDFs/T%26T/Rules/devcop/tr.pdf)                                                                                                       | Trampoline shapes, turns, landings and flips                   |
| [USA Gymnastics tumbling code](https://static.usagym.org/PDFs/T%26T/Rules/devcop/tu.pdf)                                                                                                         | Rolls, hand-supported skills and tumbling terminology          |
| [FTA terms](https://www.freestyletrampolineassociation.com/skills)                                                                                                                               | Freestyle names, cross-checked where definitions conflict      |
| [GRT training](https://www.grtnetwork.org/training) and [FTA safety](https://www.freestyletrampolineassociation.com/safety)                                                                      | Public coached-practice context                                |
| [Brentwood bounces](https://brentwood-trampoline.org/about-trampolining/basic-skills/basic-bounces/) and [shapes](https://brentwood-trampoline.org/about-trampolining/basic-skills/basic-shape/) | Basic bounce and body-shape vocabulary                         |
| [AirTrack Factory manual](https://airtrackfactory.com/resources/uploads/2021/11/2021-ProUseManual-ENG-Digital.pdf)                                                                               | Manufacturer-specific equipment limits, not a skill curriculum |

Sources were checked on 2026-10-13. FTA's half-turn definition gives 90° despite
opposite-facing endpoints; the app uses 180°, cross-checked against federation
terminology. The manufacturer's manual does not establish settings or permissions
for an unknown model.

## Illustrations and content limits

[SkillArt](../src/features/catalogue/skill-art.tsx) renders original inline SVG
geometry. Surface baselines, poses, captions and alt text distinguish movement
identities. No source illustrations, paid course material or private code were
copied.

The art identifies a movement; it is not a timed execution diagram. Orientation
notes prompt discussion with a coach. Advanced notes and foundation relationships
need qualified content review before being presented as training instruction.
