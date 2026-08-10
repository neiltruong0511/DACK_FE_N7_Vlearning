"use client";

import { useState } from "react";
import AuthGuard from "@/components/common/AuthGuard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileInfo from "@/components/profile/ProfileInfo";
import FavoriteCourses from "@/components/profile/FavoriteCourses";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "favorite">("profile");

  return (
    <AuthGuard>
      <section className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ProfileHeader />

          <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
            <ProfileSidebar activeTab={activeTab} onChange={setActiveTab} />

            <div>
              {activeTab === "profile" ? <ProfileInfo /> : <FavoriteCourses />}
            </div>
          </div>
        </div>
      </section>
    </AuthGuard>
  );
}
