import Link from "next/link";
import { surfaceNames, type Skill } from "../catalogue/catalogue";
import { foundationReminders, foundationThreshold } from "./foundations.ts";
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
      <h2>Foundations to discuss</h2>
      <p className="note">
        A recorded self-rating of {foundationThreshold}+ is our reminder
        threshold, not a coaching standard or permission to attempt this skill.
      </p>
      {reminders.length ? (
        <ul className="foundation-list">
          {reminders.map((reminder) => (
            <li key={reminder.skill.id}>
              <Link
                href={`/skills/${reminder.skill.slug}?from=${encodeURIComponent(from)}`}
              >
                {reminder.skill.name}
              </Link>
              <p className="note">{surfaceNames[reminder.skill.surface]}</p>
              {reminder.rating === undefined ? (
                <p>Sign in to see your recorded foundation.</p>
              ) : (
                <>
                  <p>
                    {ratingText(reminder.rating)} · reminder level{" "}
                    {foundationThreshold}+
                  </p>
                  <p
                    className={
                      reminder.recorded ? "recorded-foundation" : undefined
                    }
                  >
                    {reminder.recorded
                      ? "Recorded foundation — still discuss with your coach"
                      : "Foundation not yet recorded at this level"}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          No linked foundations in this small catalogue. Your coach can help
          choose suitable preparation.
        </p>
      )}
    </section>
  );
}
