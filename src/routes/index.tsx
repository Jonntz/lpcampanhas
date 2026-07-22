import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Handshake,
  Home,
  Instagram,
  Landmark,
  MapPin,
  MessageCircle,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Vote,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import audienciaPhoto from "@/assets/audience.jpeg";
import camaraPhoto from "@/assets/camara.png";
import palcoPhoto from "@/assets/palco.jpg";
import retratoPhoto from "@/assets/retrato.png";
import speakingPhoto from "@/assets/speaking.jpeg";
import zemaPhoto from "@/assets/zema.jpg";

import bannerMobile from "@/assets/mobile.webp";
import bannerPc from "@/assets/pc.webp";

const EVENT_DATE = new Date("2026-07-25T19:00:00-03:00");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Matheus Biancardine — Lançamento da pré-candidatura · 25/07/2026",
      },
      {
        name: "description",
        content:
          "Minas precisa de uma nova geração de lideranças. Participe do lançamento oficial da pré-candidatura de Matheus Biancardine a Deputado Federal por MG.",
      },
      {
        property: "og:title",
        content: "Matheus Biancardine — Uma nova geração para Minas Gerais",
      },
      {
        property: "og:description",
        content:
          "Lançamento oficial da pré-candidatura. 25 de julho de 2026. Garanta sua vaga.",
      },
      { property: "og:image", content: retratoPhoto },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: retratoPhoto },
    ],
  }),
  component: LandingPage,
});

// ---------------- Form ----------------

// 👇 Cole aqui a URL do seu Google Apps Script (Web App) depois de publicá-lo.
const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbza1l6D86cp83vtFp6-cNLQ-R7curNXp0DlxeGvJNzkcQH9Bpf4IENR8Y_X2r1TlbzH3w/exec";

const WHATSAPP_NUMBER = "5531985931115";

type FormData = { nome: string; whatsapp: string; cidade: string };

function useInscricaoForm() {
  const [data, setData] = useState<FormData>({
    nome: "",
    whatsapp: "",
    cidade: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Salvar no localStorage (backup local)
    const stored = JSON.parse(localStorage.getItem("inscricoes") ?? "[]");
    stored.push({ ...data, at: new Date().toISOString() });
    localStorage.setItem("inscricoes", JSON.stringify(stored));

    // 2. Enviar para o Google Sheets (em background, sem bloquear o fluxo)
    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          whatsapp: data.whatsapp,
          cidade: data.cidade,
          data: new Date().toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
          }),
        }),
      });
    } catch {
      // Silenciosamente ignora erro de rede — o dado já está no localStorage
    }

    // 3. Abrir o WhatsApp com mensagem pré-preenchida
    const msg = encodeURIComponent(
      `🟢 *Nova inscrição — Lançamento Biancardine*\n\n` +
        `👤 *Nome:* ${data.nome}\n` +
        `📱 *WhatsApp:* ${data.whatsapp}\n` +
        `📍 *Cidade:* ${data.cidade}`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setData({ nome: "", whatsapp: "", cidade: "" });
    }, 6000);
  };

  return { data, setData, submitted, loading, handleSubmit };
}

function InscricaoForm({
  idPrefix = "f1",
  compact = false,
}: {
  idPrefix?: string;
  compact?: boolean;
}) {
  const { data, setData, submitted, loading, handleSubmit } =
    useInscricaoForm();

  if (submitted) {
    return (
      <div className="rounded-2xl bg-brand-green/15 p-6 text-center ring-1 ring-brand-green/40">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-green" />
        <h3 className="mt-3 font-display text-xl font-black text-white">
          Inscrição confirmada!
        </h3>
        <p className="mt-1 text-sm text-white/80">
          Em breve entraremos em contato pelo WhatsApp com todos os detalhes do
          lançamento.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green backdrop-blur transition";

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-2.5" : "space-y-3"}
    >
      <input
        required
        id={`${idPrefix}-nome`}
        type="text"
        placeholder="Nome completo"
        value={data.nome}
        maxLength={120}
        onChange={(e) => setData({ ...data, nome: e.target.value })}
        className={inputClass}
        disabled={loading}
      />
      <input
        required
        id={`${idPrefix}-whatsapp`}
        type="tel"
        placeholder="WhatsApp (com DDD)"
        value={data.whatsapp}
        maxLength={20}
        onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
        className={inputClass}
        disabled={loading}
      />
      <input
        id={`${idPrefix}-cidade`}
        type="text"
        placeholder="Cidade"
        value={data.cidade}
        maxLength={80}
        onChange={(e) => setData({ ...data, cidade: e.target.value })}
        className={inputClass}
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl bg-brand-green px-6 py-4 text-base font-black uppercase tracking-wide text-brand-deep shadow-green-glow transition-all hover:bg-brand-green-hover hover:text-white active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Quero participar
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      </button>
      <p className="text-center text-[11px] text-white/55">
        Seus dados estão seguros. Usaremos apenas para informar sobre o evento.
      </p>
    </form>
  );
}

// ---------------- Nav ----------------

function Nav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <span aria-hidden />
        <span aria-hidden />
      </div>
    </nav>
  );
}

// ---------------- Banner Principal ----------------

function BannerPrincipal() {
  return (
    <section className="relative w-full bg-brand-deep">
      {/* Imagem Desktop (aparece a partir de telas médias) */}
      <img
        src={bannerPc}
        alt="Lançamento Matheus Biancardine"
        className="hidden md:block w-full h-auto object-cover"
      />

      {/* Imagem Mobile (aparece apenas em telas pequenas) */}
      <img
        src={bannerMobile}
        alt="Lançamento Matheus Biancardine"
        className="block md:hidden w-full h-auto object-cover"
      />

      {/* Container de Posicionamento Absoluto */}
      {/* No mobile usa bottom-[6%] e no desktop usa md:bottom-[10%] (ajuste a porcentagem se precisar subir/descer) */}
      <div className="absolute bottom-[11%] md:bottom-[28%] left-0 w-full z-20">
        {/* Alinhamento inteligente:
            - flex justify-center: Centraliza o botão no mobile
            - md:justify-start: Alinha o botão à esquerda no desktop
            - max-w-7xl mx-auto px-...: Garante que no PC ele fique alinhado com o texto das outras seções
        */}
        <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-0 flex justify-center md:justify-start">
          <a
            href="#inscricao"
            className="group relative flex items-center justify-center gap-2 rounded-xl bg-brand-green px-8 py-1 text-base sm:text-lg font-black uppercase tracking-wide text-brand-deep shadow-green-glow transition-all hover:bg-brand-green-hover hover:text-white active:scale-[0.99] w-[90%] sm:w-auto min-w-[280px] md:hidden"
          >
            Confirmar presença
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------- SAVE THE DATE ----------------

function SaveTheDateBar() {
  return (
    <div className="sticky top-0 z-40 border-b border-primary/40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 sm:gap-3">
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-blink" />
        <span className="font-display lg:text-xl tracking-[0.15em] text-primary animate-blink sm:text-xl sm:tracking-[0.32em]">
          SAVE THE DATE · MINAS GERAIS
        </span>
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-blink" />
      </div>
    </div>
  );
}

// ---------------- Hero (form na primeira dobra) ----------------

function Hero() {
  return (
    <section id="top" className="relative isolate min-h-screen overflow-hidden">
      {/* Foto de fundo */}
      <div className="absolute inset-0">
        <img
          src={palcoPhoto}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-[35%_30%] sm:object-[30%_25%] lg:object-[40%_25%]"
        />
        {/* Overlay para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-deep/85 to-brand-deep/40 lg:from-brand-deep/95 lg:via-brand-deep/75 lg:to-brand-deep/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/30 to-transparent" />
      </div>
      <div className="absolute inset-0 bg-grid-soft opacity-30" aria-hidden />
      <div
        className="absolute left-0 top-0 h-1.5 w-full bg-brand-green"
        aria-hidden
      />
      <div
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand-teal/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-green/15 blur-3xl"
        aria-hidden
      />

      <Nav />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-24 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-16 lg:pt-28">
        {/* Copy */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/40 bg-brand-green/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-green backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Pré-candidatura · Deputado Federal · MG
          </div>
          <h1 className="mt-5 font-display text-4xl font-black uppercase leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            Minas precisa de uma{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-green">
                nova geração
              </span>
              <span
                className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-brand-green/70"
                aria-hidden
              />
            </span>{" "}
            de lideranças.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
            Uma pré-candidatura a Deputado Federal que une Minas Gerais às
            principais vozes do país No dia 25 de julho, em Belo Horizonte,
            vamos dar o primeiro passo de um projeto que vai levar a voz dos
            mineiros para Brasília. Garanta sua vaga e esteja entre os
            primeiros.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-white/90">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/20 backdrop-blur">
              <Calendar className="h-4 w-4 text-brand-green" />
              <span className="text-sm font-semibold">25 de julho de 2026</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/20 backdrop-blur">
              <MapPin className="h-4 w-4 text-brand-green" />
              <span className="text-sm font-semibold">Minas Gerais</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div id="inscricao" className="lg:col-span-5">
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-3xl bg-brand-green opacity-30 blur-xl"
              aria-hidden
            />
            <div className="relative rounded-3xl bg-brand-deep/85 p-6 ring-1 ring-white/15 shadow-elegant backdrop-blur-md sm:p-7">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-green/15 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-brand-green">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-green" />{" "}
                Vagas limitadas
              </div>
              <h2 className="font-display text-2xl font-black text-white sm:text-[1.7rem]">
                Garanta sua vaga no lançamento
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Preencha os dados e receba o convite oficial pelo WhatsApp.
              </p>
              <div className="mt-5">
                <InscricaoForm idPrefix="hero" compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Contagem regressiva ----------------

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);
  const items = [
    { label: "Dias", value: days },
    { label: "Horas", value: hours },
    { label: "Min", value: minutes },
    { label: "Seg", value: seconds },
  ];
  return (
    <section className="relative overflow-hidden bg-brand-teal py-14 lg:py-16">
      <div className="absolute inset-0 bg-grid-soft opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-green">
          Faltam poucos dias para o lançamento oficial
        </p>
        <h2 className="mt-3 font-display text-3xl font-black text-white sm:text-4xl lg:text-5xl">
          25 de julho de 2026
        </h2>
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-4 gap-2 sm:gap-4">
          {items.map((it) => (
            <div
              key={it.label}
              className="rounded-2xl bg-brand-deep/60 p-3 ring-1 ring-white/15 backdrop-blur sm:p-5"
            >
              <p className="font-display text-3xl font-black tabular-nums text-brand-green sm:text-5xl">
                {String(it.value).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/70 sm:text-xs">
                {it.label}
              </p>
            </div>
          ))}
        </div>
        <a
          href="#inscricao"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3.5 text-sm font-black uppercase tracking-wide text-brand-deep transition hover:bg-brand-green-hover hover:text-white"
        >
          Quero participar
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

// ---------------- Quem é Matheus ----------------

// ---------------- Quem   Matheus ----------------
function Quem() {
  return (
    <section className="relative overflow-hidden bg-brand-deep py-20 lg:py-28">
      <div
        className="absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-3xl bg-brand-green opacity-20 blur-2xl"
              aria-hidden
            />
            <img
              src={retratoPhoto}
              alt="Matheus Biancardine"
              className="relative aspect-[4/5] w-full rounded-3xl object-cover object-top shadow-elegant"
              loading="lazy"
            />
            <div className="absolute -bottom-5 -right-5 hidden rounded-2xl bg-brand-green p-4 text-brand-deep shadow-elegant sm:block">
              <p className="font-display text-3xl font-black leading-none">
                25/07
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest">
                2026 - Lançamento
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="text-sm font-black uppercase tracking-widest text-brand-green">
            Conheça
          </p>
          <h2 className="mt-2 font-display text-4xl font-black text-white sm:text-5xl">
            Matheus Biancardine
          </h2>

          {/* Seção: Conheça Matheus Biancardine */}
          <div className="mt-6 space-y-4 text-base leading-relaxed text-white/80 sm:text-[1.05rem]">
            <p>
              Matheus Biancardine é uma jovem liderança mineira, fundador da
              Juventude do Partido Novo e Líder RenovaBR! Sua trajetória une a
              vocação para a vida pública à defesa dos valores cristãos, da vida
              e da família, traduzindo sua fé em ações pautadas pelo brio, pela
              ordem e pela retidão.
            </p>
            <p>
              Durante o governo Romeu Zema, atuou à frente das políticas
              estaduais para a juventude, liderando iniciativas voltadas ao
              fortalecimento do protagonismo jovem e à ampliação do diálogo
              entre governo, sociedade civil e lideranças de diferentes regiões
              de Minas Gerais. Seu trabalho o consolidou como uma referência na
              defesa de uma geração mais preparada para participar das decisões
              que impactam o presente e o futuro do estado.
            </p>
          </div>

          <details className="group mt-6 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition open:bg-white/[0.07]">
            <summary className="cursor-pointer list-none text-sm font-bold uppercase tracking-wider text-brand-green">
              Ler trajetória completa
              <span className="ml-2 inline-block transition group-open:rotate-180">
                ▼
              </span>
            </summary>

            {/* Seção: Ler Trajetória Completa */}
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
              <p>
                Recentemente, integrou a equipe do vice-governador Mateus Simões
                como assessor, contribuindo diretamente para a articulação
                institucional e para a construção de soluções voltadas ao
                desenvolvimento de Minas Gerais. Essa atuação no centro das
                decisões do governo fortaleceu sua experiência na gestão pública
                e ampliou sua compreensão dos desafios enfrentados pelo estado.
              </p>
              <p>
                Em reconhecimento à sua dedicação e contribuição para o
                fortalecimento da cidadania e do serviço público, foi agraciado
                com a{" "}
                <strong className="text-white">
                  Medalha Juscelino Kubitschek
                </strong>
                , uma das mais tradicionais e importantes honrarias concedidas
                pelo Governo de Minas Gerais.
              </p>
              <p>
                Defensor de uma gestão eficiente, moderna e livre de
                privilégios, Matheus entende a política não como uma carreira de
                gabinete, mas como uma vocação de servir! Movido por seus
                princípios, trabalha para que a retidão moral, a liberdade e a
                responsabilidade caminhem juntas, criando mais oportunidades
                para as próximas gerações de mineiros.
              </p>
            </div>
          </details>

          <a
            href="https://matheusbiancardine.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-brand-green/50 bg-brand-green/10 px-5 py-3 text-sm font-bold uppercase tracking-wide text-brand-green transition hover:bg-brand-green hover:text-brand-deep"
          >
            Conheça mais sobre mim e minhas propostas
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------- Autoridade (fotos) ----------------

function Autoridade() {
  const [isExpanded, setIsExpanded] = useState(false);

  const photos = [
    {
      src: zemaPhoto,
      label:
        "Coragem e fé! Trabalhando pela juventude mineira, com a liderança de Romeu Zema e Mateus Simões, mobilizando, atuando no Governo, e liderando movimentos jovens!",
      tag: "Governo de Minas",
    },
    {
      src: camaraPhoto,
      label: "Fundador da Juventude do Partido Novo e ex presidente nacional!",
      tag: "Vida pública",
      objectPosition: "object-top",
    },
    { src: speakingPhoto, label: "Líder Renova BR 2026!", tag: "Liderança" },
    {
      src: audienciaPhoto,
      label: "Gestor de políticas públicas para juventude mineira",
      tag: "Audiência Pública",
    },
  ];
  return (
    <section className="relative overflow-hidden bg-brand-teal py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-brand-green">
            Autoridade & Trajetória
          </p>
          <h2 className="mt-2 font-display text-4xl font-black text-white sm:text-5xl">
            Experiência reconhecida por quem faz Minas acontecer
          </h2>
          <p className="mt-4 text-white/80">
            Atuação ao lado do Governador Romeu Zema, em eventos oficiais,
            palestras e mobilizações pelo estado.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="overflow-hidden rounded-3xl ring-1 ring-white/10 lg:col-span-3 lg:row-span-2">
            <div className="group relative h-full">
              <img
                src={photos[0].src}
                alt={photos[0].label}
                className="h-72 w-full object-cover object-top transition duration-500 group-hover:scale-105 sm:h-96 lg:h-full"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/95 via-brand-deep/40 to-transparent p-5">
                <span className="inline-block rounded-full bg-brand-green px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-deep">
                  {photos[0].tag}
                </span>
                <p
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`mt-2 font-display text-lg font-bold text-white sm:text-xl cursor-pointer transition-all duration-300 ${
                    isExpanded ? "" : "line-clamp-2"
                  }`}
                  title={
                    isExpanded ? "Clique para esconder" : "Clique para ler mais"
                  }
                >
                  {photos[0].label}
                </p>
              </div>
            </div>
          </div>
          {photos.slice(1).map((p) => (
            <div
              key={p.label}
              className="group relative overflow-hidden rounded-3xl ring-1 ring-white/10 lg:col-span-3"
            >
              <img
                src={p.src}
                alt={p.label}
                className={`aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105 ${p.objectPosition || ""}`}
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/95 via-brand-deep/40 to-transparent p-4">
                <span className="inline-block rounded-full bg-brand-green px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-deep">
                  {p.tag}
                </span>
                <p className="mt-1.5 font-display text-base font-bold text-white">
                  {p.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Por que participar ----------------

const motivos = [
  {
    icon: Sparkles,
    title: "Conheça as propostas para Minas",
    text: "Veja em primeira mão o projeto para uma nova geração de lideranças.",
    accent: "from-brand-green/25 to-brand-green/0",
  },
  {
    icon: Handshake,
    title: "Faça parte da construção",
    text: "Sua voz e suas ideias entram no plano de pré-campanha.",
    accent: "from-brand-teal/40 to-brand-teal/0",
  },
  {
    icon: Users,
    title: "Conecte-se com lideranças",
    text: "Encontre apoiadores, jovens líderes e formadores de opinião.",
    accent: "from-brand-green/25 to-brand-green/0",
  },
  {
    icon: Vote,
    title: "Conheça a nova geração",
    text: "Esteja perto de quem está pronto para renovar a política mineira.",
    accent: "from-brand-teal/40 to-brand-teal/0",
  },
];

function PorQue() {
  return (
    <section className="relative overflow-hidden bg-brand-deep py-20 lg:py-28">
      <div
        className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-brand-green/10 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-brand-green">
            Por que participar?
          </p>
          <h2 className="mt-2 font-display text-4xl font-black text-white sm:text-5xl">
            Mais que um evento. O início de um movimento.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {motivos.map(({ icon: Icon, title, text, accent }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${accent} p-6 transition hover:-translate-y-1 hover:border-brand-green/40 hover:shadow-green-glow`}
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-green text-brand-deep shadow-green-glow">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Bandeiras ----------------

const bandeiras = [
  {
    icon: Briefcase,
    title: "Primeiro emprego",
    text: "Caminhos reais para o jovem entrar no mercado de trabalho.",
  },
  {
    icon: Rocket,
    title: "Empreendedorismo jovem",
    text: "Apoio a quem quer abrir e fazer crescer seu próprio negócio.",
  },
  {
    icon: GraduationCap,
    title: "Formação técnica",
    text: "Educação que prepara para as profissões do presente e do futuro.",
  },
  {
    icon: Home,
    title: "Habitação jovem",
    text: "Casa própria como ponto de partida para a vida adulta.",
  },
  {
    icon: Shield,
    title: "Segurança e liberdade",
    text: "Apoio às forças de segurança e defesa das liberdades individuais.",
  },
  {
    icon: TrendingUp,
    title: "Menos impostos, mais Minas",
    text: "Liberdade econômica para quem produz, emprega e empreende.",
  },
];

function Bandeiras() {
  return (
    <section className="relative overflow-hidden bg-brand-teal py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-brand-green">
            Principais bandeiras
          </p>
          <h2 className="mt-2 font-display text-4xl font-black text-white sm:text-5xl">
            Uma pauta feita para a juventude mineira
          </h2>
          <p className="mt-4 text-white/80">
            Oportunidades reais para quem está começando, gerando renda e
            construindo o futuro de Minas.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bandeiras.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl bg-brand-deep/70 p-7 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-brand-green/40"
            >
              <div
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-green/10 transition group-hover:scale-150"
                aria-hidden
              />
              <Icon className="relative h-9 w-9 text-brand-green" />
              <h3 className="relative mt-4 font-display text-lg font-bold text-white">
                {title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-white/75">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Evento ----------------

function Evento() {
  return (
    <section className="relative overflow-hidden bg-brand-deep pb-20 lg:pb-28">
      <div className="absolute inset-0 bg-grid-soft opacity-20" aria-hidden />
      <div
        className="absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-brand-green/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/40 bg-brand-green/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-brand-green backdrop-blur">
          <Calendar className="h-3.5 w-3.5" />
          Evento oficial
        </div>

        <h2 className="mt-6 font-display text-4xl font-black text-white sm:text-5xl lg:text-6xl">
          Lançamento da Pré-Candidatura
        </h2>
        <p className="mt-4 text-lg font-medium text-brand-green">
          Matheus Biancardine - Pré-candidato a Deputado Federal
        </p>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card Data */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10 transition-colors hover:bg-white/10">
            <Calendar className="mb-3 h-7 w-7 text-brand-green" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Data
            </p>
            <p className="mt-1 font-display text-lg font-black text-white">
              25 de Julho, 2026
            </p>
          </div>

          {/* Card Horário */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10 transition-colors hover:bg-white/10">
            <Clock className="mb-3 h-7 w-7 text-brand-green" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Horário
            </p>
            <p className="mt-1 font-display text-lg font-black text-white">
              14:00
            </p>
            <p className="text-xs text-white/60">Início</p>
          </div>

          {/* Card Local e Endereço */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10 transition-colors hover:bg-white/10 sm:col-span-2 lg:col-span-2">
            <MapPin className="mb-3 h-7 w-7 text-brand-green" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Local
            </p>
            <p className="mt-1 font-display text-lg font-black text-white">
              (Antigo) Cine Odeon
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Av. do Contorno, 1328 - Floresta
              <br />
              Belo Horizonte - MG, 38082-049
            </p>
          </div>
        </div>

        <a
          href="#cta-final"
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-brand-green px-8 py-4 text-base font-black uppercase tracking-wide text-brand-deep shadow-green-glow transition hover:bg-brand-green-hover hover:text-white"
        >
          Confirmar presença
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}

// ---------------- CTA final ----------------

function CtaFinal() {
  return (
    <section
      id="cta-final"
      className="relative overflow-hidden bg-brand-pattern py-20 lg:py-28"
    >
      <div className="absolute inset-0 bg-grid-soft opacity-30" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-brand-green">
            O momento é agora
          </p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
            Minas precisa de uma{" "}
            <span className="text-brand-green">nova geração</span> de líderes.
          </h2>
          <div className="mt-6 space-y-4 text-lg text-white/80">
            <p>
              O futuro não será construído por quem apenas reclama. Será
              construído por quem tem coragem de enfrentá-lo — e vontade de
              fazer o NOVO acontecer.
            </p>
            <p className="font-semibold text-white">
              Participe do lançamento e faça parte desta construção.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CheckCircle2 className="h-5 w-5 text-brand-green" /> Vagas
              limitadas
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CheckCircle2 className="h-5 w-5 text-brand-green" /> Convite
              oficial via WhatsApp
            </div>
          </div>
        </div>
        <div className="relative">
          <div
            className="absolute -inset-2 rounded-3xl bg-brand-green opacity-25 blur-xl"
            aria-hidden
          />
          <div className="relative rounded-3xl bg-brand-deep/85 p-8 ring-1 ring-white/15 shadow-elegant backdrop-blur-md sm:p-10">
            <h3 className="font-display text-2xl font-black text-white sm:text-3xl">
              Quero fazer parte
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Preencha e receba o convite oficial.
            </p>
            <div className="mt-6">
              <InscricaoForm idPrefix="final" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Footer ----------------

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-deep pb-8 pt-12 text-white">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-brand-green"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <p className="font-display text-xl font-bold text-white">
              Matheus Biancardine Mota
            </p>
            <p className="mt-1 text-sm text-white/60">
              Pré-candidato a Deputado Federal · MG
            </p>
          </div>

          <p className="max-w-md font-display text-base italic text-white/85">
            "Por uma Minas mais livre, próspera e cheia de oportunidades."
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="https://instagram.com/matheus.biancardinemg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/20 transition hover:bg-white/20"
            >
              <Instagram className="h-4 w-4" />
              @matheus.biancardinemg
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/20 transition hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        <hr className="my-10 border-white/10" />

        {/* Legal Info */}
        <div className="flex flex-col gap-6 text-xs text-white/60 sm:text-sm">
          <div className="flex items-start gap-4">
            <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
            <p className="leading-relaxed">
              <strong className="font-bold text-white uppercase">
                Informação Político-Institucional
              </strong>{" "}
              · Conteúdo informativo de pré-campanha eleitoral de{" "}
              <strong className="font-bold text-white">
                Matheus Biancardine Mota
              </strong>
              , pré-candidato a Deputado Federal pelo estado de Minas Gerais, em
              estrita conformidade com o{" "}
              <strong className="font-bold text-white">
                Artigo 36-A da Lei nº 9.504/1997
              </strong>
              . Este material não configura propaganda eleitoral antecipada,
              sendo vedado qualquer pedido explícito de voto.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
            <p className="leading-relaxed">
              <strong className="font-bold text-white uppercase">
                Privacidade e Dados (LGPD)
              </strong>{" "}
              · Ao fornecer seu nome e contato, você autoriza o recebimento de
              informações exclusivas sobre o evento de lançamento, prestação de
              contas, ideias e agendas do pré-candidato. Seus dados estão
              protegidos e não serão compartilhados com terceiros. Conteúdo
              produzido sob responsabilidade do titular.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 text-center text-xs text-white/40">
          <p>© 2026 Matheus Biancardine Mota · Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <main className="min-h-screen bg-brand-deep">
      <BannerPrincipal />
      <Hero />
      <Evento />
      <Countdown />
      <Quem />
      <Bandeiras />
      <CtaFinal />
      <Footer />
    </main>
  );
}
