"use client";

export default function CourseLoading() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden bg-slate-200">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>

            <div className="space-y-5 p-6">
              {/* Category */}
              <div className="relative h-4 w-24 overflow-hidden rounded-full bg-slate-200">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <div className="relative h-6 overflow-hidden rounded bg-slate-200">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>

                <div className="relative h-6 w-3/4 overflow-hidden rounded bg-slate-200">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="relative h-4 overflow-hidden rounded bg-slate-200">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>

                <div className="relative h-4 w-4/5 overflow-hidden rounded bg-slate-200">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>

              {/* Teacher */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="relative h-4 overflow-hidden rounded bg-slate-200">
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </div>

                  <div className="relative h-3 w-24 overflow-hidden rounded bg-slate-200">
                    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="relative mt-4 h-10 w-32 overflow-hidden rounded-xl bg-slate-200">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
