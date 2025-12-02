import { ConversationsPanel } from '@/modules/dashboard/ui/components/conversations-panel';
import { 
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup, 
} from '@workspace/ui/components/resizable';

export const ConversationsLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={20} maxSize={30}>
                <div className="h-full bg-gray-100 dark:bg-gray-800">
                        <ConversationsPanel />
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} className="h-full">
                    {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
