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
import { FoundationsSection } from "../../../features/progress/foundations-section";

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
        <h1>{skill.name}</h1>
        <p className="skill-context">
          {surfaceNames[skill.surface]} · {groups[skill.group]}
        </p>
        <div className="detail-art">
          <SkillArt skill={skill} />
        </div>
        <section className="detail-section">
          <h2>Description</h2>
          <p>{skill.description}</p>
        </section>
        <section className="detail-section">
          <h2>Orientation for coached practice</h2>
          <p>{skill.orientation}</p>
          {skill.group >= 2 ? (
            <p className="note">
              Discuss advanced skills with a qualified coach for this surface.
              Equipment and landing arrangements need individual assessment.
            </p>
          ) : null}
        </section>
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
              <p>
                <Link
                  href={`/sign-in?returnTo=${encodeURIComponent(`/skills/${skill.slug}?from=${encodeURIComponent(returnPath(query.from))}`)}`}
                >
                  Sign in to record progress
                </Link>
              </p>
              <p className="note">Ratings belong to this surface only.</p>
            </>
          )}
        </section>
        <FoundationsSection
          skill={skill}
          progress={session ? progress : null}
          from={returnPath(query.from)}
        />
        <section className="detail-section">
          <h2>Sources & context</h2>
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
        </section>
        <p className="note">
          Your ratings are personal notes and not a safety clearance.
          Illustrations identify a movement; they do not show how to perform it.
        </p>
      </main>
    </>
  );
}
