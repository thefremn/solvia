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
          borderRadius: "0.5rem",
        },
        elements: {
          card: "border border-border bg-card shadow-xl",
        },
      }}
    />
  );
};
