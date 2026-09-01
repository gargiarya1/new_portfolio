export type ThemePreset = {
  id: string;
  label: string;
  colors: {
    lavender: string;
    lavenderDeep: string;
    blush: string;
    blushDeep: string;
    rosegold: string;
    rosegoldDeep: string;
    purple: string;
    cyan: string;
  };
};

export const themePresets: ThemePreset[] = [
  {
    id: "aurora",
    label: "Aurora",
    colors: {
      lavender: "#9b8cf9",
      lavenderDeep: "#7c6cf0",
      blush: "#f0a8c8",
      blushDeep: "#e37fae",
      rosegold: "#f0c27a",
      rosegoldDeep: "#dba24f",
      purple: "#7c6cf0",
      cyan: "#67e8d0",
    },
  },
  {
    id: "nebula",
    label: "Nebula",
    colors: {
      lavender: "#c084fc",
      lavenderDeep: "#a855f7",
      blush: "#f472b6",
      blushDeep: "#ec4899",
      rosegold: "#f0abfc",
      rosegoldDeep: "#d946ef",
      purple: "#a855f7",
      cyan: "#22d3ee",
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    colors: {
      lavender: "#34d399",
      lavenderDeep: "#10b981",
      blush: "#5eead4",
      blushDeep: "#2dd4bf",
      rosegold: "#f0c27a",
      rosegoldDeep: "#dba24f",
      purple: "#10b981",
      cyan: "#5eead4",
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    colors: {
      lavender: "#fb923c",
      lavenderDeep: "#f97316",
      blush: "#f472b6",
      blushDeep: "#ec4899",
      rosegold: "#fbbf24",
      rosegoldDeep: "#f59e0b",
      purple: "#f97316",
      cyan: "#fbbf24",
    },
  },
  {
    id: "ocean",
    label: "Ocean",
    colors: {
      lavender: "#60a5fa",
      lavenderDeep: "#3b82f6",
      blush: "#22d3ee",
      blushDeep: "#06b6d4",
      rosegold: "#2dd4bf",
      rosegoldDeep: "#14b8a6",
      purple: "#3b82f6",
      cyan: "#67e8f9",
    },
  },
  {
    id: "monogold",
    label: "Mono Gold",
    colors: {
      lavender: "#c7c2d6",
      lavenderDeep: "#9c96b0",
      blush: "#e8d9b5",
      blushDeep: "#d4bc84",
      rosegold: "#f0c27a",
      rosegoldDeep: "#dba24f",
      purple: "#9c96b0",
      cyan: "#c7c2d6",
    },
  },
];

export const defaultThemePreset = themePresets[0];
