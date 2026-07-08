"use client";

import dynamic from "next/dynamic";

const ParisStudentMap = dynamic(() => import("@/components/ParisStudentMap"), {
  ssr: false,
  loading: () => (
    <main className="shell">
      <section className="mapArea" aria-label="Student city quality map" aria-busy="true">
        <div className="map mapLoading">Loading map…</div>
      </section>
      <aside className="panel" aria-label="Place score details" aria-busy="true">
        <div className="panelHeader">
          <p className="eyebrow">Student city quality map</p>
          <h1>Loading…</h1>
        </div>
      </aside>
    </main>
  )
});

export default function MapPageClient() {
  return <ParisStudentMap />;
}