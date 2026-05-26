export default {
  // Desktop font sizes
  ["desktop-1"]: calcRem(11),
  ["desktop-2"]: calcRem(12),
  ["desktop-3"]: calcRem(13),
  ["desktop-4"]: calcRem(14),
  ["desktop-5"]: calcRem(16),
  ["desktop-6"]: calcRem(18),
  ["desktop-7"]: calcRem(20),
  ["desktop-8"]: calcRem(23),
  ["desktop-9"]: calcRem(26),
  ["desktop-10"]: calcRem(29),
  ["desktop-11"]: calcRem(32),
  ["desktop-12"]: calcRem(36),
  // Mobile font sizes
  ["mobile-1"]: calcRem(12),
  ["mobile-2"]: calcRem(13),
  ["mobile-3"]: calcRem(14),
  ["mobile-4"]: calcRem(15),
  ["mobile-5"]: calcRem(16),
  ["mobile-6"]: calcRem(17),
  ["mobile-7"]: calcRem(18),
  ["mobile-8"]: calcRem(19),
  ["mobile-9"]: calcRem(21),
  ["mobile-10"]: calcRem(22),
  ["mobile-11"]: calcRem(24),
  ["mobile-12"]: calcRem(25),
};

function calcRem(px: number): string {
  return `${px / 16}rem`;
}
