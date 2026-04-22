import type {
  AssessmentNoteEntry,
  AssessmentMetadata,
  ExecutiveDecision,
  ExecutiveDimension,
  ExecutiveRecommendation,
} from "../types";

import { getPriorityLabel, getTypeLabel } from "../utils/labels";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getRecommendationContext(rec: ExecutiveRecommendation) {
  if (rec.questionName) {
    return rec.questionName;
  }
  if (rec.questionId) {
    return `Pytanie ${rec.questionId}`;
  }
  return "Rekomendacja";
}

function buildRecommendationHtml(rec: ExecutiveRecommendation) {
  const badges = [
    `<span class="badge">${escapeHtml(getTypeLabel(rec.type))}</span>`,
    `<span class="badge">${escapeHtml(getPriorityLabel(rec.priority))}</span>`,
  ].join("");

  const context = getRecommendationContext(rec);

  return `
    <div class="card">
      <div>${badges}</div>
      <div class="rec-context"><strong>${escapeHtml(context)}</strong></div>
      <div class="rec-text">${escapeHtml(rec.text)}</div>
    </div>
  `;
}

export function buildExecutiveHtml({
  metadata,
  message,
  dimensions,
  decisions,
  recommendations,
  plan90,
  notesSummary
}: {
  metadata: AssessmentMetadata;
  message: string;
  dimensions: ExecutiveDimension[];
  decisions: ExecutiveDecision[];
  recommendations: ExecutiveRecommendation[];
  plan90: { first30: string[]; day60: string[]; day90: string[] };
  notesSummary: AssessmentNoteEntry[];
}) {
  const list = (items: string[]) =>
    items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Widok kierowniczy – dostępność cyfrowa</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 32px;
      background: #fff;
      color: #1f2937;
      line-height: 1.5;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 8px;
    }
    h2 {
      font-size: 18px;
      margin: 24px 0 12px;
    }
    .card {
      border: 1px solid #d4d4d8;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    .badge {
      display: inline-block;
      border: 1px solid #d4d4d8;
      border-radius: 999px;
      padding: 3px 10px;
      font-size: 12px;
      margin-right: 6px;
      margin-bottom: 6px;
    }
    .muted {
      color: #52525b;
      font-size: 14px;
    }
    .score {
      font-size: 28px;
      font-weight: 700;
      margin-top: 8px;
    }
    .rec-context {
      margin-top: 8px;
    }
    .rec-text {
      margin-top: 6px;
      color: #52525b;
      font-size: 14px;
    }
    ul {
      margin: 8px 0 0 18px;
      padding: 0;
    }
  </style>
</head>
<body>
  <h1>Widok kierowniczy – dostępność cyfrowa</h1>
  <div class="muted">Raport wygenerowany z formularza samooceny</div>

  <div class="card">
    <strong>Nazwa organizacji:</strong> ${escapeHtml(metadata.organization || "—")}<br>
    <strong>Data sporządzenia:</strong> ${escapeHtml(metadata.assessmentDate || "—")}<br>
    <strong>Sporządził:</strong> ${escapeHtml(metadata.assessor || "—")}
  </div>

<div class="card">
  <div class="muted">
    Ocena przedstawia aktualny etap rozwoju organizacji w obszarze dostępności cyfrowej oraz wskazuje kierunki działań, które mogą wzmacniać spójność i skuteczność podejmowanych rozwiązań.
  </div>
</div>

<h2>Wniosek strategiczny</h2>
<div class="card">${escapeHtml(message)}</div>

  <h2>Obszary wymagające największej uwagi</h2>
  <div class="muted">
  Obszary, w których dalsze działania mogą przynieść największy efekt.
</div>
  <div class="grid">
    ${dimensions
      .map(
        (d) => `
      <div class="card">
        <div class="muted">${escapeHtml(d.name)}</div>
        <div class="score">${d.label !== "brak danych" ? d.score.toFixed(1) : "–"}</div>
        <div class="badge">${escapeHtml(d.label)}</div>
      </div>
    `
      )
      .join("")}
  </div>

  <h2>5 kluczowych decyzji do podjęcia</h2>
  ${decisions
    .map(
      (d) => `
    <div class="card">
      <div class="muted">${escapeHtml(d.id)}</div>
      <div><strong>${escapeHtml(d.name)}</strong></div>
      <div class="score">${d.label !== "brak danych" ? d.score.toFixed(1) : "–"}</div>
      <div class="badge">${escapeHtml(d.label)}</div>
    </div>
  `
    )
    .join("")}

  <h2>Priorytetowe kierunki działań</h2>
  ${recommendations.map((r) => buildRecommendationHtml(r)).join("")}

  <h2>Plan 90 dni</h2>
  <div class="grid">
    <div class="card">
      <strong>Pierwsze 30 dni</strong>
      <ul>${list(plan90.first30)}</ul>
    </div>
    <div class="card">
      <strong>Dzień 31–60</strong>
      <ul>${list(plan90.day60)}</ul>
    </div>
    <div class="card">
      <strong>Dzień 61–90</strong>
      <ul>${list(plan90.day90)}</ul>
    </div>
  </div>
  
   <h2>Uwagi osoby prowadzącej ocenę</h2>
   <div class="muted">Komentarze dodane podczas wypełniania formularza.</div>
   ${
     notesSummary.length === 0
       ? `<div class="card">Nie dodano uwag do pytań.</div>`
       : notesSummary
           .map(
             (item) => `
     <div class="card">
       <div class="muted">${escapeHtml(item.questionId)}</div>
       <div><strong>${escapeHtml(item.questionName)}</strong></div>
       <div class="rec-text">${escapeHtml(item.note)}</div>
     </div>
   `
           )
           .join("")
   }
 </body>
 </html>`;
 }

export function buildActionPlanHtml(
  plan: { first30: string[]; day60: string[]; day90: string[] },
  metadata: AssessmentMetadata
) {
  const list = (items: string[]) =>
    items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Plan działań – dostępność cyfrowa</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 32px;
      background: #fff;
      color: #1f2937;
      line-height: 1.5;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 8px;
    }
    h2 {
      font-size: 18px;
      margin: 24px 0 12px;
    }
    .card {
      border: 1px solid #d4d4d8;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    ul {
      margin: 8px 0 0 18px;
      padding: 0;
    }
  </style>
</head>
<body>
  <h1>Plan działań – dostępność cyfrowa</h1>

  <div class="card">
    <strong>Nazwa organizacji:</strong> ${escapeHtml(metadata.organization || "—")}<br>
    <strong>Data sporządzenia:</strong> ${escapeHtml(metadata.assessmentDate || "—")}<br>
    <strong>Sporządził:</strong> ${escapeHtml(metadata.assessor || "—")}
  </div>

  <div class="grid">
    <div class="card">
      <h2>Pierwsze 30 dni</h2>
      <ul>${list(plan.first30)}</ul>
    </div>
    <div class="card">
      <h2>Dzień 31–60</h2>
      <ul>${list(plan.day60)}</ul>
    </div>
    <div class="card">
      <h2>Dzień 61–90</h2>
      <ul>${list(plan.day90)}</ul>
    </div>
  </div>
</body>
</html>`;
}

export function exportExecutivePDF(data: Parameters<typeof buildExecutiveHtml>[0]) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(buildExecutiveHtml(data));
  win.document.close();
  win.focus();
  win.print();
}

export function exportExecutiveHTML(data: Parameters<typeof buildExecutiveHtml>[0]) {
  downloadTextFile(
    "widok-kierowniczy-dostepnosc.html",
    buildExecutiveHtml(data),
    "text/html;charset=utf-8"
  );
}

export function exportActionPlanHTML(
  plan: { first30: string[]; day60: string[]; day90: string[] },
  metadata: AssessmentMetadata
) {
  downloadTextFile(
    "plan-dzialan-dostepnosc.html",
    buildActionPlanHtml(plan, metadata),
    "text/html;charset=utf-8"
  );
}

export function exportActionPlanJSON(
  plan: { first30: string[]; day60: string[]; day90: string[] },
  metadata: AssessmentMetadata,
   schemaVersion: string
) {
  const payload = {
    schema_version: schemaVersion,
    exported_at: new Date().toISOString(),
    type: "action_plan",
    metadata: {
      organization: metadata.organization || "",
      assessmentDate: metadata.assessmentDate || "",
      assessor: metadata.assessor || "",
    },
    plan90: plan,
  };

  downloadTextFile(
    "plan-dzialan-dostepnosc.json",
    JSON.stringify(payload, null, 2),
    "application/json;charset=utf-8"
  );
}

export function exportAssessmentJSON(payload: unknown) {
  downloadTextFile(
    "ocena-dostepnosci-dane.json",
    JSON.stringify(payload, null, 2),
    "application/json;charset=utf-8"
  );
}