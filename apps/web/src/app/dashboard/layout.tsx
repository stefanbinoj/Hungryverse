import { Sidebar } from "./components/sidebar";
import Header from "@/components/header";
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid grid-rows-[auto_1fr] h-svh max-h-svh ">
            <Header />
            <div className="flex bg-background">
                <Sidebar />
                <div className="flex flex-col max-h-[calc(100svh-55px)] flex-1 overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
