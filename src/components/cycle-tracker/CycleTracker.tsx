"use client";

import { useState } from "react";
// import { CalendarView } from "./CalendarView";
// import { DailyEntryForm } from "./DailyEntryForm";
// import { CycleDashboard } from "./CycleDashboard";

export function CycleTracker() {
  // Phase de ménopause (à récupérer du profil utilisateur)
  const [phase, setPhase] = useState<'pre-menopause' | 'peri-menopause' | 'post-menopause'>('pre-menopause');
  // Date sélectionnée dans le calendrier
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Données du jour (à synchroniser avec Firestore plus tard)
  const [dailyData, setDailyData] = useState<any>({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-purple-800 mb-4">Cycle & Symptom Tracker</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier interactif */}
        <div className="lg:col-span-2">
          {/* <CalendarView phase={phase} selectedDate={selectedDate} onSelectDate={setSelectedDate} dailyData={dailyData} /> */}
          <div className="rounded-lg bg-white shadow p-4 text-center text-gray-500">[Calendrier interactif ici]</div>
        </div>
        {/* Dashboard/statistiques */}
        <div>
          {/* <CycleDashboard phase={phase} dailyData={dailyData} /> */}
          <div className="rounded-lg bg-white shadow p-4 text-center text-gray-500">[Dashboard/statistiques ici]</div>
        </div>
      </div>
      {/* Formulaire de saisie quotidienne */}
      <div className="max-w-2xl mx-auto w-full">
        {/* <DailyEntryForm phase={phase} date={selectedDate} data={dailyData[selectedDate]} onSave={...} /> */}
        <div className="rounded-lg bg-white shadow p-4 text-center text-gray-500">[Formulaire de saisie quotidienne ici]</div>
      </div>
    </div>
  );
} 