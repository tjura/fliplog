import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "../../../components/header";
import {
  getSkill,
  groups,
  returnPath,
  sources,
  surfaceNames,
} from "../../../features/catalogue/catalogue";
import { SkillArt } from "../../../features/catalogue/skill-art";
import { BackToSkills } from "../../../features/catalogue/navigation";
import { getSession } from "../../../server/auth";
import { readProgress } from "../../../server/progress";
import { RatingForm } from "../../../features/progress/rating-form";
import { LevelRing } from "../../../features/progress/level-ring";
import { FoundationsSection } from "../../../features/progress/foundations-section";
import { foundationThreshold } from "../../../features/progress/foundations.ts";

export default async function SkillPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const skill = getSkill(slug);
  if (!skill) notFound();
  const session = await getSession();
  const progress = session ? readProgress(session.user.id) : {};
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <BackToSkills href={returnPath(query.from)} />
        <header className="skill-hero">
          <ul className="chip-row" aria-label="Skill context">
            <li className="chip">{surfaceNames[skill.surface]}</li>
            <li className="chip">{groups[skill.group]}</li>
            {skill.group >= 2 ? (
              <li className="chip chip-coach">Coach-led</li>
            ) : null}
          </ul>
          <SkillArt skill={skill} />
          <h1>{skill.name}</h1>
        </header>
        <p className="skill-summary">{skill.description}</p>
        <section className="detail-section">
          <h2>Your progress</h2>
          {session ? (
            <RatingForm
              key={`${session.user.id}:${skill.id}`}
              skillId={skill.id}
              initialSaved={
                progress[skill.id] ?? { rating: null, updatedAt: null }
              }
              returnTo={`/skills/${skill.slug}?from=${encodeURIComponent(returnPath(query.from))}`}
            />
          ) : (
            <>
              <div className="level-card">
                <LevelRing rating={null} />
                <p className="note">
                  Track your level for this skill on this surface.
                </p>
              </div>
              <Link
                className="button full-width"
                href={`/sign-in?returnTo=${encodeURIComponent(`/skills/${skill.slug}?from=${encodeURIComponent(returnPath(query.from))}`)}`}
              >
                Sign in to track
              </Link>
            </>
          )}
        </section>
        <FoundationsSection
          skill={skill}
          progress={session ? progress : null}
          from={returnPath(query.from)}
        />
        <details className="coach-notes">
          <summary>Coach notes and sources</summary>
          <p>{skill.orientation}</p>
          {skill.group >= 2 ? (
            <p>
              Discuss advanced skills with a qualified coach for this surface.
              Equipment and landing arrangements need individual assessment.
            </p>
          ) : null}
          <p className="note">
            Levels are personal notes for this surface, not a safety clearance.
            Level {foundationThreshold}+ on a foundation is our reminder
            threshold, not a coaching standard or permission to attempt a skill.
            Illustrations identify a movement; they do not show how to perform
            it.
          </p>
          <ul className="source-list">
            {skill.sources.map((ref) => (
              <li key={ref}>
                <a href={sources[ref].url} target="_blank" rel="noreferrer">
                  {sources[ref].name}
                </a>
              </li>
            ))}
          </ul>
          <p className="note">
            Sources support movement names and context. Our groups and
            foundation reminders are editorial suggestions, not a validated
            coaching curriculum.
          </p>
        </details>
      </main>
    </>
  );
}
