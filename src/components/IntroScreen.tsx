import type { AssessmentMetadata, AssessmentModel } from "../types";
import { Card, ProgressBar, Badge } from "./ui";

export function IntroScreen({
  metadata,
  setMetadata,
  onStart,
  model,
}: {
  metadata: AssessmentMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<AssessmentMetadata>>;
  onStart: () => void;
  model: AssessmentModel;
}) {
  const titleId = "intro-title";
  const descId = "intro-desc";

  const totalQuestions = model.questions.length;
  const totalDimensions = model.dimensions.length;
  const totalDecisions = model.decisions.length;
  const schemaVersion = model.schema_version ?? "1.0";

  return (
    <main
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="mx-auto max-w-4xl"
    >
      <Card className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Radar dostępności</Badge>
          <Badge>Wersja modelu: {schemaVersion}</Badge>
        </div>

        <h1 id={titleId} className="mt-3 text-2xl font-semibold text-[var(--text-main)]">
          Radar dostępności — samoocena dojrzałości
        </h1>

        <p id={descId} className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
          Narzędzie wspiera ocenę organizacji w zakresie dostępności cyfrowej i
          pomaga przełożyć wyniki na decyzje kierownicze, rekomendacje oraz plan
          działań.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="text-sm text-[var(--text-muted)]">Liczba pytań</div>
            <div className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              {totalQuestions}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="text-sm text-[var(--text-muted)]">Liczba wymiarów</div>
            <div className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              {totalDimensions}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="text-sm text-[var(--text-muted)]">Liczba decyzji</div>
            <div className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              {totalDecisions}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="mb-2 text-sm font-medium text-[var(--text-main)]">
            Zakres arkusza
          </div>
          <ProgressBar total={totalQuestions} done={0} />
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Samoocena obejmuje {totalQuestions} pytań przypisanych do{" "}
            {totalDimensions} wymiarów i {totalDecisions} decyzji.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section aria-labelledby="instruction-heading">
            <h2
              id="instruction-heading"
              className="text-lg font-semibold text-[var(--text-main)]"
            >
              Jak korzystać z narzędzia
            </h2>

            <ul className="mt-3 space-y-3 text-sm leading-7 text-[var(--text-muted)]">
              <li>
                • Odpowiadaj, oceniając rzeczywiste działanie organizacji, a nie
                deklaracje lub plany.
              </li>
              <li>• Jeśli nie masz pewności, wybierz niższą ocenę.</li>
              <li>
                • W przypadku oceny zespołowej uzgadniaj odpowiedzi na podstawie
                dowodów.
              </li>
              <li>• Wyniki pokażą obszary wymagające decyzji i działań.</li>
            </ul>

            <div className="mt-4 rounded-2xl bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--text-muted)]">
              Formularz został zaprojektowany z myślą o dostępności cyfrowej:
              ma poprawną strukturę nagłówków, etykiety pól, logiczną kolejność
              tabulacji, duże obszary klikalne i czytelne komunikaty tekstowe.
            </div>
          </section>

          <section aria-labelledby="meta-heading">
            <h2
              id="meta-heading"
              className="text-lg font-semibold text-[var(--text-main)]"
            >
              Metadane oceny
            </h2>

            <div className="mt-3 space-y-4">
              <div>
                <label
                  htmlFor="organization"
                  className="mb-1 block text-sm font-medium text-[var(--text-main)]"
                >
                  Nazwa organizacji
                </label>
                <input
                  id="organization"
                  type="text"
                  value={metadata.organization}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      organization: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-main)]"
                  autoComplete="organization"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="assessmentDate"
                    className="mb-1 block text-sm font-medium text-[var(--text-main)]"
                  >
                    Data wykonania samooceny
                  </label>
                  <input
                    id="assessmentDate"
                    type="date"
                    value={metadata.assessmentDate}
                    onChange={(e) =>
                      setMetadata((prev) => ({
                        ...prev,
                        assessmentDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="previousAssessmentDate"
                    className="mb-1 block text-sm font-medium text-[var(--text-main)]"
                  >
                    Data poprzedniej oceny
                  </label>
                  <input
                    id="previousAssessmentDate"
                    type="date"
                    value={metadata.previousAssessmentDate}
                    onChange={(e) =>
                      setMetadata((prev) => ({
                        ...prev,
                        previousAssessmentDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="assessor"
                  className="mb-1 block text-sm font-medium text-[var(--text-main)]"
                >
                  Oceniający
                </label>
                <input
                  id="assessor"
                  type="text"
                  value={metadata.assessor}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      assessor: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-main)]"
                />
              </div>

              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-[var(--text-main)]">
                  Tryb oceny
                </legend>

                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <input
                      type="radio"
                      name="mode"
                      value="individual"
                      checked={metadata.mode === "individual"}
                      onChange={() =>
                        setMetadata((prev) => ({
                          ...prev,
                          mode: "individual",
                        }))
                      }
                    />
                    Indywidualna
                  </label>

                  <label className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <input
                      type="radio"
                      name="mode"
                      value="team"
                      checked={metadata.mode === "team"}
                      onChange={() =>
                        setMetadata((prev) => ({
                          ...prev,
                          mode: "team",
                        }))
                      }
                    />
                    Zespołowa
                  </label>
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="metaNotes"
                  className="mb-1 block text-sm font-medium text-[var(--text-main)]"
                >
                  Uwagi ogólne
                </label>
                <textarea
                  id="metaNotes"
                  value={metadata.notes}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-main)]"
                  rows={5}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onStart}
            className="btn-primary rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-medium text-[color:var(--on-brand)] hover:opacity-90 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            Rozpocznij samoocenę
          </button>
        </div>
      </Card>
    </main>
  );
}