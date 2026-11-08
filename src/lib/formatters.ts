const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

export function formatRupiah(amount: number): string {
  if (!Number.isFinite(amount)) return "Rp0";
  return `Rp${rupiahFormatter.format(Math.trunc(amount))}`;
}

const wibDateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatDateTimeWib(value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "";

  const parts = Object.fromEntries(
    wibDateTimeFormatter.formatToParts(date).map(({ type, value: part }) => [type, part]),
  );
  return `${parts["day"]}/${parts["month"]}/${parts["year"]} ${parts["hour"]}:${parts["minute"]} WIB`;
}

const smallNumbers = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
  "sebelas",
];

function terbilangUnderThousand(value: number): string {
  if (value === 0) return "";
  if (value < 12) return smallNumbers[value] ?? "";
  if (value < 20) return `${terbilangUnderThousand(value - 10)} belas`;
  if (value < 100) {
    const tens = Math.floor(value / 10);
    const remainder = value % 10;
    return `${smallNumbers[tens]} puluh${remainder ? ` ${terbilangUnderThousand(remainder)}` : ""}`;
  }
  if (value < 200) return `seratus${value > 100 ? ` ${terbilangUnderThousand(value - 100)}` : ""}`;
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  return `${smallNumbers[hundreds]} ratus${remainder ? ` ${terbilangUnderThousand(remainder)}` : ""}`;
}

export function terbilang(value: number): string {
  if (!Number.isFinite(value)) return "nol";
  const integer = Math.trunc(value);
  if (integer === 0) return "nol";
  if (integer < 0) return `minus ${terbilang(Math.abs(integer))}`;

  const scales = ["", "ribu", "juta", "miliar", "triliun"];
  const groups: string[] = [];
  let remaining = integer;
  let scaleIndex = 0;

  while (remaining > 0 && scaleIndex < scales.length) {
    const group = remaining % 1000;
    if (group > 0) {
      const words = scaleIndex === 1 && group === 1 ? "seribu" : terbilangUnderThousand(group);
      groups.unshift([words, scales[scaleIndex]].filter(Boolean).join(" "));
    }
    remaining = Math.floor(remaining / 1000);
    scaleIndex += 1;
  }

  if (remaining > 0) return "nilai terlalu besar";
  return groups.join(" ");
}

export function apiError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return "Terjadi kesalahan. Silakan coba lagi.";
}