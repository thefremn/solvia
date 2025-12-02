import { ConversationsLayout } from "@/modules/auth/ui/layouts/conversations-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ConversationsLayout>{children}</ConversationsLayout>;
}
export default Layout;
