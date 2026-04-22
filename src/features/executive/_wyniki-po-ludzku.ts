function buildExecutiveSummary(params: {
  overallLevel: MaturityLevel;
  strongestArea?: string;
  weakestArea?: string;
  spread: number;
}) {
  const base = executiveNarratives[params.overallLevel];

  let variabilityText = "";
  if (params.spread >= 1.2) {
    variabilityText =
      " Wyniki między obszarami są wyraźnie nierówne, co sugeruje, że organizacja rozwija się niespójnie.";
  } else {
    variabilityText =
      " Wyniki między obszarami są dość spójne, co sugeruje jednolity etap rozwoju całej organizacji.";
  }

  let areaText = "";
  if (params.strongestArea && params.weakestArea) {
    areaText = ` Najsilniejszym obszarem jest ${params.strongestArea}, a największej uwagi wymaga ${params.weakestArea}.`;
  }

  return `${base.summary}${variabilityText}${areaText}`;
}