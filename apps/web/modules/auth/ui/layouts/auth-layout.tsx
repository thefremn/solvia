import Image from "next/image";
import { AuthBrandPanel } from "@/modules/auth/ui/components/auth-brand-panel";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#F8FAFC]">
      <div className="hidden h-full shrink-0 overflow-hidden lg:block lg:w-1/2">
        <AuthBrandPanel />
      </div>
      <div className="relative flex h-full w-full min-h-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 [background-image:radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div className="relative flex h-full min-h-0 flex-col overflow-y-auto">
          <div className="m-auto flex w-full max-w-md flex-col items-center gap-4 p-4 sm:p-6">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="flex size-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white p-1">
                <Image
                  src="/logo.svg"
                  alt="Solvia logo"
                  width={20}
                  height={20}
                />
              </span>
              <span className="text-base font-semibold text-[#0F172A]">
                Solvia
              </span>
            </div>
            <div className="flex w-full flex-col items-center justify-center [&>div]:w-full [&>div]:max-w-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
