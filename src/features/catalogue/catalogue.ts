export const groups = [
  "Shapes & rolls",
  "Turns & support",
  "Flight & single flips",
  "Twists & surface-specific flips",
] as const;

export type Surface = "trampoline" | "air-track";
export const surfaceNames: Record<Surface, string> = {
  trampoline: "Trampoline",
  "air-track": "Air track",
};

export const sources = {
  T: {
    name: "FTA skill terminology",
    url: "https://www.freestyletrampolineassociation.com/skills",
  },
  C: {
    name: "GRT coaching context",
    url: "https://www.grtnetwork.org/training",
  },
  G: {
    name: "FIG trampoline and tumbling code",
    url: "https://www.gymnastics.sport/publicdir/rules/files/en_1.1%20-%20TRA%20Code%20of%20Points%202025-2028.pdf",
  },
  UT: {
    name: "USA Gymnastics trampoline vocabulary",
    url: "https://static.usagym.org/PDFs/T%26T/Rules/devcop/tr.pdf",
  },
  UA: {
    name: "USA Gymnastics tumbling vocabulary",
    url: "https://static.usagym.org/PDFs/T%26T/Rules/devcop/tu.pdf",
  },
  B: {
    name: "Brentwood basic shapes",
    url: "https://brentwood-trampoline.org/about-trampolining/basic-skills/basic-shape/",
  },
  M: {
    name: "AirTrack Factory equipment context",
    url: "https://airtrackfactory.com/airtrack-factory-user-manual/",
  },
} as const;

export type Pose =
  | "straight"
  | "tuck"
  | "forward-roll"
  | "backward-roll"
  | "cartwheel"
  | "half-turn"
  | "full-turn"
  | "seat"
  | "handstand"
  | "round-off"
  | "back-tuck"
  | "front-tuck"
  | "back-straight"
  | "front-handspring"
  | "back-handspring"
  | "barani"
  | "back-full";
export type Skill = {
  id: string;
  slug: string;
  name: string;
  surface: Surface;
  group: number;
  description: string;
  orientation: string;
  pose: Pose;
  alt: string;
  sources: readonly (keyof typeof sources)[];
  foundations: readonly string[];
};

// IDs identify a movement on one surface. Never reuse them for another variant.
export const skills: readonly Skill[] = [
  {
    id: "F01",
    slug: "trampoline-straight-jump",
    name: "Straight jump",
    surface: "trampoline",
    group: 0,
    description: "An upright bounce with an extended body.",
    orientation:
      "Discuss controlled low bouncing and stopping on the approved bed.",
    pose: "straight",
    alt: "Upright adult with raised arms above a trampoline bed.",
    sources: ["T", "B"],
    foundations: [],
  },
  {
    id: "F02",
    slug: "trampoline-tuck-jump",
    name: "Tuck jump",
    surface: "trampoline",
    group: 0,
    description: "A jump with the knees bent near the torso.",
    orientation: "Recognise the tucked shape before coached bouncing.",
    pose: "tuck",
    alt: "Adult in a compact bent-knee shape above a trampoline.",
    sources: ["T", "B", "UT"],
    foundations: ["F01"],
  },
  {
    id: "F03",
    slug: "air-track-forward-roll",
    name: "Forward roll",
    surface: "air-track",
    group: 0,
    description: "Forward rotation with contact on the surface.",
    orientation: "Ask about coach-selected rounded-body preparation.",
    pose: "forward-roll",
    alt: "Rounded adult pose over an air track, labelled forward rotation.",
    sources: ["UA"],
    foundations: [],
  },
  {
    id: "F04",
    slug: "air-track-backward-roll",
    name: "Backward roll",
    surface: "air-track",
    group: 0,
    description: "Backward rotation with contact on the surface.",
    orientation: "Ask about supported backward orientation.",
    pose: "backward-roll",
    alt: "Reclined rounded adult on an air track, labelled backward rotation.",
    sources: ["UA"],
    foundations: [],
  },
  {
    id: "F05",
    slug: "air-track-cartwheel",
    name: "Cartwheel",
    surface: "air-track",
    group: 0,
    description: "A sideways hand-supported inversion.",
    orientation: "Discuss side orientation and supported hand loading.",
    pose: "cartwheel",
    alt: "Sideways inverted adult with split legs and hand support on an air track.",
    sources: ["UA", "G"],
    foundations: [],
  },
  {
    id: "F06",
    slug: "trampoline-half-turn-jump",
    name: "Half-turn jump",
    surface: "trampoline",
    group: 1,
    description: "An upright 180° turn without a somersault.",
    orientation: "Bring bounce control to coached turning preparation.",
    pose: "half-turn",
    alt: "Upright adult above a trampoline with a 180 degree turn label.",
    sources: ["UT", "G"],
    foundations: ["F01"],
  },
  {
    id: "F07",
    slug: "trampoline-full-turn-jump",
    name: "Full-turn jump",
    surface: "trampoline",
    group: 1,
    description:
      "An upright 360° turn without inversion. This is not a twisting somersault.",
    orientation: "Review controlled upright turning with your coach.",
    pose: "full-turn",
    alt: "Upright adult above a trampoline with a 360 degree upright turn label.",
    sources: ["T", "UT"],
    foundations: ["F01", "F06"],
  },
  {
    id: "F08",
    slug: "trampoline-seat-landing-to-feet",
    name: "Seat landing to feet",
    surface: "trampoline",
    group: 1,
    description: "Seated contact followed by an upright return.",
    orientation: "Confirm body-contact permission and coached preparation.",
    pose: "seat",
    alt: "Seated adult and a smaller upright endpoint over a trampoline.",
    sources: ["T", "UT"],
    foundations: ["F01"],
  },
  {
    id: "F09",
    slug: "air-track-handstand",
    name: "Handstand",
    surface: "air-track",
    group: 1,
    description: "Inverted support on the hands.",
    orientation: "Ask about supported alignment and appropriate preparation.",
    pose: "handstand",
    alt: "Vertical inverted adult with hands supported on an air track.",
    sources: ["UA"],
    foundations: [],
  },
  {
    id: "F10",
    slug: "air-track-round-off",
    name: "Round-off",
    surface: "air-track",
    group: 1,
    description: "A turning hand-supported inversion with a two-foot finish.",
    orientation: "Review cartwheel and hand-support context with your coach.",
    pose: "round-off",
    alt: "Inverted hand-supported pose and a paired-foot endpoint on an air track.",
    sources: ["UA", "G"],
    foundations: ["F05", "F09"],
  },
  {
    id: "F11",
    slug: "trampoline-backflip-tuck",
    name: "Backflip — tuck",
    surface: "trampoline",
    group: 2,
    description: "One tucked backward somersault.",
    orientation: "Discuss tucked shape and supervised backward orientation.",
    pose: "back-tuck",
    alt: "Inverted tucked adult above a trampoline, labelled backward somersault.",
    sources: ["G", "UT", "C"],
    foundations: ["F01", "F02"],
  },
  {
    id: "F12",
    slug: "trampoline-frontflip-tuck",
    name: "Frontflip — tuck",
    surface: "trampoline",
    group: 2,
    description: "One tucked forward somersault.",
    orientation: "Ask about coach-selected forward orientation preparation.",
    pose: "front-tuck",
    alt: "Inverted tucked adult above a trampoline, labelled forward somersault.",
    sources: ["G", "UT", "C"],
    foundations: ["F01", "F02"],
  },
  {
    id: "F13",
    slug: "trampoline-backflip-straight",
    name: "Backflip — straight",
    surface: "trampoline",
    group: 2,
    description: "One extended backward somersault.",
    orientation: "Discuss an established backflip and straight-body control.",
    pose: "back-straight",
    alt: "Extended inverted adult above a trampoline, labelled backward somersault.",
    sources: ["G", "UT"],
    foundations: ["F11"],
  },
  {
    id: "F14",
    slug: "air-track-front-handspring",
    name: "Front handspring",
    surface: "air-track",
    group: 2,
    description: "Forward hand-supported flight to the feet.",
    orientation:
      "Ask about supported handstand and forward-flight preparation.",
    pose: "front-handspring",
    alt: "Arched hand-supported adult above an air track, labelled forward flight.",
    sources: ["G"],
    foundations: ["F09"],
  },
  {
    id: "F15",
    slug: "air-track-back-handspring",
    name: "Back handspring",
    surface: "air-track",
    group: 2,
    description: "Backward hand-supported flight to the feet.",
    orientation: "Discuss individually supervised backward-flight preparation.",
    pose: "back-handspring",
    alt: "Backward arched adult with hand support above an air track.",
    sources: ["UA", "G"],
    foundations: ["F09", "F04"],
  },
  {
    id: "F16",
    slug: "trampoline-barani-straight",
    name: "Barani — straight",
    surface: "trampoline",
    group: 3,
    description:
      "A forward somersault with a half-twist, in an extended shape.",
    orientation:
      "Discuss forward somersault, shape and individual twisting preparation.",
    pose: "barani",
    alt: "Extended inverted adult above a trampoline, labelled forward flip and 180 degree twist.",
    sources: ["G", "T", "UT"],
    foundations: ["F12", "F06"],
  },
  {
    id: "F17",
    slug: "trampoline-back-full-straight",
    name: "Back full — straight",
    surface: "trampoline",
    group: 3,
    description:
      "A backward somersault with a full twist. Unlike an upright 360° jump, this includes inversion.",
    orientation:
      "Discuss a straight backflip and coach-selected twisting preparation.",
    pose: "back-full",
    alt: "Extended inverted adult above a trampoline, labelled backward flip and 360 degree twist.",
    sources: ["G", "T", "UT"],
    foundations: ["F11", "F13", "F06"],
  },
  {
    id: "F18",
    slug: "air-track-backflip-tuck",
    name: "Backflip — tuck",
    surface: "air-track",
    group: 3,
    description: "One tucked backward somersault in an air-track context.",
    orientation:
      "Review suitable takeoff and landing setup and backward orientation with your coach.",
    pose: "back-tuck",
    alt: "Inverted tucked adult above an air track, labelled backward somersault.",
    sources: ["UA", "G", "M"],
    foundations: ["F10", "F15"],
  },
  {
    id: "F19",
    slug: "air-track-frontflip-tuck",
    name: "Frontflip — tuck",
    surface: "air-track",
    group: 3,
    description: "One tucked forward somersault in an air-track context.",
    orientation:
      "Review suitable setup and forward orientation preparation with your coach.",
    pose: "front-tuck",
    alt: "Inverted tucked adult above an air track, labelled forward somersault.",
    sources: ["G", "M"],
    foundations: ["F03", "F14"],
  },
  {
    id: "F20",
    slug: "air-track-backflip-straight",
    name: "Backflip — straight",
    surface: "air-track",
    group: 3,
    description: "One extended backward somersault in an air-track context.",
    orientation:
      "Discuss an established same-surface backflip and straight-body control.",
    pose: "back-straight",
    alt: "Extended inverted adult above an air track, labelled backward somersault.",
    sources: ["G", "M"],
    foundations: ["F18"],
  },
];

export function validateCatalogue(catalogue: readonly Skill[]): void {
  const ids = new Map(catalogue.map((skill) => [skill.id, skill]));
  if (
    ids.size !== catalogue.length ||
    new Set(catalogue.map((s) => s.slug)).size !== catalogue.length
  )
    throw new Error("Duplicate catalogue identity");
  const visited = new Set<string>();
  const visiting = new Set<string>();
  function visit(skill: Skill) {
    if (visiting.has(skill.id)) throw new Error("Cyclic foundations");
    if (visited.has(skill.id)) return;
    visiting.add(skill.id);
    if (new Set(skill.foundations).size !== skill.foundations.length)
      throw new Error("Duplicate foundation");
    for (const id of skill.foundations) {
      const foundation = ids.get(id);
      if (
        !foundation ||
        id === skill.id ||
        foundation.surface !== skill.surface
      )
        throw new Error("Invalid foundation");
      visit(foundation);
    }
    visiting.delete(skill.id);
    visited.add(skill.id);
  }
  for (const skill of catalogue) visit(skill);
}
validateCatalogue(skills);

export function getSkill(slug: string): Skill | undefined {
  return skills.find((skill) => skill.slug === slug);
}

export function cataloguePath(
  surface = "all",
  group = "all",
  view = "all",
): string {
  const params = new URLSearchParams();
  if (surface === "trampoline" || surface === "air-track")
    params.set("surface", surface);
  if (["0", "1", "2", "3"].includes(group)) params.set("group", group);
  if (view === "progress") params.set("view", view);
  return params.size ? `/?${params}` : "/";
}

// Restrict return navigation to this application's actual routes, including filters.
export function returnPath(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  )
    return "/";
  const url = new URL(value, "https://fliplog.invalid");
  if (url.origin !== "https://fliplog.invalid") return "/";
  if (url.pathname === "/")
    return cataloguePath(
      url.searchParams.get("surface") ?? "all",
      url.searchParams.get("group") ?? "all",
      url.searchParams.get("view") ?? "all",
    );
  if (skills.some((skill) => url.pathname === `/skills/${skill.slug}`)) {
    const from = url.searchParams.get("from");
    if (!from) return url.pathname;
    const safeFrom =
      from === "/" || from.startsWith("/?") ? returnPath(from) : "/";
    return `${url.pathname}?from=${encodeURIComponent(safeFrom)}`;
  }
  return "/";
}
