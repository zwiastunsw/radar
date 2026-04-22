type MaturityLevel =
  | "poczatkowy"
  | "porzadkowania"
  | "integracji"
  | "dojrzalosci";

interface ExecutiveNarrative {
  headline: string;
  summary: string;
  strengthsLabel: string;
  risksLabel: string;
  nextStep: string;
}

export const executiveNarratives: Record<MaturityLevel, ExecutiveNarrative> = {
  poczatkowy: {
    headline: "Dostępność nie jest jeszcze trwale osadzona w sposobie działania organizacji.",
    summary:
      "Działania mają głównie charakter reaktywny i zależą od pojedynczych osób lub sytuacji. Brakuje wspólnego podejścia, stałych zasad i przewidywalnego modelu działania.",
    strengthsLabel: "Pojawiają się pierwsze sygnały gotowości do zmiany.",
    risksLabel:
      "Największym ryzykiem jest przypadkowość działań i uzależnienie postępów od doraźnych interwencji.",
    nextStep:
      "Priorytetem powinno być uporządkowanie podstaw odpowiedzialności, zasad działania i pierwszych procesów.",
  },
  porzadkowania: {
    headline: "Organizacja zaczyna porządkować działania, ale system nie działa jeszcze spójnie.",
    summary:
      "W części obszarów istnieją już praktyki i odpowiedzialności, jednak nie tworzą jeszcze jednolitego modelu zarządzania dostępnością.",
    strengthsLabel: "Widoczne są pierwsze powtarzalne rozwiązania i gotowość do działania.",
    risksLabel:
      "Największym ryzykiem jest rozproszenie działań między obszarami oraz brak trwałego nadzoru kierowniczego.",
    nextStep:
      "Priorytetem powinno być połączenie istniejących działań w spójny model organizacyjny.",
  },
  integracji: {
    headline: "Dostępność staje się elementem zwykłego zarządzania, ale wymaga dalszego utrwalenia.",
    summary:
      "Organizacja ma już działające mechanizmy i potrafi uwzględniać dostępność w wielu procesach, jednak nie we wszystkich obszarach działa to równie stabilnie.",
    strengthsLabel: "Dostępność jest coraz częściej uwzględniana z wyprzedzeniem, a nie dopiero po wystąpieniu problemu.",
    risksLabel:
      "Największym ryzykiem jest nierównomierność dojrzałości między obszarami i osłabienie tempa zmian.",
    nextStep:
      "Priorytetem powinno być utrwalenie standardów oraz regularny przegląd skuteczności działań.",
  },
  dojrzalosci: {
    headline: "Organizacja zarządza dostępnością w sposób świadomy, systemowy i przewidywalny.",
    summary:
      "Dostępność jest włączona do procesów, decyzji i odpowiedzialności. Mechanizmy działania nie zależą wyłącznie od jednostkowego zaangażowania.",
    strengthsLabel: "Największą siłą organizacji jest systemowe podejście i zdolność do utrzymywania jakości w czasie.",
    risksLabel:
      "Największym wyzwaniem pozostaje utrzymanie jakości przy zmianach organizacyjnych, technologicznych i kadrowych.",
    nextStep:
      "Priorytetem powinno być doskonalenie systemu, monitorowanie trwałości rozwiązań i wzmacnianie kultury organizacyjnej.",
  },
};