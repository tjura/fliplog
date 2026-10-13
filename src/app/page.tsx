import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "../components/header";
import {
  cataloguePath,
  groups,
  surfaceNames,
} from "../features/catalogue/catalogue";
import { Filters } from "../features/catalogue/filters";
import { SkillArt } from "../features/catalogue/skill-art";
import { CataloguePosition, SkillLink } from "../features/catalogue/navigation";
import { getSession } from "../server/auth";
import { readProgress } from "../server/progress";
import { visibleSkills } from "../features/progress/foundations.ts";
import { ratingText } from "../features/progress/rules.ts";

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const surface =
    params.surface === "trampoline" || params.surface === "air-track"
      ? params.surface
      : "all";
  const group =
    typeof params.group === "string" &&
    ["0", "1", "2", "3"].includes(params.group)
      ? params.group
      : "all";
  const view = params.view === "progress" ? "progress" : "all";
  const from = cataloguePath(surface, group, view);
  const session = await getSession();
  if (view === "progress" && !session)
    redirect(`/sign-in?returnTo=${encodeURIComponent(from)}`);
  const progress = session ? readProgress(session.user.id) : {};
  const filtered = visibleSkills(surface, group, view === "progress", progress);
  const emptyProgress = view === "progress" && !Object.keys(progress).length;
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <CataloguePosition path={from} />
        <div className="intro">
          {view === "progress" ? (
            <>
              <h1>My progress</h1>
              <p>Your current record. One surface, one skill at a time.</p>
            </>
          ) : (
            <>
              <h1>
                A little progress.
                <br />
                Every practice.
              </h1>
              <p>
                Record a private self-rating for each skill, on the trampoline
                and air track.
              </p>
            </>
          )}
        </div>
        {session ? (
          <nav aria-label="Journal view" className="journal-nav">
            <Link
              href={cataloguePath(surface, group)}
              aria-current={view === "all" ? "page" : undefined}
            >
              All skills
            </Link>
            <Link
              href={cataloguePath(surface, group, "progress")}
              aria-current={view === "progress" ? "page" : undefined}
            >
              My progress
            </Link>
          </nav>
        ) : null}
        <Filters surface={surface} group={group} view={view} />
        {groups.map((name, index) => {
          const entries = filtered.filter((skill) => skill.group === index);
          return entries.length ? (
            <section
              className="skill-group"
              key={name}
              aria-labelledby={`group-${index}`}
            >
              <h2 id={`group-${index}`}>{name}</h2>
              <ul className="skill-list">
                {entries.map((skill) => (
                  <li key={skill.id}>
                    <SkillLink
                      href={`/skills/${skill.slug}?from=${encodeURIComponent(from)}`}
                    >
                      <SkillArt skill={skill} decorative />
                      <span className="row-copy">
                        <strong>{skill.name}</strong>
                        <span>{surfaceNames[skill.surface]}</span>
                        {session ? (
                          <span className="row-rating">
                            {ratingText(progress[skill.id]?.rating ?? null)}
                          </span>
                        ) : null}
                      </span>
                      <svg
                        className="chevron"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="m9 5 7 7-7 7" />
                      </svg>
                    </SkillLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null;
        })}
        {!filtered.length ? (
          <div className="empty">
            <h2>
              {emptyProgress
                ? "No skills recorded yet"
                : "No skills match these filters"}
            </h2>
            <p>
              {emptyProgress
                ? "Open a skill and save your own self-rating to find it here."
                : "Try another surface or group."}
            </p>
            <Link
              className="button secondary"
              href={emptyProgress ? "/" : cataloguePath("all", "all", view)}
            >
              {emptyProgress ? "Browse skills" : "Clear filters"}
            </Link>
          </div>
        ) : null}
        <p className="note">
          A personal journal for adult learners in coached practice. Groups are
          browsing categories, not a training progression.
        </p>
      </main>
    </>
  );
}
