export interface IntegrationStep {
  title: string;
  description?: string;
  code?: string;
}

export interface IntegrationDetails {
  title: string;
  description: string;
  steps: IntegrationStep[];
}

export const INTEGRATIONS = [
  {
    id: "html",
    title: "HTML",
    icon: "/languages/html5.svg",
  },
  {
    id: "react",
    title: "React",
    icon: "/languages/react.svg",
  },
  {
    id: "nextjs",
    title: "Next.js",
    icon: "/languages/nextjs.svg",
  },
  {
    id: "javascript",
    title: "JavaScript",
    icon: "/languages/javascript.svg",
  },
] as const;

export type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

export const INTEGRATION_DETAILS: Record<IntegrationId, IntegrationDetails> = {
  html: {
    title: "HTML",
    description: "Add the chatbox widget to your static HTML website.",
    steps: [
      {
        title: "1. Copy the script tag",
        description: "Copy the snippet below containing your Organization ID:",
        code: `<script src="https://solvia-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`,
      },
      {
        title: "2. Add the script to your website",
        description: "Paste the script inside the <head> or <body> tag of your HTML pages.",
      },
    ],
  },
  react: {
    title: "React",
    description: "Integrate the chatbox widget into your React application.",
    steps: [
      {
        title: "1. Option A: Add to public/index.html",
        description: "Paste the script tag directly into your public/index.html file:",
        code: `<script src="https://solvia-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`,
      },
      {
        title: "2. Option B: Dynamic loading via useEffect Hook",
        description: "Alternatively, inject the script inside your main App component or layout hook:",
        code: `import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://solvia-widget.vercel.app/widget.js";
    script.setAttribute("data-organization-id", "{{ORGANIZATION_ID}}");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div>Your Application</div>;
}`,
      },
    ],
  },
  nextjs: {
    title: "Next.js",
    description: "Follow this 3-step setup to integrate Solvia into your Next.js project.",
    steps: [
      {
        title: "1. Install next/script",
        description: "Install next/script in your Next.js application using your preferred package manager:",
        code: "pnpm add next/script\n# or\nnpm install next/script",
      },
      {
        title: "2. Add Organization ID to environment variables",
        description: "Add your Solvia Organization ID to your .env or .env.local file:",
        code: "NEXT_PUBLIC_SOLVIA_ORG_ID={{ORGANIZATION_ID}}",
      },
      {
        title: "3. Import and use <Script> in app/layout.tsx",
        description: "Include the widget Script component in your root layout:",
        code: `import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://solvia-widget.vercel.app/widget.js"
          data-organization-id={process.env.NEXT_PUBLIC_SOLVIA_ORG_ID}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}`,
      },
    ],
  },
  javascript: {
    title: "JavaScript",
    description: "Dynamically load the Solvia chatbox widget using JavaScript.",
    steps: [
      {
        title: "1. Copy the dynamic initialization code",
        description: "Paste this script in your main JavaScript entry file:",
        code: `(function() {
  const script = document.createElement('script');
  script.src = 'https://solvia-widget.vercel.app/widget.js';
  script.setAttribute('data-organization-id', '{{ORGANIZATION_ID}}');
  script.async = true;
  document.head.appendChild(script);
})();`,
      },
      {
        title: "2. Verify script loading",
        description: "The script will automatically instantiate the Solvia chat widget once loaded.",
      },
    ],
  },
};

export const HTML_SCRIPT = INTEGRATION_DETAILS.html.steps[0]?.code ?? "";
export const REACT_SCRIPT = INTEGRATION_DETAILS.react.steps[0]?.code ?? "";
export const NEXTJS_SCRIPT = INTEGRATION_DETAILS.nextjs.steps[2]?.code ?? "";
export const JAVASCRIPT_SCRIPT = INTEGRATION_DETAILS.javascript.steps[0]?.code ?? "";