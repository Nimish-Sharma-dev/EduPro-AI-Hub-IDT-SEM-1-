import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navigation } from "@/components/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Temporarily disabled for local testing without Supabase
    // const supabase = await createClient();
    // const { data: { user } } = await supabase.auth.getUser();

    // if (!user) {
    //     redirect("/login");
    // }

    return (
        <div className="flex h-screen bg-background">
            <aside className="w-64 flex-shrink-0">
                <Navigation />
            </aside>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
