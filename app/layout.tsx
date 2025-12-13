import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: "Titan Workflow Systems",
  description: "Internal workflow engine for structured workflows and task automation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="flex min-h-screen">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Right Panel */}
          <div className="flex flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
