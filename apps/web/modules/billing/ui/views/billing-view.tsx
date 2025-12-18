"use client";

import { PricingTable } from "../components/pricing-table";

export const BillingView = () => {
    return (
        <div className="flex min-h-screen flex-col bg-muted p-8">
            <div className="mx-auto w-full max-w-2xl">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl">Plans & Billing</h1>
                    <p>
                        Choose the plan that&apos;s right for you
                    </p>
                </div>
                <div className="mt-8">
                    <PricingTable />
                </div>
            </div>
        </div>
    )
}