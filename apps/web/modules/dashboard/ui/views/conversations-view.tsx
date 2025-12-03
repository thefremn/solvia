"use client";

import Image from "next/image";

export const ConversationsView = () => {
  return (
    <div className="flex flex-1 h-full flex-col gap-y-4 bg-muted">
        <div className="flex flex-1 items-center justify-center gap-x-2">
            <Image
            src="/logo.svg"
            alt="logo"
            width={40}
            height={40}
            />
            <p className="text-lg font-semibold">Solvia</p>
        </div>
  </div> 
  );
}   