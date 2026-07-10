"use client";

import dynamic from "next/dynamic";

const DistrictQualityMap = dynamic(() => import("@/components/DistrictQualityMap"), {
  ssr: false,
  loading: () => (
    <main className="shell">
      <section className="mapArea" aria-label="District quality map" aria-busy="true">
        <div className="map mapLoading">Loading map…</div>
      </section>
      <aside className="panel" aria-label="Place score details" aria-busy="true">
        <div className="panelHeader">
          <p className="eyebrow">District Quality Map</p>
          <h1>Loading…</h1>
        </div>
      </aside>
    </main>
  )
});

export default function MapPageClient() {
  return <DistrictQualityMap />;
}