import { SubscriptionProtect } from "@/modules/billing/ui/components/subscription-protect";
import { VapiView } from "@/modules/plugins/ui/views/vapi-view";

const Page = () => {
    return (
        <SubscriptionProtect>
            <VapiView />
        </SubscriptionProtect>
    );
}

export default Page;