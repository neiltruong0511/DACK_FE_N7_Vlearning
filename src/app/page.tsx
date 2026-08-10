"use client";

import Header from "@/components/layout/Header";
import Banner from "@/components/course/Banner";
import Footer from "@/components/layout/Footer";
import CourseList from "@/components/course/CourseList";
import CourseStats from "@/components/course/CourseStats";
import TopInstructors from "@/components/course/TopInstructors";
import FeaturedCourses from "@/components/layout/FeaturedCourses";
import WhyChooseUs from "@/components/layout/WhyChooseUs";

// import Banner from "@/components/course/Banner";
// import CourseList from "@/components/course/CourseList";

export default function HomePage() {
  return (
    <>
      <Header />

      <Banner />

      <FeaturedCourses />

      <div className="max-w-7xl mx-auto px-3 py-6 bg-gray-50">
        <CourseList />
      </div>

      <WhyChooseUs />

      <CourseStats />

      <TopInstructors />

      <Footer />
    </>
  );
}
