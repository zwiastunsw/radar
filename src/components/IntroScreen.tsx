import { useEffect, useMemo, useRef, useState } from "react";
import type { AssessmentMetadata } from "../types";
import { Card } from "./ui";

type IntroScreenProps = {
  metadata: AssessmentMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<AssessmentMetadata>>;
  onStart: () => void;
};

type FieldErrors = {
  organization?: string;
  assessor?: string;
  assessmentDate?: string;
  previousAssessmentDate?: string;
};

export function IntroScreen({
  metadata,
  setMetadata,
  onStart,
}: IntroScreenProps) {
  const titleId = "intro-title";
  const descId = "intro-desc";

  const organizationRef = useRef<HTMLInputElement | null>(null);
  const assessorRef = useRef<HTMLInputElement | null>(null);
  const assessmentDateRef = useRef<HTMLInputElement | null>(null);
  const previousAssessmentDateRef = useRef<HTMLInputElement | null>(null);
  const formErrorRef = useRef<HTMLDivElement | null>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const trimmedOrganization = metadata.organization.trim();
  const trimmedAssessor = metadata.assessor.trim();

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!trimmedOrganization) {
      nextErrors.organization = "Podaj nazwę organizacji.";
    }

    if (!trimmedAssessor) {
      nextErrors.assessor = "Podaj osobę oceniającą.";
    }

    if (
      metadata.assessmentDate &&
      metadata.previousAssessmentDate &&
      metadata.previousAssessmentDate > metadata.assessmentDate
    ) {
      nextErrors.previousAssessmentDate =
        "Data poprzedniej oceny nie może być późniejsza niż data wykonania samooceny.";
    }

    return nextErrors;
  };

  const isFormReady = useMemo(() => {
    return trimmedOrganization !== "" && trimmedAssessor !== "";
  }, [trimmedOrganization, trimmedAssessor]);

  useEffect(() => {
    if (!submitAttempted) return;
    setErrors(validate());
  }, [
    metadata.organization,
    metadata.assessor,
    metadata.assessmentDate,
    metadata.previousAssessmentDate,
    submitAttempted,
  ]);

  const focusFirstInvalidField = (validationErrors: FieldErrors) => {
    if (validationErrors.organization) {
      organizationRef.current?.focus();
      return;
    }

    if (validationErrors.assessor) {
      assessorRef.current?.focus();
      return;
    }

    if (validationErrors.assessmentDate) {
      assessmentDateRef.current?.focus();
      return;
    }

    if (validationErrors.previousAssessmentDate) {
      previousAssessmentDateRef.current?.focus();
      return;
    }

    formErrorRef.current?.focus();
  };

  const handleStart = () => {
    setSubmitAttempted(true);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalidField(validationErrors);
      return;
    }

    onStart();
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="mx-auto max-w-4xl"
    >
      <Card className="p-6 md:p-8">
        <h1 id={titleId} className="text-2xl font-semibold text-[var(--text-main)]">
          Radar dostępności
        </h1>

        <p id={descId} className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
          Narzędzie pomaga ocenić zdolności organizacji do zapewniania dostępności cyfrowej i
          przełożyć wyniki oceny na decyzje kierownicze, rekomendacje oraz plan
          działań.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section aria-labelledby="instruction-heading">
            <h2
              id="instruction-heading"
              className="text-lg font-semibold text-[var(--text-main)]"
            >
              Jak korzystać z narzędzia
            </h2>

            <ul className="list mt-3 text-sm leading-7 text-[var(--text-muted)]">
              <li>
                Odpowiadaj, oceniając rzeczywiste działanie organizacji, a nie
                deklaracje lub plany.
              </li>
              <li>Jeśli nie masz pewności, wybierz niższą ocenę.</li>
              <li>
                W przypadku oceny zespołowej uzgadniaj odpowiedzi na podstawie
                dowodów.
              </li>
              <li>Wyniki pokażą obszary wymagające decyzji i działań.</li>
            </ul>

            <div className="mt-4 rounded-2xl bg-[var(--surface-2)] p-4 text-sm leading-7 text-[var(--text-muted)]">
              Rozpoczęcie oceny wymaga uzupełnienia podstawowych danych
              identyfikujących ocenę: nazwy organizacji oraz osoby oceniającej.
            </div>
          </section>

          <section aria-labelledby="meta-heading">
            <h2
              id="meta-heading"
              className="text-lg font-semibold text-[var(--text-main)]"
            >
              Metadane oceny
            </h2>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Pola oznaczone <span aria-hidden="true">*</span> są wymagane.
            </p>

            <div className="mt-3 space-y-4">
              {submitAttempted && hasErrors ? (
                <div
                  ref={formErrorRef}
                  tabIndex={-1}
                  role="alert"
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text-main)]"
                >
                  Aby rozpocząć ocenę, uzupełnij wymagane pola: nazwę
                  organizacji i osobę oceniającą. Sprawdź także poprawność dat,
                  jeśli zostały wpisane.
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="organization"
                  className="mb-1 block text-sm font-medium text-[var(--text-main)]"
                >
                  Nazwa organizacji <span aria-hidden="true">*</span>
                </label>
                <input
                  ref={organizationRef}
                  id="organization"
                  type="text"
                  value={metadata.organization}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      organization: e.target.value,
                    }))
                  }
                  required
                  aria-required="true"
                  aria-invalid={errors.organization ? "true" : "false"}
                  aria-describedby={
                    errors.organization ? "organization-error" : undefined
                  }
                  className={[
                    "w-full rounded-xl bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-main)]",
                    errors.organization
                      ? "border border-[var(--danger)]"
                      : "border border-[var(--border)]",
                  ].join(" ")}
                  autoComplete="organization"
                />
                {errors.organization ? (
                  <p
                    id="organization-error"
                    className="mt-1 text-xs text-[var(--danger)]"
                  >
                    {errors.organization}
                  </p>
                ) : null}
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
                    ref={assessmentDateRef}
                    id="assessmentDate"
                    type="date"
                    value={metadata.assessmentDate}
                    onChange={(e) =>
                      setMetadata((prev) => ({
                        ...prev,
                        assessmentDate: e.target.value,
                      }))
                    }
                    aria-invalid={errors.assessmentDate ? "true" : "false"}
                    aria-describedby={
                      errors.assessmentDate ? "assessmentDate-error" : undefined
                    }
                    className={[
                      "w-full rounded-xl bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-main)]",
                      errors.assessmentDate
                        ? "border border-[var(--danger)]"
                        : "border border-[var(--border)]",
                    ].join(" ")}
                  />
                  {errors.assessmentDate ? (
                    <p
                      id="assessmentDate-error"
                      className="mt-1 text-xs text-[var(--danger)]"
                    >
                      {errors.assessmentDate}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="previousAssessmentDate"
                    className="mb-1 block text-sm font-medium text-[var(--text-main)]"
                  >
                    Data poprzedniej oceny
                  </label>
                  <input
                    ref={previousAssessmentDateRef}
                    id="previousAssessmentDate"
                    type="date"
                    value={metadata.previousAssessmentDate}
                    onChange={(e) =>
                      setMetadata((prev) => ({
                        ...prev,
                        previousAssessmentDate: e.target.value,
                      }))
                    }
                    aria-invalid={
                      errors.previousAssessmentDate ? "true" : "false"
                    }
                    aria-describedby={
                      errors.previousAssessmentDate
                        ? "previousAssessmentDate-error"
                        : undefined
                    }
                    className={[
                      "w-full rounded-xl bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-main)]",
                      errors.previousAssessmentDate
                        ? "border border-[var(--danger)]"
                        : "border border-[var(--border)]",
                    ].join(" ")}
                  />
                  {errors.previousAssessmentDate ? (
                    <p
                      id="previousAssessmentDate-error"
                      className="mt-1 text-xs text-[var(--danger)]"
                    >
                      {errors.previousAssessmentDate}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="assessor"
                  className="mb-1 block text-sm font-medium text-[var(--text-main)]"
                >
                  Osoba oceniająca <span aria-hidden="true">*</span>
                </label>
                <input
                  ref={assessorRef}
                  id="assessor"
                  type="text"
                  value={metadata.assessor}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      assessor: e.target.value,
                    }))
                  }
                  required
                  aria-required="true"
                  aria-invalid={errors.assessor ? "true" : "false"}
                  aria-describedby={errors.assessor ? "assessor-error" : undefined}
                  className={[
                    "w-full rounded-xl bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-main)]",
                    errors.assessor
                      ? "border border-[var(--danger)]"
                      : "border border-[var(--border)]",
                  ].join(" ")}
                  autoComplete="name"
                />
                {errors.assessor ? (
                  <p
                    id="assessor-error"
                    className="mt-1 text-xs text-[var(--danger)]"
                  >
                    {errors.assessor}
                  </p>
                ) : null}
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
            onClick={handleStart}
            aria-disabled={!isFormReady}
            className={[
              "rounded-xl px-5 py-3 text-sm font-medium",
              "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
              isFormReady
                ? "btn-primary"
                : "border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]",
            ].join(" ")}
          >
            Rozpocznij samoocenę
          </button>
        </div>
      </Card>
    </section>
  );
}
