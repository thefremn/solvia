import { SignUp } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    colorPrimary: "#0F2D52",
    colorBackground: "#FFFFFF",
    colorInput: "#FFFFFF",
    colorInputForeground: "#0F172A",
    colorForeground: "#0F172A",
    colorMutedForeground: "#475569",
    colorBorder: "#E2E8F0",
    colorRing: "#0F2D52",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "w-full border border-[#E2E8F0] bg-white shadow-xl gap-4 p-6",
    header: "gap-1",
    headerTitle: "text-lg font-bold text-[#0F172A]",
    headerSubtitle: "text-sm text-[#475569]",
    socialButtonsBlockButton:
      "h-10 border-[#E2E8F0] text-sm font-semibold text-[#0F172A]",
    dividerLine: "bg-[#E2E8F0]",
    dividerText: "text-xs text-[#475569]",
    form: "gap-3",
    formField: "gap-1",
    formButtonPrimary:
      "h-10 bg-[#0F2D52] text-sm font-semibold text-white hover:bg-[#0A2240]",
    formFieldInput:
      "h-10 border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#475569] focus:border-[#0F2D52]",
    formFieldLabel: "text-sm font-semibold text-[#0F172A]",
    footer: "gap-2",
    footerActionText: "text-sm text-[#475569]",
    footerActionLink: "font-semibold text-[#0F2D52] hover:text-[#0A2240]",
  },
} as const;

export const SignUpView = () => {
  return <SignUp routing="hash" appearance={clerkAppearance} />;
};
