import {
  INTEGRATION_DETAILS,
  type IntegrationDetails,
  type IntegrationId,
} from "./constants";

export const getIntegrationDetails = (
  integrationId: IntegrationId,
  organizationId: string
): IntegrationDetails | null => {
  const details = INTEGRATION_DETAILS[integrationId];
  if (!details) return null;

  return {
    ...details,
    steps: details.steps.map((step) => ({
      ...step,
      code: step.code ? step.code.replace(/{{ORGANIZATION_ID}}/g, organizationId) : undefined,
    })),
  };
};

export const createScript = (
  integrationId: IntegrationId,
  organizationId: string
): string => {
  const details = getIntegrationDetails(integrationId, organizationId);
  if (!details) return "";
  const codeStep = details.steps.find((s) => s.code);
  return codeStep?.code ?? "";
};

