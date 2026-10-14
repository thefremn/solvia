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
          colorInputBackground: "#FFFFFF",
          colorInputText: "#0F172A",
          colorText: "#0F172A",
          colorTextSecondary: "#475569",
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
