<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:teamsnap-design-system -->
# TeamSnap Design System

When creating or modifying React components, always follow the TeamSnap Design System guidelines.

**Design System Skill**: `/Users/tylerpalmer/Downloads/TeamSnap Design System/SKILL.md`

Key principles:
- **Admin surfaces** use Wave Blue (`#1447e6`) as the action color
- **Consumer surfaces** use Blaze Orange (`#fa6700`) as the action color
- Use semantic color tokens (`--color-admin-action-*` or `--color-consumer-action-*`), never hardcode colors
- Use semantic type scale (`.text-body`, `.text-heading-md`, etc.), not raw sizes
- Follow 8px spacing base with 4px half-steps
- Pills for buttons/badges (radius 9999px), 8px for cards, small radius for inputs
- Implement proper states: hover (darken), press (scale 0.98), focus (ring), disabled (gray-3 background)
- Admin copy: operator-direct, low-friction, second-person imperatives
- Consumer copy: warmer, enthusiastic but grounded
- Sentence case everywhere except status pills (LIVE/FINAL) and short labels
- Use Material Symbols Rounded for icons via codepoints
- Animation: 180-250ms ease, press scale 0.98, no bounces/springs

**Resources**:
- Storybook: https://ts-design-system.netlify.app/
- Figma TSDS 2.0: https://www.figma.com/file/aONDplsfQ9nQXKg1HjVm1z/TSDS-2.0-(beta)
<!-- END:teamsnap-design-system -->
