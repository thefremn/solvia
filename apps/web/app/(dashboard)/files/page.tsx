import { SubscriptionProtect } from "@/modules/billing/ui/components/subscription-protect";
import { FilesView } from "@/modules/files/ui/views/files-view";

const Page = () => {
    return (
        <SubscriptionProtect>
            <FilesView />
        </SubscriptionProtect>
    );
};

export default Page; 