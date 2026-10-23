import Link from "next/link";
import type { Skill } from "../catalogue/catalogue";
import { SkillArt } from "../catalogue/skill-art";
import { foundationReminders, foundationThreshold } from "./foundations.ts";
import { LevelRing } from "./level-ring";
import { ratingText, type ProgressMap } from "./rules.ts";

export function FoundationsSection({
  skill,
  progress,
  from,
}: {
  skill: Skill;
  progress: ProgressMap | null;
  from: string;
}) {
  const reminders = foundationReminders(skill, progress);
  return (
    <section className="detail-section">
      <h2>Builds on</h2>
      {reminders.length ? (
        <ul className="foundation-list">
          {reminders.map((reminder) => (
            <li key={reminder.skill.id}>
              <Link
                className="foundation-tile"
                href={`/skills/${reminder.skill.slug}?from=${encodeURIComponent(from)}`}
              >
                <SkillArt skill={reminder.skill} decorative />
                <span className="row-copy">
                  <strong>{reminder.skill.name}</strong>
                  {reminder.rating === undefined ? (
                    <span>Sign in to see your level</span>
                  ) : reminder.recorded ? (
                    <span className="recorded-foundation">
                      {ratingText(reminder.rating)}
                      <span className="visually-hidden">
                        {" "}
                        · recorded foundation
                      </span>
                    </span>
                  ) : (
                    <span>
                      {ratingText(reminder.rating)} · aim for{" "}
                      {foundationThreshold}+
                    </span>
                  )}
                </span>
                {reminder.rating === undefined ? null : reminder.recorded ? (
                  <svg
                    className="foundation-check"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="11" />
                    <path d="m7 12.5 3.2 3.2L17 9" />
                  </svg>
                ) : (
                  <LevelRing rating={reminder.rating} size={40} />
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="starting-skill">
          <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 21V4m0 0h11l-2 4 2 4H6" strokeLinejoin="round" />
          </svg>
          Starting skill — nothing to build on first
        </p>
      )}
    </section>
  );
}
