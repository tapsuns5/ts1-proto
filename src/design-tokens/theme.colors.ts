const themeColors = {
  "admin-action": {
    background: "rgb(var(--color-admin-action-background-rgb) / <alpha-value>)",
    "background-hover":
      "rgb(var(--color-admin-action-background-hover-rgb) / <alpha-value>)",
    "background-pressed":
      "rgb(var(--color-admin-action-background-pressed-rgb) / <alpha-value>)",
    border: "rgb(var(--color-admin-action-border-rgb) / <alpha-value>)",
    "border-hover":
      "rgb(var(--color-admin-action-border-hover-rgb) / <alpha-value>)",
    "border-pressed":
      "rgb(var(--color-admin-action-border-pressed-rgb) / <alpha-value>)",
    "border-weak":
      "rgb(var(--color-admin-action-border-weak-rgb) / <alpha-value>)",
    text: "rgb(var(--color-admin-action-text-rgb) / <alpha-value>)",
    "text-hover":
      "rgb(var(--color-admin-action-text-hover-rgb) / <alpha-value>)",
    "text-pressed":
      "rgb(var(--color-admin-action-text-pressed-rgb) / <alpha-value>)",
    "background-weak-hover":
      "rgb(var(--color-admin-action-background-weak-hover-rgb) / <alpha-value>)",
    "background-weak-pressed":
      "rgb(var(--color-admin-action-background-weak-pressed-rgb) / <alpha-value>)",
    icon: "rgb(var(--color-admin-action-icon-rgb) / <alpha-value>)",
    "icon-hover":
      "rgb(var(--color-admin-action-icon-hover-rgb) / <alpha-value>)",
    "icon-pressed":
      "rgb(var(--color-admin-action-icon-pressed-rgb) / <alpha-value>)",
    "text-inverse":
      "rgb(var(--color-admin-action-text-inverse-rgb) / <alpha-value>)",
    "icon-inverse":
      "rgb(var(--color-admin-action-icon-inverse-rgb) / <alpha-value>)",
  },
  "consumer-action": {
    background:
      "rgb(var(--color-consumer-action-background-rgb) / <alpha-value>)",
    "background-hover":
      "rgb(var(--color-consumer-action-background-hover-rgb) / <alpha-value>)",
    "background-pressed":
      "rgb(var(--color-consumer-action-background-pressed-rgb) / <alpha-value>)",
    border: "rgb(var(--color-consumer-action-border-rgb) / <alpha-value>)",
    "border-hover":
      "rgb(var(--color-consumer-action-border-hover-rgb) / <alpha-value>)",
    "consumer-border-pressed":
      "rgb(var(--color-consumer-action-border-pressed-rgb) / <alpha-value>)",
    "border-weak":
      "rgb(var(--color-consumer-action-border-weak-rgb) / <alpha-value>)",
    text: "rgb(var(--color-consumer-action-text-rgb) / <alpha-value>)",
    "text-hover":
      "rgb(var(--color-consumer-action-text-hover-rgb) / <alpha-value>)",
    "text-pressed":
      "rgb(var(--color-consumer-action-text-pressed-rgb) / <alpha-value>)",
    "background-weak-hover":
      "rgb(var(--color-consumer-action-background-weak-hover-rgb) / <alpha-value>)",
    "background-weak-pressed":
      "rgb(var(--color-consumer-action-background-weak-pressed-rgb) / <alpha-value>)",
    icon: "rgb(var(--color-consumer-action-icon-rgb) / <alpha-value>)",
    "icon-hover":
      "rgb(var(--color-consumer-action-icon-hover-rgb) / <alpha-value>)",
    "icon-pressed":
      "rgb(var(--color-consumer-action-icon-pressed-rgb) / <alpha-value>)",
  },
  neutral: {
    border: "rgb(var(--color-neutral-border-rgb) / <alpha-value>)",
    "border-disabled":
      "rgb(var(--color-neutral-border-disabled-rgb) / <alpha-value>)",
    "border-medium":
      "rgb(var(--color-neutral-border-medium-rgb) / <alpha-value>)",
    background: "rgb(var(--color-neutral-background-rgb) / <alpha-value>)",
    "background-weak":
      "rgb(var(--color-neutral-background-weak-rgb) / <alpha-value>)",
    "background-medium":
      "rgb(var(--color-neutral-background-medium-rgb) / <alpha-value>)",
    "background-strong":
      "rgb(var(--color-neutral-background-strong-rgb) / <alpha-value>)",
    "background-strongest":
      "rgb(var(--color-neutral-background-strongest-rgb) / <alpha-value>)",
    "background-inverse":
      "rgb(var(--color-neutral-background-inverse-rgb) / <alpha-value>)",
    "background-weak-disabled":
      "rgb(var(--color-neutral-background-weak-disabled-rgb) / <alpha-value>)",
    text: "rgb(var(--color-neutral-text-rgb) / <alpha-value>)",
    "text-medium": "rgb(var(--color-neutral-text-medium-rgb) / <alpha-value>)",
    "text-weak": "rgb(var(--color-neutral-text-weak-rgb) / <alpha-value>)",
    "text-disabled":
      "rgb(var(--color-neutral-text-disabled-rgb) / <alpha-value>)",
    icon: "rgb(var(--color-neutral-icon-rgb) / <alpha-value>)",
    "icon-medium": "rgb(var(--color-neutral-icon-medium-rgb) / <alpha-value>)",
    "icon-weak": "rgb(var(--color-neutral-icon-weak-rgb) / <alpha-value>)",
    "icon-disabled":
      "rgb(var(--color-neutral-icon-disabled-rgb) / <alpha-value>)",
    "background-disabled":
      "rgb(var(--color-neutral-background-disabled-rgb) / <alpha-value>)",
    "text-inverse":
      "rgb(var(--color-neutral-text-inverse-rgb) / <alpha-value>)",
    "icon-inverse":
      "rgb(var(--color-neutral-icon-inverse-rgb) / <alpha-value>)",
  },
  negative: {
    "background-weak":
      "rgb(var(--color-negative-background-weak-rgb) / <alpha-value>)",
    "background-weak-hover":
      "rgb(var(--color-negative-background-weak-hover-rgb) / <alpha-value>)",
    "background-weak-pressed":
      "rgb(var(--color-negative-background-weak-pressed-rgb) / <alpha-value>)",
    background: "rgb(var(--color-negative-background-rgb) / <alpha-value>)",
    "background-hover":
      "rgb(var(--color-negative-background-hover-rgb) / <alpha-value>)",
    "background-pressed":
      "rgb(var(--color-negative-background-pressed-rgb) / <alpha-value>)",
    text: "rgb(var(--color-negative-text-rgb) / <alpha-value>)",
    "text-hover": "rgb(var(--color-negative-text-hover-rgb) / <alpha-value>)",
    "text-pressed":
      "rgb(var(--color-negative-text-pressed-rgb) / <alpha-value>)",
    icon: "rgb(var(--color-negative-icon-rgb) / <alpha-value>)",
    "icon-hover": "rgb(var(--color-negative-icon-hover-rgb) / <alpha-value>)",
    "icon-pressed":
      "rgb(var(--color-negative-icon-pressed-rgb) / <alpha-value>)",
    border: "rgb(var(--color-negative-border-rgb) / <alpha-value>)",
    "border-hover":
      "rgb(var(--color-negative-border-hover-rgb) / <alpha-value>)",
    "border-pressed":
      "rgb(var(--color-negative-border-pressed-rgb) / <alpha-value>)",
  },
  positive: {
    "background-weak":
      "rgb(var(--color-positive-background-weak-rgb) / <alpha-value>)",
    "background-weak-hover":
      "rgb(var(--color-positive-background-weak-hover-rgb) / <alpha-value>)",
    "background-weak-pressed":
      "rgb(var(--color-positive-background-weak-pressed-rgb) / <alpha-value>)",
    background: "rgb(var(--color-positive-background-rgb) / <alpha-value>)",
    "background-hover":
      "rgb(var(--color-positive-background-hover-rgb) / <alpha-value>)",
    "background-pressed":
      "rgb(var(--color-positive-background-pressed-rgb) / <alpha-value>)",
    text: "rgb(var(--color-positive-text-rgb) / <alpha-value>)",
    "text-hover": "rgb(var(--color-positive-text-hover-rgb) / <alpha-value>)",
    "text-pressed":
      "rgb(var(--color-positive-text-pressed-rgb) / <alpha-value>)",
    icon: "rgb(var(--color-positive-icon-rgb) / <alpha-value>)",
    "icon-hover": "rgb(var(--color-positive-icon-hover-rgb) / <alpha-value>)",
    "icon-pressed":
      "rgb(var(--color-positive-icon-pressed-rgb) / <alpha-value>)",
    border: "rgb(var(--color-positive-border-rgb) / <alpha-value>)",
    "border-hover":
      "rgb(var(--color-positive-border-hover-rgb) / <alpha-value>)",
    "border-pressed":
      "rgb(var(--color-positive-border-pressed-rgb) / <alpha-value>)",
  },
  info: {
    background: "rgb(var(--color-info-background-rgb) / <alpha-value>)",
    "background-medium":
      "rgb(var(--color-info-background-medium-rgb) / <alpha-value>)",
    "background-weak":
      "rgb(var(--color-info-background-weak-rgb) / <alpha-value>)",
    border: "rgb(var(--color-info-border-rgb) / <alpha-value>)",
    text: "rgb(var(--color-info-text-rgb) / <alpha-value>)",
    icon: "rgb(var(--color-info-icon-rgb) / <alpha-value>)",
  },
  caution: {
    background: "rgb(var(--color-caution-background-rgb) / <alpha-value>)",
    border: "rgb(var(--color-caution-border-rgb) / <alpha-value>)",
    icon: "rgb(var(--color-caution-icon-rgb) / <alpha-value>)",
    text: "rgb(var(--color-caution-text-rgb) / <alpha-value>)",
  },
  accent: {
    background: "rgb(var(--color-accent-background-rgb) / <alpha-value>)",
    "background-weak":
      "rgb(var(--color-accent-background-weak-rgb) / <alpha-value>)",
    "border-weak": "rgb(var(--color-accent-border-weak-rgb) / <alpha-value>)",
    "background-medium":
      "rgb(var(--color-accent-background-medium-rgb) / <alpha-value>)",
    "text-medium": "rgb(var(--color-accent-text-medium-rgb) / <alpha-value>)",
  },
  live: {
    background: "rgb(var(--color-live-background-rgb) / <alpha-value>)",
    text: "rgb(var(--color-live-text-rgb) / <alpha-value>)",
  },
  brand: {
    background: "rgb(var(--color-brand-background-rgb) / <alpha-value>)",
    "background-strong":
      "rgb(var(--color-brand-background-strong-rgb) / <alpha-value>)",
  },
  component: {
    "secondary-button-background":
      "rgb(var(--color-secondary-button-background-rgb) / <alpha-value>)",
  },
} as const;
export default themeColors;
