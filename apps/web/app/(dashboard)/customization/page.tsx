import { SubscriptionProtect } from "@/modules/billing/ui/components/subscription-protect";
import { CustomizationView } from "@/modules/customization/ui/views/customization_view";

const Page = () => {
    return (
        <SubscriptionProtect>
            <CustomizationView />
        </SubscriptionProtect>
    );
};

export default Page;