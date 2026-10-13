import { skills, type Skill } from "../catalogue/catalogue.ts";
import type { ProgressMap } from "./rules.ts";

export const foundationThreshold = 4;

export function foundationReminders(
  skill: Skill,
  progress: Readonly<ProgressMap> | null,
) {
  return skill.foundations.map((id) => {
    const foundation = skills.find((entry) => entry.id === id);
    if (!foundation || foundation.surface !== skill.surface)
      throw new Error("Invalid foundation configuration");
    // undefined means the guest's personal state is unknown; null means no own record.
    const rating =
      progress === null ? undefined : (progress[id]?.rating ?? null);
    return {
      skill: foundation,
      rating,
      recorded:
        rating === undefined
          ? undefined
          : rating !== null && rating >= foundationThreshold,
    };
  });
}

export function visibleSkills(
  surface: string,
  group: string,
  onlyProgress: boolean,
  progress: Readonly<ProgressMap>,
) {
  return skills.filter(
    (skill) =>
      (surface === "all" || skill.surface === surface) &&
      (group === "all" || skill.group === Number(group)) &&
      (!onlyProgress || progress[skill.id]?.rating != null),
  );
}
