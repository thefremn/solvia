"use client";

import { PricingTable } from "../components/pricing-table";

export const BillingView = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl leading-tight font-bold text-[#0F172A]">
            Plans & Billing
          </h1>
          <p className="text-sm text-[#475569]">
            Choose the plan that&apos;s right for you
          </p>
        </div>
        <div>
          <PricingTable />
        </div>
      </div>
    </div>
  );
};
