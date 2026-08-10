"use client";

import AuthGuard from "@/components/common/AuthGuard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileInfo from "@/components/profile/ProfileInfo";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <section className="bg-slate-50 py-16 min-h-screen">
        <div className="mx-auto max-w-7xl px-6">
          <ProfileHeader />

          <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
            <ProfileSidebar />

            <ProfileInfo />
          </div>
        </div>
      </section>
    </AuthGuard>
  );
}
