import type { Pose, Skill } from "./catalogue";

type Drawing = {
  head: [number, number];
  body: string;
  limbs: string;
  label?: string;
  transform?: string;
};
const upright: Drawing = {
  head: [120, 27],
  body: "M113 40 L127 40 L131 71 L109 71 Z",
  limbs:
    "M113 46 L100 31 L94 17 M127 46 L140 31 L146 17 M115 73 L115 104 M125 73 L125 104",
};
const tucked: Drawing = {
  head: [105, 48],
  body: "M111 55 L131 62 L127 79 L109 69 Z",
  limbs:
    "M116 60 L106 82 L126 84 M127 77 L144 63 L143 88 L128 93 M115 72 L135 57 L132 78",
};
const inverted: Drawing = {
  head: [120, 93],
  body: "M109 77 L131 77 L127 49 L113 49 Z",
  limbs: "M111 73 L106 100 M129 73 L134 100 M116 46 L111 18 M124 46 L132 18",
};
const drawings: Record<Pose, Drawing> = {
  straight: upright,
  tuck: tucked,
  "forward-roll": {
    head: [147, 94],
    body: "M139 84 Q117 62 99 86 L108 101 L133 98 Z",
    limbs: "M132 91 L153 105 M108 94 L93 105 M104 83 L118 70 L136 76",
    label: "Forward roll",
  },
  "backward-roll": {
    head: [93, 96],
    body: "M103 95 L131 99 L137 84 Q113 77 103 95 Z",
    limbs: "M105 91 L85 107 M131 91 L141 65 L117 49 M124 94 L130 64 L108 51",
    label: "Backward roll",
  },
  cartwheel: {
    head: [121, 94],
    body: "M111 76 L132 79 L138 56 L120 52 Z",
    limbs:
      "M115 77 L101 106 M129 80 L137 106 M126 51 L99 28 L81 24 M136 57 L158 38 L176 34",
    label: "Sideways",
  },
  "half-turn": { ...upright, label: "Upright · 180°" },
  "full-turn": {
    ...upright,
    limbs:
      "M113 46 L98 61 L119 65 M127 46 L142 58 L126 64 M115 73 L115 104 M125 73 L125 104",
    label: "Upright · 360°",
  },
  seat: {
    head: [97, 50],
    body: "M91 62 L105 62 L112 92 L94 93 Z",
    limbs: "M99 68 L121 81 M108 91 L135 92 L155 95 M97 94 L129 100 L153 104",
    label: "Seat → feet",
  },
  handstand: { ...inverted, label: "Hand support" },
  "round-off": {
    ...inverted,
    limbs: "M111 73 L101 106 M129 73 L137 106 M116 46 L104 20 M124 46 L133 20",
    label: "Turn · two-foot finish",
  },
  "back-tuck": {
    ...tucked,
    transform: "rotate(-135 120 70)",
    label: "Backward flip · tuck",
  },
  "front-tuck": {
    ...tucked,
    transform: "rotate(135 120 70)",
    label: "Forward flip · tuck",
  },
  "back-straight": {
    ...inverted,
    transform: "rotate(-30 120 62)",
    label: "Backward flip · straight",
  },
  "front-handspring": {
    head: [147, 85],
    body: "M119 51 Q140 59 141 76 L125 80 Q122 66 110 63 Z",
    limbs: "M135 75 L154 106 M127 76 L140 106 M113 54 L97 30 M119 58 L102 34",
    label: "Forward flight",
  },
  "back-handspring": {
    head: [96, 81],
    body: "M106 76 Q105 60 129 52 L139 65 Q116 66 119 80 Z",
    limbs:
      "M112 75 L96 106 M106 75 L85 103 M130 58 L153 40 L164 50 M137 65 L156 57 L169 62",
    label: "Backward flight",
  },
  barani: {
    ...inverted,
    transform: "rotate(25 120 62)",
    label: "Forward flip · 180° twist",
  },
  "back-full": {
    ...inverted,
    transform: "rotate(-25 120 62)",
    label: "Backward flip · 360° twist",
  },
};

export function SkillArt({
  skill,
  decorative = false,
}: {
  skill: Skill;
  decorative?: boolean;
}) {
  const drawing = drawings[skill.pose];
  return (
    <svg
      viewBox="0 0 240 150"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : skill.alt}
      aria-hidden={decorative || undefined}
      className="skill-art"
    >
      <ellipse className="art-shadow" cx="120" cy="124" rx="92" ry="8" />
      {skill.surface === "trampoline" ? (
        <g className="art-ink" strokeWidth="3" strokeLinejoin="round">
          <path
            className="art-bed"
            d="M35 112 L52 104 H188 L205 112 L199 117 H41 Z"
          />
          <path
            className="art-bed-line"
            d="M50 110 H189 M57 107 H183"
            strokeWidth="1"
          />
          <path d="M49 117 L45 133 M190 117 L195 133 M68 117 L77 129 M171 117 L163 129" />
        </g>
      ) : (
        <g className="art-ink" strokeWidth="3">
          <rect
            className="art-track"
            x="31"
            y="106"
            width="178"
            height="19"
            rx="8"
          />
          <path
            className="art-track-top"
            d="M32 113 Q32 106 40 106 H200 Q208 106 208 113 H32 Z"
          />
        </g>
      )}
      <g
        transform={drawing.transform}
        className="art-ink"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={drawing.limbs} fill="none" />
        <path className="art-body" d={drawing.body} strokeWidth="3" />
        <circle
          cx={drawing.head[0]}
          cy={drawing.head[1]}
          r="9"
          className="art-skin"
          strokeWidth="3"
        />
      </g>
      {skill.pose === "seat" || skill.pose === "round-off" ? (
        <g
          transform="translate(92 28) scale(.7)"
          className="art-ink"
          strokeWidth="5"
          strokeLinecap="round"
        >
          <path d={upright.limbs} fill="none" />
          <path className="art-body" d={upright.body} strokeWidth="3" />
          <circle className="art-skin" cx="120" cy="27" r="9" strokeWidth="3" />
        </g>
      ) : null}
      {drawing.label && !decorative ? (
        <text
          x="120"
          y="147"
          textAnchor="middle"
          className="art-label"
          fontSize="10"
          fontFamily="system-ui, sans-serif"
        >
          {drawing.label}
        </text>
      ) : null}
    </svg>
  );
}
