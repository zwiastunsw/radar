import type { ExecutiveDecisionMeta, ExecutiveNarrative, MaturityLevel } from "./executive.types";

export const executiveNarratives: Record<MaturityLevel, ExecutiveNarrative> = {
  poczatkowy: {
    headline:
      "Dostępność nie jest jeszcze trwale osadzona w sposobie działania organizacji.",
    summary:
      "Działania mają głównie charakter reaktywny i zależą od pojedynczych osób lub sytuacji. Brakuje wspólnego podejścia, stałych zasad i przewidywalnego modelu działania.",
    strengthsLabel:
      "Atutem organizacji jest to, że można już wskazać pierwsze punkty zaczepienia do zmiany.",
    risksLabel:
      "Największym ryzykiem jest przypadkowość działań, rozproszenie odpowiedzialności i zależność od doraźnych interwencji.",
    nextStep:
      "Priorytetem powinno być uporządkowanie podstaw: kierunku działania, odpowiedzialności, zasobów i pierwszych wspólnych zasad postępowania.",
  },
  porzadkowania: {
    headline:
      "Organizacja zaczyna porządkować działania, ale system nie działa jeszcze spójnie.",
    summary:
      "W części obszarów istnieją już praktyki, odpowiedzialności i rozwiązania organizacyjne, jednak nie tworzą jeszcze jednolitego modelu zarządzania dostępnością.",
    strengthsLabel:
      "Widoczne są pierwsze powtarzalne rozwiązania i realna gotowość do działania.",
    risksLabel:
      "Największym ryzykiem jest rozproszenie działań między obszarami oraz brak trwałego nadzoru kierowniczego nad całością.",
    nextStep:
      "Priorytetem powinno być połączenie istniejących działań w spójny model organizacyjny oraz objęcie go regularnym przeglądem.",
  },
  integracji: {
    headline:
      "Dostępność staje się elementem zwykłego zarządzania, ale wymaga dalszego utrwalenia.",
    summary:
      "Organizacja ma już działające mechanizmy i potrafi uwzględniać dostępność w wielu procesach, jednak nie we wszystkich obszarach działa to równie stabilnie i przewidywalnie.",
    strengthsLabel:
      "Dostępność jest coraz częściej uwzględniana z wyprzedzeniem, a nie dopiero po wystąpieniu problemu.",
    risksLabel:
      "Największym ryzykiem jest nierównomierność dojrzałości między obszarami oraz osłabienie tempa zmian po osiągnięciu pierwszych efektów.",
    nextStep:
      "Priorytetem powinno być utrwalenie standardów, monitorowanie ich stosowania i domknięcie słabszych obszarów.",
  },
  dojrzalosci: {
    headline:
      "Organizacja zarządza dostępnością w sposób świadomy, systemowy i przewidywalny.",
    summary:
      "Dostępność jest włączona do procesów, decyzji i odpowiedzialności. Mechanizmy działania nie zależą wyłącznie od jednostkowego zaangażowania, ale są elementem normalnego sposobu funkcjonowania organizacji.",
    strengthsLabel:
      "Największą siłą organizacji jest systemowe podejście i zdolność do utrzymywania jakości w czasie.",
    risksLabel:
      "Największym wyzwaniem pozostaje utrzymanie jakości przy zmianach organizacyjnych, kadrowych i technologicznych oraz dalsze doskonalenie systemu.",
    nextStep:
      "Priorytetem powinno być wzmacnianie trwałości rozwiązań, uczenie się na podstawie danych i rozwijanie kultury organizacyjnej wspierającej dostępność.",
  },
};

export const executiveDecisionMeta: Record<string, ExecutiveDecisionMeta> = {
  D1: {
    id: "D1",
    executiveTitle: "Przyjąć jasne podejście organizacji do dostępności cyfrowej",
    whyItMatters:
      "Bez wspólnego kierunku działania dostępność pozostaje zbiorem doraźnych reakcji, a nie elementem zarządzania.",
    impact:
      "Ta decyzja porządkuje oczekiwania, wzmacnia mandat do działania i ułatwia współpracę między komórkami organizacyjnymi.",
    timeframe: "teraz",
    systemImpact: 3,
    leadershipWeight: 3,
  },
  D2: {
    id: "D2",
    executiveTitle: "Ustalić model odpowiedzialności i nadzoru",
    whyItMatters:
      "Brak jasno określonych ról powoduje rozproszenie działań i utrudnia skuteczne wdrożenie decyzji.",
    impact:
      "Ta decyzja pozwala przejść od działań incydentalnych do regularnego zarządzania postępem.",
    timeframe: "teraz",
    systemImpact: 3,
    leadershipWeight: 3,
  },
  D3: {
    id: "D3",
    executiveTitle: "Zapewnić zasoby do trwałego działania i naprawy problemów",
    whyItMatters:
      "Bez czasu, kompetencji i środków nawet trafne decyzje nie przełożą się na trwałą zmianę.",
    impact:
      "Ta decyzja zwiększa realną zdolność organizacji do wdrażania standardów i usuwania barier.",
    timeframe: "teraz",
    systemImpact: 3,
    leadershipWeight: 3,
  },
  D4: {
    id: "D4",
    executiveTitle: "Ustalić wspólne zasady przygotowywania i publikowania informacji",
    whyItMatters:
      "Brak wspólnych reguł powoduje, że jakość publikacji zależy od lokalnych praktyk i indywidualnych nawyków.",
    impact:
      "Ta decyzja ogranicza liczbę błędów u źródła i poprawia spójność działań w całej organizacji.",
    timeframe: "najblizsze_miesiace",
    systemImpact: 2,
    leadershipWeight: 2,
  },
  D5: {
    id: "D5",
    executiveTitle: "Włączyć dostępność do procesu tworzenia i obiegu informacji",
    whyItMatters:
      "Problemy pojawiają się zwykle wtedy, gdy dostępność jest sprawdzana dopiero na końcu procesu.",
    impact:
      "Ta decyzja przesuwa ciężar z napraw na zapobieganie problemom już na etapie przygotowania treści.",
    timeframe: "najblizsze_miesiace",
    systemImpact: 3,
    leadershipWeight: 2,
  },
  D6: {
    id: "D6",
    executiveTitle: "Objąć informacje regularnym przeglądem jakości i dostępności",
    whyItMatters:
      "Bez regularnego przeglądu błędy utrwalają się i stają się elementem codziennej praktyki.",
    impact:
      "Ta decyzja wzmacnia odpowiedzialność za jakość publikacji i pozwala szybciej wychwytywać problemy.",
    timeframe: "najblizsze_miesiace",
    systemImpact: 2,
    leadershipWeight: 2,
  },
  D7: {
    id: "D7",
    executiveTitle: "Uwzględniać dostępność przy projektowaniu i zmianie usług cyfrowych",
    whyItMatters:
      "Usługi publiczne stają się niedostępne, gdy dostępność jest dopisywana po wdrożeniu zamiast być częścią projektu.",
    impact:
      "Ta decyzja zmniejsza koszty późniejszych napraw i poprawia użyteczność usług dla wszystkich użytkowników.",
    timeframe: "najblizsze_miesiace",
    systemImpact: 3,
    leadershipWeight: 2,
  },
  D8: {
    id: "D8",
    executiveTitle: "Włączyć potrzeby użytkowników do oceny i rozwoju usług",
    whyItMatters:
      "Organizacja nie zobaczy wszystkich barier, jeśli nie będzie aktywnie zbierać informacji o doświadczeniach użytkowników.",
    impact:
      "Ta decyzja pomaga lepiej rozpoznawać realne problemy i ustalać trafniejsze priorytety zmian.",
    timeframe: "najblizsze_miesiace",
    systemImpact: 2,
    leadershipWeight: 2,
  },
  D9: {
    id: "D9",
    executiveTitle: "Regularnie przeglądać dostępność kluczowych usług cyfrowych",
    whyItMatters:
      "Bez okresowej oceny organizacja traci kontrolę nad jakością usług w czasie.",
    impact:
      "Ta decyzja wzmacnia nadzór nad najważniejszymi usługami i pozwala szybciej reagować na pogorszenie jakości.",
    timeframe: "utrwalic",
    systemImpact: 2,
    leadershipWeight: 2,
  },
  D10: {
    id: "D10",
    executiveTitle: "Włączyć dostępność do zarządzania systemami informatycznymi",
    whyItMatters:
      "Systemy IT mogą utrwalać bariery, jeśli dostępność nie jest uwzględniana w rozwoju, utrzymaniu i zmianach.",
    impact:
      "Ta decyzja zmniejsza ryzyko powstawania barier technologicznych i stabilizuje jakość środowiska cyfrowego.",
    timeframe: "najblizsze_miesiace",
    systemImpact: 3,
    leadershipWeight: 2,
  },
  D11: {
    id: "D11",
    executiveTitle: "Zapewnić wymagania i testowanie dostępności przy zmianach systemów",
    whyItMatters:
      "Każda zmiana systemu może wprowadzić nowe bariery, jeśli nie towarzyszą jej jasne wymagania i weryfikacja.",
    impact:
      "Ta decyzja ogranicza ryzyko regresu i wzmacnia jakość wdrożeń technologicznych.",
    timeframe: "najblizsze_miesiace",
    systemImpact: 3,
    leadershipWeight: 2,
  },
  D12: {
    id: "D12",
    executiveTitle: "Objąć systemy IT stałym monitoringiem i przeglądem dostępności",
    whyItMatters:
      "Bez monitoringu organizacja reaguje dopiero wtedy, gdy bariery już wpływają na pracę lub obsługę użytkowników.",
    impact:
      "Ta decyzja pozwala wcześniej wykrywać problemy i planować działania naprawcze w sposób przewidywalny.",
    timeframe: "utrwalic",
    systemImpact: 2,
    leadershipWeight: 2,
  },
  D13: {
    id: "D13",
    executiveTitle: "Włączyć dostępność do standardów zakupów i zamówień publicznych",
    whyItMatters:
      "Jeżeli wymagania dostępności nie są stawiane na etapie zakupu, organizacja nabywa problemy razem z produktem lub usługą.",
    impact:
      "Ta decyzja ogranicza ryzyko kosztownych napraw po wdrożeniu i wzmacnia pozycję organizacji wobec dostawców.",
    timeframe: "teraz",
    systemImpact: 3,
    leadershipWeight: 3,
  },
  D14: {
    id: "D14",
    executiveTitle: "Weryfikować spełnienie wymagań dostępności przez wykonawców",
    whyItMatters:
      "Same zapisy w dokumentach zakupowych nie gwarantują jakości, jeśli nie towarzyszy im realna weryfikacja.",
    impact:
      "Ta decyzja poprawia skuteczność zamówień i ogranicza ryzyko odbioru niedostępnych rozwiązań.",
    timeframe: "najblizsze_miesiace",
    systemImpact: 3,
    leadershipWeight: 2,
  },
  D15: {
    id: "D15",
    executiveTitle: "Wykorzystywać doświadczenia z zakupów do doskonalenia standardów",
    whyItMatters:
      "Organizacja rozwija się szybciej, gdy wyciąga wnioski z wcześniejszych postępowań i wdrożeń.",
    impact:
      "Ta decyzja wzmacnia dojrzałość organizacji i poprawia jakość kolejnych zakupów.",
    timeframe: "utrwalic",
    systemImpact: 2,
    leadershipWeight: 2,
  },
};