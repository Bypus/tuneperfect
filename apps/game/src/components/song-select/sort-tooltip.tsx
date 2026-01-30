import { createMemo, Show } from "solid-js";
import type { SortOption } from "~/components/song-select/song-scroller";
import { t } from "~/lib/i18n";
import type { LocalSong } from "~/lib/ultrastar/song";
import IconCircleFlagsBr from "~icons/circle-flags/br";
import IconCircleFlagsCn from "~icons/circle-flags/cn";
import IconCircleFlagsDe from "~icons/circle-flags/de";
import IconCircleFlagsDk from "~icons/circle-flags/dk";
import IconCircleFlagsEs from "~icons/circle-flags/es";
import IconCircleFlagsFi from "~icons/circle-flags/fi";
import IconCircleFlagsFr from "~icons/circle-flags/fr";
import IconCircleFlagsGb from "~icons/circle-flags/gb";
import IconCircleFlagsIt from "~icons/circle-flags/it";
import IconCircleFlagsJp from "~icons/circle-flags/jp";
import IconCircleFlagsKr from "~icons/circle-flags/kr";
import IconCircleFlagsNl from "~icons/circle-flags/nl";
import IconCircleFlagsNo from "~icons/circle-flags/no";
import IconCircleFlagsPl from "~icons/circle-flags/pl";
import IconCircleFlagsPt from "~icons/circle-flags/pt";
import IconCircleFlagsRu from "~icons/circle-flags/ru";
import IconCircleFlagsSe from "~icons/circle-flags/se";

interface SortTooltipProps {
  sort: SortOption;
  visibleSongs: LocalSong[];
}

const flagComponents = {
  gb: IconCircleFlagsGb,
  fr: IconCircleFlagsFr,
  de: IconCircleFlagsDe,
  es: IconCircleFlagsEs,
  it: IconCircleFlagsIt,
  pt: IconCircleFlagsPt,
  br: IconCircleFlagsBr,
  nl: IconCircleFlagsNl,
  pl: IconCircleFlagsPl,
  se: IconCircleFlagsSe,
  no: IconCircleFlagsNo,
  dk: IconCircleFlagsDk,
  fi: IconCircleFlagsFi,
  ru: IconCircleFlagsRu,
  jp: IconCircleFlagsJp,
  kr: IconCircleFlagsKr,
  cn: IconCircleFlagsCn,
};

type FlagCode = keyof typeof flagComponents;

const languageToFlagCode = (language: string): FlagCode | undefined => {
  const normalized = language.trim().toLowerCase();
  const mappings: Record<string, FlagCode> = {
    en: "gb",
    english: "gb",
    fr: "fr",
    french: "fr",
    de: "de",
    german: "de",
    es: "es",
    spanish: "es",
    it: "it",
    italian: "it",
    pt: "pt",
    portuguese: "pt",
    ptbr: "br",
    "pt-br": "br",
    portuguese_brazil: "br",
    nl: "nl",
    dutch: "nl",
    pl: "pl",
    polish: "pl",
    sv: "se",
    swedish: "se",
    no: "no",
    norwegian: "no",
    da: "dk",
    danish: "dk",
    fi: "fi",
    finnish: "fi",
    ru: "ru",
    russian: "ru",
    jp: "jp",
    ja: "jp",
    japanese: "jp",
    ko: "kr",
    korean: "kr",
    zh: "cn",
    chinese: "cn",
  };

  if (mappings[normalized]) {
    return mappings[normalized];
  }

  if (normalized.includes("-") || normalized.includes("_")) {
    const parts = normalized.split(/[-_]/g);
    if (parts.length > 1 && parts[0] === "pt" && parts[1] === "br") return "br";
    if (parts.length > 0 && parts[0]) return parts[0] as FlagCode;
  }

  if (/^[a-z]{2}$/.test(normalized)) {
    return normalized as FlagCode;
  }

  return undefined;
};

export function SortTooltip(props: SortTooltipProps) {
  const visibleSortInfo = createMemo(() => {
    const values = new Set<string>();

    for (const song of props.visibleSongs) {
      if (props.sort === "artist") {
        const initial = song.artist?.trim()[0];
        if (initial) values.add(initial.toUpperCase());
      } else if (props.sort === "title") {
        const initial = song.title?.trim()[0];
        if (initial) values.add(initial.toUpperCase());
      } else if (props.sort === "year") {
        if (song.year !== null && song.year !== undefined) {
          values.add(String(song.year));
        }
      } else if (props.sort === "language") {
        const languages = song.language ?? [];
        for (const language of languages) {
          if (!language) continue;
          const code = languageToFlagCode(language);
          if (code && flagComponents[code]) {
            values.add(code);
          }
        }
      }
    }

    const sorted = [...values].sort((a, b) =>
      props.sort === "year" ? Number(a) - Number(b) : a.localeCompare(b),
    );

    const maxItems = 4;
    const visible = sorted.slice(0, maxItems);
    const remaining = sorted.length - visible.length;

    if (props.sort === "language") {
      if (visible.length === 0) return "—";
      const flags = visible
        .map((code) => {
          const Flag = flagComponents[code as FlagCode];
          return Flag ? <Flag class="h-7 w-7" /> : null;
        })
        .filter(Boolean);
      return (
        <span class="inline-flex items-center gap-2">
          {flags}
          <Show when={remaining > 0}>
            <span class="ml-1">+{remaining}</span>
          </Show>
        </span>
      );
    }

    const summary = visible.join(", ");
    return summary ? (remaining > 0 ? `${summary} +${remaining}` : summary) : "—";
  });

  return (
    <div class="pointer-events-none absolute top-50 right-0">
      <div class="rounded-xl bg-black/50 px-6 py-4 text-white shadow-xl backdrop-blur-md">
        <span class="font-semibold text-xs uppercase tracking-wide opacity-80">{t(`sing.sort.${props.sort}`)}</span>
        <span class="mt-1 block font-semibold text-lg">{visibleSortInfo()}</span>
      </div>
    </div>
  );
}
