"use client";

import {useAtomValue} from "jotai";
import {AlertTriangleIcon} from "lucide-react";
import {errorMessageAtom} from "@/modules/widget/atoms/widget-atoms";
import { WidgetGreetingHeader } from "../components/widget-greeting-header";

export const WidgetErrorScreen = () => {
    const errorMessage = useAtomValue(errorMessageAtom);

    return (
        <>
            <WidgetGreetingHeader />
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
                <AlertTriangleIcon />
                <p className="text-sm">
                    {errorMessage || "Invalid configuration"}
                </p>
            </div>
        </>
    )
}