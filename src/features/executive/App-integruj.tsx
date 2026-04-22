import { useMemo } from "react";
import { ExecutiveSummaryCard } from "@/features/executive/ExecutiveSummaryCard";
import { ExecutiveReportPage } from "@/features/executive/ExecutiveReportPage";
import { TopExecutiveDecisions } from "@/features/executive/TopExecutiveDecisions";
import { adaptQuestions } from "@/features/executive/executive.adapters";
import { buildExecutiveModuleData } from "@/features/executive/executive.utils";

// ...
const executiveQuestions = useMemo(() => adaptQuestions(questions), [questions]);

const executiveData = useMemo(() => {
  return buildExecutiveModuleData(executiveQuestions, responses);
}, [executiveQuestions, responses]);

// ...
{stage === "results" && (
  <div className="space-y-6">
    {/* Wasze obecne komponenty wyników */}
    {/* np. wykres, rekomendacje, podsumowanie */}

    <ExecutiveSummaryCard
      summary={executiveData.executiveSummary}
      overallScore={executiveData.overallScore}
    />

    <TopExecutiveDecisions
      decisions={executiveData.topExecutiveDecisions}
    />

    <section id="executive-report">
      <ExecutiveReportPage
        metadata={{
          organizationName: metadata.organizationName,
          unitName: metadata.unitName,
          assessmentDate: metadata.assessmentDate,
        }}
        overallScore={executiveData.overallScore}
        summary={executiveData.executiveSummary}
        areaScores={executiveData.areaScores}
        topDecisions={executiveData.topExecutiveDecisions}
      />
    </section>
  </div>
)}