import { OrganizationList } from "@clerk/nextjs";

export const OrgSelectionView = () => {
  return (
    <OrganizationList
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
      hidePersonal
      skipInvitationScreen
      appearance={{
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
          card: "border border-[#E2E8F0] bg-white shadow-xl",
        },
      }}
    />
  );
};
