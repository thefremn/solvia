import { SignIn } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none",
    card: "w-full border border-border bg-card shadow-xl gap-4 p-6",
    header: "gap-1",
    headerTitle: "text-lg font-bold text-foreground",
    headerSubtitle: "text-sm text-muted-foreground",
    socialButtonsBlockButton:
      "h-10 border-border text-sm font-semibold text-foreground",
    dividerLine: "bg-muted",
    dividerText: "text-xs text-muted-foreground",
    form: "gap-3",
    formField: "gap-1",
    formButtonPrimary:
      "h-10 bg-primary text-sm font-semibold text-white hover:bg-primary/90",
    formFieldInput:
      "h-10 border-border text-sm text-foreground placeholder:text-muted-foreground focus:border-ring",
    formFieldLabel: "text-sm font-semibold text-foreground",
    footer: "gap-2",
    footerActionText: "text-sm text-muted-foreground",
    footerActionLink: "font-semibold text-foreground hover:text-primary",
  },
} as const;

export const SignInView = () => {
  return <SignIn routing="hash" appearance={clerkAppearance} />;
};
