import React from "react";
import { Sidebar, Topbar } from "../ui/Common_project.js";

function InformacjeMSB() {
    const rows = [
        { type: "section", title: "Zasady ogólne i odpowiedzialność" },
        {
            lp: 1,
            standard: "KSRF 200 – Ogólne cele niezależnego biegłego rewidenta oraz przeprowadzenie badania zgodnie z Międzynarodowymi Standardami Badania",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: `Przy przeprowadzaniu badania sprawozdań finansowych ogólne cele biegłego rewidenta stanowią:
a) uzyskanie wystarczającej pewności, czy sprawozdania finansowe jako całość nie zawierają istotnego zniekształcenia, niezależnie od tego, czy zostało ono spowodowane błędem lub oszustwem, co umożliwi biegłemu rewidentowi wyrażenie opinii o tym, czy sprawozdania finansowe zostały, we wszystkich istotnych aspektach, sporządzone zgodnie z mającymi zastosowanie ramowymi zasadami sprawozdawczości finansowej,
b) sporządzenie sprawozdania na temat sprawozdań finansowych i przekazanie stosownie do wymogów MSB informacji zgodnych z ustaleniami biegłego rewidenta.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/516,KRBR-uchwala-2783-52-2015-KSRF-200.pdf",
        },
        {
            lp: 2,
            standard: "KSRF 210 – Uzgadnianie warunków zlecenia badania",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: `Celem biegłego rewidenta jest przyjęcie lub kontynuacja zlecenia badania tylko wtedy, gdy zasady, w oparciu o które zlecenie badania będzie wykonane, zostały uzgodnione przez:
a) ustalenie, czy istnieją wstępne warunki badania oraz
b) potwierdzenie, że pomiędzy biegłym rewidentem a kierownictwem oraz – tam gdzie to odpowiednie – osobami sprawującymi nadzór istnieje wzajemne zrozumienie co do warunków zlecenia badania.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/497,KRBR-uchwala-2783-52-2015-KSRF-210.pdf",
        },
        {
            lp: 3,
            standard: "KSRF 220 – Kontrola jakości badania sprawozdań finansowych",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: `Celem biegłego rewidenta jest wdrożenie procedur kontroli jakości na poziomie zlecenia badania, które dostarczą biegłemu rewidentowi wystarczającą pewność, że:
a) badanie spełnia zawodowe standardy oraz obowiązujące wymogi prawne i regulacyjne oraz
b) sprawozdanie biegłego rewidenta jest odpowiednie do okoliczności.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/498,KRBR-uchwala-2783-52-2015-KSRF-220.pdf",
        },
        {
            lp: 4,
            standard: "KSRF 230 – Dokumentacja badania",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: `Celem biegłego rewidenta jest sporządzenie dokumentacji, która zawiera:
a) wystarczające i odpowiednie zapisy uzasadniające sprawozdanie biegłego rewidenta oraz
b) dowody na to, że badanie zostało zaplanowane i przeprowadzone zgodnie z MSB oraz mającymi zastosowanie wymogami prawnymi i regulacyjnymi.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/510,KRBR-uchwala-2783-52-2015-KSRF-230.pdf",
        },
        {
            lp: 5,
            standard: "KSRF 240 – Odpowiedzialność biegłego rewidenta podczas badania sprawozdań finansowych",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: `Celami biegłego rewidenta są:
a) zidentyfikowanie i ocena ryzyka istotnego zniekształcenia sprawozdań finansowych spowodowanego oszustwem,
b) uzyskanie wystarczających i odpowiednich dowodów oszustw badania na temat oszacowanego ryzyka istotnego zniekształcenia spowodowanego oszustwem, poprzez zaprojektowanie i zastosowanie właściwej reakcji oraz
c) właściwa reakcja na wykryte lub domniemane oszustwo zidentyfikowane podczas badania.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/503,KRBR-uchwala-2783-52-2015-KSRF-240.pdf",
        },
        {
            lp: 6,
            standard: "KSRF 250 – Uwzględnienie prawa i regulacji podczas badania sprawozdań finansowych",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: `Celem biegłego rewidenta jest:
a) uzyskanie wystarczających i odpowiednich dowodów badania dotyczących przestrzegania tych praw i regulacji, które ogólnie uznaje się za mające bezpośredni wpływ na ustalanie istotnych kwot i ujawnień w sprawozdaniach finansowych,
b) przeprowadzenie określonych procedur badania pomocnych w rozpoznaniu przypadków naruszenia innych praw i regulacji, które mogą mieć istotny wpływ na sprawozdania finansowe oraz
c) właściwa reakcja na rozpoznane podczas badania przypadki naruszenia lub podejrzenia naruszenia prawa i regulacji.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/504,KRBR-uchwala-2783-52-2015-KSRF-250.pdf",
        },
        {
            lp: 7,
            standard: "KSRF 260 – Komunikowanie się z osobami sprawującymi nadzór",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: `Celem biegłego rewidenta jest:
a) komunikowanie się w sposób jasny z osobami sprawującymi nadzór w sprawach związanych z odpowiedzialnością biegłego rewidenta za badanie sprawozdań finansowych jak również przeglądem zaplanowanego zakresu i rozłożenia w czasie badania,
b) uzyskanie od osób sprawujących nadzór informacji ważnych dla badania,
c) przekazanie osobom sprawującym nadzór bez zwłoki wynikających z badania spostrzeżeń, które są znaczące i odpowiednie z uwagi na odpowiedzialność tych osób za nadzorowanie procesu sprawozdawczości finansowej oraz
d) promowanie skutecznego dwustronnego komunikowania się biegłego rewidenta z osobami sprawującymi nadzór.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/515,KRBR-uchwala-2783-52-2015-KSRF-260.pdf",
        },
        {
            lp: 8,
            standard: "KSRF 265 – Komunikowanie się z osobami sprawującymi nadzór i kierownictwem w sprawie słabości kontroli wewnętrznej",
            zastosowanie: "Stosuje się w każdym badaniu, jeżeli zidentyfikowane zostaną słabości kontroli wewnętrznej",
            cele: `Celem biegłego rewidenta jest odpowiednie informowanie osób sprawujących nadzór i kierownictwa o słabości kontroli wewnętrznej, którą biegły rewident rozpoznał podczas badania, i która, zgodnie z jego zawodowym osądem, ma na tyle duże znaczenie, że zasługuje na poświęcenie jej uwagi.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/513,KRBR-uchwala-2783-52-2015-KSRF-265.pdf",
        },


        { type: "section", title: "Szacowanie ryzyk i wynikająca z tego reakcja rewizyjna" },
        {
            lp: 9,
            standard: "KSRF 300 – Planowanie badania sprawozdań finansowych",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: "Celem biegłego rewidenta jest takie zaplanowanie badania, aby badanie zostało przeprowadzone w sposób efektywny.",
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/502,KRBR-uchwala-2783-52-2015-KSRF-300.pdf",
        },
        {
            lp: 10,
            standard: "KSRF 315 – identyfikacja i ocena ryzyk istotnego zniekształcenia dzięki zrozumieniu jednostki i jej otoczenia",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: "Celem biegłego rewidenta jest identyfikacja i ocena ryzyk istotnego zniekształcenia, niezależnie od tego, czy powstało ono na skutek oszustwa lub błędu na poziomie sprawozdania finansowego, czy stwierdzeń, dzięki zrozumieniu jednostki i jej otoczenia, w tym kontroli wewnętrznej jednostki, co stanowi podstawę do zaprojektowania i wdrożenia reakcji na ocenione ryzyka istotnego zniekształcenia.",
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/518,KRBR-uchwala-2783-52-2015-KSRF-315.pdf",
        },
        {
            lp: 11,
            standard: "KSRF 320 – Istotność przy planowaniu i przeprowadzaniu badania",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: "Celem biegłego rewidenta jest odpowiednie zastosowanie koncepcji istotności przy planowaniu i przeprowadzaniu badania.",
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/507,KRBR-uchwala-2783-52-2015-KSRF-320.pdf",
        },
        {
            lp: 12,
            standard: "KSRF 330 – Postępowanie biegłego rewidenta w odpowiedzi na ocenę ryzyka",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: "Celem biegłego rewidenta jest uzyskanie wystarczających i odpowiednich dowodów badania ocenionego ryzyka istotnego zniekształcenia dzięki zaprojektowaniu i zastosowaniu odpowiednich do tego ryzyka reakcji.",
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/508,KRBR-uchwala-2783-52-2015-KSRF-330.pdf",
        },
        {
            lp: 13,
            standard: "KSRF 402 – Okoliczności wymagające uwzględnienia przy badaniu jednostki korzystającej z organizacji usługowej",
            zastosowanie: "Stosuje się, gdy badana jednostka korzysta z organizacji usługowych.",
            cele: `Celem biegłego rewidenta jednostki korzystającej z usług organizacji usługowej jest:
a) poznanie istoty i znaczenia usług organizacji usługowej oraz ich wpływu na mającą znaczenie dla badania kontrolę wewnętrzną jednostki korzystającej z usług organizacji usługowej w zakresie wystarczającym do rozpoznania i oceny ryzyka istotnego zniekształcenia,
b) zaprojektowanie oraz przeprowadzenie procedur badania, będących odpowiedzią na to ryzyko.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/505,KRBR-uchwala-2783-52-2015-KSRF-402.pdf",
        },
        {
            lp: 14,
            standard: "KSRF 450 – Ocena zniekształceń rozpoznanych w trakcie badania",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: `Celem biegłego rewidenta jest ocena:
a) wpływu rozpoznanych zniekształceń na badanie oraz
b) wpływu nieskorygowanych zniekształceń, jeśli takie występują, na sprawozdania finansowe.`,
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/496,KRBR-uchwala-2783-52-2015-KSRF-450.pdf",
        } ,

        { type: "section", title: "Dowody badania" },
        {
            lp: 15,
            standard: "KSRF 500 – Dowody badania",
            zastosowanie: "Stosuje się w każdym badaniu.",
            cele: "Celem biegłego rewidenta jest zaprojektowanie i przeprowadzenie procedur badania w sposób, który zapewni uzyskanie wystarczających i odpowiednich dowodów badania, umożliwiających sformułowanie racjonalnych wniosków leżących u podstaw opinii biegłego rewidenta.",
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/517,KRBR-uchwala-2783-52-2015-KSRF-500.pdf"
        },
        {
            lp: 16,
            standard: "KSRF 501 – Dowody badania – rozważania szczególne dotyczące wybranych zagadnień w zleceniu badania",
            zastosowanie: "Zakres standardu dotyczący sporów prawnych i roszczeń stosuje się w każdym badaniu. W pozostałym zakresie standard stosuje się w zależności od przedmiotu badania.",
            cele: "Celem biegłego rewidenta jest uzyskanie wystarczających i odpowiednich dowodów badania dotyczących: a) istnienia i stanu zapasów, b) kompletności ujęcia sporów prawnych i roszczeń wobec jednostki oraz c) prezentacji i ujawniania informacji o segmentach zgodnie z mającymi zastosowanie ramowymi założeniami sprawozdawczości finansowej.",
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/512,KRBR-uchwala-2783-52-2015-KSRF-501.pdf",
        },
        {
            lp: 17,
            standard: "KSRF 505 – Potwierdzenia zewnętrzne",
            zastosowanie: "Stosuje się w każdym badaniu, w którym biegły rewident wykorzystuje procedurę potwierdzeń zewnętrznych w celu uzyskania dowodów badania.",
            cele: "Celem biegłego rewidenta jest zaprojektowanie i przeprowadzenie takich procedur potwierdzeń zewnętrznych, które doprowadzą do uzyskania przydatnych i wiarygodnych dowodów badania.",
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/500,KRBR-uchwala-2783-52-2015-KSRF-505.pdf",
        },
            {
                lp: 18,
                standard: "KSRF 510 – Zlecenie badania po raz pierwszy – stany początkowe",
                zastosowanie: "Wymagane zastosowanie przy wykonywaniu zlecenia badania po raz pierwszy.",
                cele: "Celem biegłego rewidenta związanym ze stanami początkowymi jest zebranie wystarczających i odpowiednich dowodów badania dotyczących:\n" +
                    "a) czy stany początkowe zawierają zniekształcenia, które istotnie wpływają na sprawozdania finansowe za bieżący okres,\n" +
                    "b) czy prawidłowe zasady (polityka) rachunkowości zastosowane do stanów początkowych były stosowane w sposób ciągły lub zmiany w nich dokonane zostały prawidłowo rozliczone i odpowiednio zaprezentowane zgodnie z mającymi zastosowanie ramowymi założeniami sprawozdawczości finansowej.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/514,KRBR-uchwala-2783-52-2015-KSRF-510.pdf"
            },
            {
                lp: 19,
                standard: "KSRF 520 – Procedury analityczne",
                zastosowanie: "Wymagane rozważenie zastosowania w każdym badaniu jako badań wstępny i końcowy przegląd analityczny.",
                cele: "Celem biegłego rewidenta jest:\n" +
                    "a) uzyskanie odpowiednich i wiarygodnych dowodów badania przy zastosowaniu analitycznych procedur wiarygodności,\n" +
                    "b) zaprojektowanie i przeprowadzenie procedur analitycznych na zakończenie badania, gdy formułuje on ogólny wniosek, czy sprawozdania finansowe są zgodne z jego wiedzą o jednostce.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/499,KRBR-uchwala-2783-52-2015-KSRF-520.pdf",
            },
            {
                lp: 20,
                standard: "KSRF 530 – Badanie wyrywkowe (próbkowanie)",
                zastosowanie: "Rozważa się stosowanie w każdym badaniu.",
                cele: "Celem biegłego rewidenta podczas przeprowadzania badania wyrywkowego (próbkowania) jest:\n" +
                    "a) dostarczenie uzasadnionej podstawy dla sformułowania wniosków na temat populacji, z której została pobrana próbka.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/509,KRBR-uchwala-2783-52-2015-KSRF-530.pdf",
            },
            {
                lp: 21,
                standard: "KSRF 540 – Badanie wartości szacunkowych, w tym szacunków wartości godziwej i powiązanych ujawnień",
                zastosowanie: "Stosuje się w każdym badaniu, gdy występują wartości szacunkowe, w tym szacunki wartości godziwej.",
                cele: "Celem biegłego rewidenta jest uzyskanie odpowiednich i wystarczających dowodów badania na temat tego, czy:\n" +
                    "a) wartości szacunkowe, w tym szacunki wartości godziwej, ujęte lub ujawnione w sprawozdaniach finansowych, są racjonalne,\n" +
                    "b) powiązane ujawnienia w sprawozdaniach finansowych są odpowiednie do mających zastosowanie ramowych założeń sprawozdawczości finansowej.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/506,KRBR-uchwala-2783-52-2015-KSRF-540.pdf",
            },
            {
                lp: 22,
                standard: "KSRF 550 – Podmioty powiązane",
                zastosowanie: "Stosuje się w każdym badaniu, gdy występują podmioty powiązane.",
                cele: "Celem biegłego rewidenta jest:\n" +
                    "a) zrozumienie powiązań i transakcji z podmiotami powiązanymi, aby rozpoznać czynniki ryzyka oszustwa i stwierdzić, czy sprawozdania finansowe rzetelnie odzwierciedlają te powiązania i transakcje,\n" +
                    "b) uzyskanie wystarczających i odpowiednich dowodów badania wskazujących, czy powiązania i transakcje z podmiotami powiązanymi zostały odpowiednio rozpoznane, ujęte i ujawnione w sprawozdaniach finansowych.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/501,KRBR-uchwala-2783-52-2015-KSRF-550.pdf",
            },
            {
                lp: 23,
                standard: "KSRF 560 – Późniejsze zdarzenia",
                zastosowanie: "Stosuje się w każdym badaniu.",
                cele: "Celami biegłego rewidenta są:\n" +
                    "a) uzyskanie wystarczających i odpowiednich dowodów badania na okoliczność, że zdarzenia następujące między datą sprawozdań finansowych a datą sprawozdania biegłego rewidenta, które wymagają korekty lub ujawnienia, zostały odpowiednio odzwierciedlone,\n" +
                    "b) właściwa reakcja na fakty dowiedzione po dacie sprawozdania biegłego rewidenta, które mogłyby wpłynąć na sprawozdanie.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/511,KRBR-uchwala-2783-52-2015-KSRF-560.pdf",
            },
            {
                lp: 24,
                standard: "KSRF 570 – Kontynuacja działalności",
                zastosowanie: "Stosuje się w każdym badaniu.",
                cele: "Celem biegłego rewidenta jest:\n" +
                    "a) uzyskanie wystarczających i odpowiednich dowodów badania wskazujących na zasadność przyjęcia założenia kontynuacji działalności,\n" +
                    "b) rozważenie istnienia istotnej niepewności dotyczącej zdarzeń lub uwarunkowań, które mogą budzić poważne wątpliwości co do zdolności jednostki do kontynuacji działalności,\n" +
                    "c) określenie wpływu na sprawozdanie biegłego rewidenta.",
                czy: "TAK",
                link:"https://www.pibr.org.pl/assets/file/494,KRBR-uchwala-2783-52-2015-KSRF-570.pdf",
            },
            {
                lp: 25,
                standard: "KSRF 580 – Pisemne oświadczenia",
                zastosowanie: "Stosuje się w każdym badaniu.",
                cele: "Celem biegłego rewidenta jest:\n" +
                    "a) uzyskanie pisemnych oświadczeń od kierownictwa oraz osób sprawujących nadzór,\n" +
                    "b) wsparcie innych dowodów badania za pomocą pisemnych oświadczeń, jeśli uznane za konieczne,\n" +
                    "c) właściwa reakcja na złożone lub niezłożone pisemne oświadczenia.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/490,KRBR-uchwala-2783-52-2015-KSRF-580.pdf"
            },
            { type: "section", title: "Korzystanie z ustaleń innych osób" },
            {
                lp: 26,
                standard: "KSRF 600 – Badanie sprawozdań finansowych grupy (w tym praca biegłych rewidentów części grupy)",
                zastosowanie: "Stosuje się w przypadku badania skonsolidowanego sprawozdania finansowego grupy, a zwłaszcza tych, w których uczestniczą biegli rewidenci części grupy.",
                cele: "Celami biegłego rewidenta są:\n" +
                    "a) ustalenie, czy podjąć się funkcji biegłego rewidenta badającego sprawozdania finansowe grupy,\n" +
                    "b) występując w roli biegłego rewidenta badającego sprawozdania finansowe grupy:\n" +
                    "   i) komunikowanie się w jasny sposób z biegłymi rewidentami części grupy co do zakresu i czasu przeprowadzenia prac oraz wyników tych prac,\n" +
                    "   ii) uzyskanie dowodów badania informacji finansowych części grupy i procesu konsolidacyjnego wystarczających i odpowiednich do wyrażenia opinii, czy sprawozdania finansowe grupy są zgodne z mającymi zastosowanie ramowymi założeniami sprawozdawczości finansowej.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/495,KRBR-uchwala-2783-52-2015-KSRF-600.pdf",
            },
            {
                lp: 27,
                standard: "KSRF 610 – Wykorzystanie pracy audytorów wewnętrznych",
                zastosowanie: "Stosuje się w przypadku wykorzystania pracy funkcji audytu wewnętrznego przy uzyskiwaniu dowodów badania. MSB nie ma zastosowania, jeżeli jednostka nie posiada funkcji audytu wewnętrznego.",
                cele: "Celem biegłego rewidenta jest:\n" +
                    "a) ustalenie, czy wyniki pracy funkcji audytu wewnętrznego mogą zostać wykorzystane, a jeżeli tak, to w jakich obszarach i zakresie,\n" +
                    "b) jeśli wykorzystuje się wyniki pracy funkcji audytu wewnętrznego – ustalenie, czy praca ta jest odpowiednia do celów badania.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/492,KRBR-uchwala-2783-52-2015-KSRF-610.pdf",
            },
            {
                lp: 28,
                standard: "KSRF 620 – Korzystanie z wyników pracy eksperta powołanego przez biegłego rewidenta",
                zastosowanie: "Stosuje się, gdy wyniki pracy osoby lub organizacji posiadającej wiedzę z dziedziny innej niż rachunkowość lub rewizja finansowa, wykorzystuje się jako pomoc dla biegłego rewidenta przy uzyskaniu wystarczających i odpowiednich dowodów badania.",
                cele: "Celem biegłego rewidenta jest ustalenie:\n" +
                    "a) czy należy skorzystać z pracy eksperta powołanego przez biegłego rewidenta,\n" +
                    "b) w przypadku korzystania z wyników pracy eksperta – czy wyniki tej pracy odpowiadają celom biegłego rewidenta.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/493,KRBR-uchwala-2783-52-2015-KSRF-620.pdf",
            },
            { type: "section", title: "Wnioski z badania i sprawozdawczość" },
            {
                lp: 29,
                standard: "KSRF 700 – Formułowanie opinii i sprawozdanie na temat sprawozdań finansowych",
                zastosowanie: "Stosuje się w każdym badaniu.",
                cele: "Celami biegłego rewidenta są:\n" +
                    "a) formułowanie opinii o sprawozdaniach finansowych na podstawie oceny wniosków wyciągniętych z uzyskanych dowodów badania,\n" +
                    "b) jasne wyrażenie tej opinii w pisemnym sprawozdaniu, które opisuje również podstawy, na jakiej opiera się opinia.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/491,KRBR-uchwala-2783-52-2015-KSRF-700.pdf",
            },
            {
                lp: 30,
                standard: "KSRF 705 – Modyfikacja opinii w sprawozdaniu niezależnego biegłego rewidenta",
                zastosowanie: "Stosuje się, gdy formułując opinię zgodnie z MSB 700, biegły rewident stwierdza, że konieczne jest zmodyfikowanie opinii biegłego rewidenta na temat sprawozdań finansowych.",
                cele: "Celem biegłego rewidenta jest jasne wyrażenie odpowiednio zmodyfikowanej opinii o sprawozdaniach finansowych, gdy:\n" +
                    "a) sprawozdania finansowe jako całość zawierają istotne zniekształcenie,\n" +
                    "b) biegły rewident nie jest w stanie uzyskać wystarczających i odpowiednich dowodów badania, aby stwierdzić, że sprawozdania finansowe jako całość nie zawierają istotnego zniekształcenia.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/489,KRBR-uchwala-2783-52-2015-KSRF-705.pdf",
            },
            {
                lp: 31,
                standard: "KSRF 706 – Paragraf objaśniający i paragraf dotyczący innej sprawy w sprawozdaniu niezależnego biegłego rewidenta",
                zastosowanie: "Stosuje się, gdy biegły rewident uznaje za konieczne zwrócenie uwagi użytkowników na sprawy w sprawozdaniach finansowych, które są ważne dla zrozumienia sprawozdań lub procesu badania.",
                cele: "Celem biegłego rewidenta, który wyraził opinię o sprawozdaniach finansowych, jest – jeżeli uzna to za konieczne – zwrócenie uwagi użytkowników, poprzez zamieszczenie w sprawozdaniu dodatkowych informacji, na:\n" +
                    "a) sprawę zaprezentowaną lub ujawnioną w sprawozdaniach finansowych, która jest tak ważna, że ma podstawowe znaczenie dla zrozumienia sprawozdań finansowych,\n" +
                    "b) inną sprawę, jeśli to odpowiednie, która ma znaczenie dla zrozumienia przez użytkowników procesu badania, odpowiedzialności biegłego rewidenta lub sprawozdania biegłego rewidenta.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/488,KRBR-uchwala-2783-52-2015-KSRF-706.pdf",
            },
            {
                lp: 32,
                standard: "KSRF 710 – Informacje porównawcze – dane korespondujące i porównawcze sprawozdania finansowe",
                zastosowanie: "Standard ma zastosowanie zawsze w zakresie informacji porównawczych (w naszych warunkach brak zastosowania w odniesieniu do porównawczych sprawozdań finansowych).",
                cele: "Celami biegłego rewidenta są:\n" +
                    "a) uzyskanie wystarczających i odpowiednich dowodów badania na temat tego, czy informacje porównawcze w sprawozdaniach finansowych zostały zaprezentowane zgodnie z wymogami,\n" +
                    "b) sporządzenie sprawozdania biegłego rewidenta zgodnie z jego odpowiedzialnością sprawozdawczą.",
                czy: "TAK",
                link: "https://www.pibr.org.pl/assets/file/487,KRBR-uchwala-2783-52-2015-KSRF-710.pdf"
            },
        {
            lp: 33,
            standard: "KSRF 720 – Odpowiedzialność biegłego rewidenta dotycząca innych informacji zamieszczonych w dokumentach zawierających zbadane sprawozdania finansowe",
            zastosowanie: "Stosuje się np. w odniesieniu do zagadnień prezentowanych w sprawozdaniu z działalności. Zawsze, jeśli zgodnie z wymogami prawa jednostka jest zobowiązana do dołączenia do sprawozdania finansowego innych informacji.",
            cele: "Celem biegłego rewidenta jest stosowna reakcja w przypadku, gdy dokumenty zawierające zbadane sprawozdania finansowe oraz sprawozdanie biegłego rewidenta obejmują inne informacje, które mogłyby podważyć wiarygodność obu tych sprawozdań.",
            czy: "TAK",
            link: "https://www.pibr.org.pl/assets/file/485,KRBR-uchwala-2783-52-2015-KSRF-720.pdf",
        },
    ];

    return (
        <div className="d-flex min-vh-100">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Topbar
                    breadcrumb={[
                        { label: "Home", to: "/" },
                        { label: "Projekt", active: true }
                    ]}
                />

                <div className="p-4 overflow-auto">
                    <h5 className="mb-3 fw-semibold">Wykaz MSB zastosowanych w badaniu
                    </h5>

                    <div className="table-responsive">
                        <table className="table table-bordered table-sm align-middle" style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                            <thead>
                            <tr>
                                <th style={{ width: "5%", textAlign: "center", verticalAlign: "middle", backgroundColor: "#0a2b4c", color: "#ffffff" }}>Lp.</th>
                                <th style={{ width: "20%", textAlign: "center", verticalAlign: "middle", backgroundColor: "#0a2b4c", color: "#ffffff" }}>Numer i tytuł standardu</th>
                                <th style={{ width: "15%", textAlign: "center", verticalAlign: "middle", backgroundColor: "#0a2b4c", color: "#ffffff" }}>Kiedy standard ma zastosowanie?</th>
                                <th style={{ width: "45%", textAlign: "center", verticalAlign: "middle", backgroundColor: "#0a2b4c", color: "#ffffff" }}>Cel ogólny i cele cząstkowe biegłego rewidenta wg standardu</th>
                                <th style={{ width: "15%", textAlign: "center", verticalAlign: "middle", backgroundColor: "#0a2b4c", color: "#ffffff" }}>Czy standard ma zastosowanie w badaniu? (TAK lub NIE)</th>
                            </tr>
                            </thead>

                            <tbody>
                            {rows.map((r, index) => {
                                if (r.type === "section") {
                                    return (
                                        <tr key={`section-${index}`}>
                                            <td colSpan={5} style={{ backgroundColor: "#005679", color: "#ffffff", paddingTop: "10px", paddingBottom: "10px"}}
                                                className="fw-bold text-center">
                                                {r.title}
                                            </td>
                                        </tr>

                                    );
                                } else {
                                    return (
                                        <tr key={r.lp}>
                                            <td className="text-center">{r.lp}</td>
                                            <td style={{ padding: "12px",whiteSpace: "pre-wrap" }}>
                                                <a
                                                    href={r.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: "underline", color: "#005679", fontWeight: 500 }}
                                                >
                                                    {r.standard}
                                                </a>
                                            </td>
                                            <td style={{ padding: "12px" }}>{r.zastosowanie}</td>
                                            <td style={{ whiteSpace: "pre-wrap", padding: "12px"  }}>{r.cele}</td>
                                            <td className="text-center fw-bold">{r.czy}</td>
                                        </tr>
                                    );
                                }
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InformacjeMSB;

