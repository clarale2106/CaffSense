import type { Activity, Day } from "./types";

const p2 = (n: number) => String(n).padStart(2, "0");
export const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
};
export const dayLabel = (date: string) => {
    const [y, m, d] = date.split("-").map(Number);
    return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][new Date(y, m - 1, d).getDay()];
};
const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

export function buildInsights(days: Day[], activities: Activity[]): string[] {
    const out: string[] = [];
    const withSleep = days.filter((d) => d.sleep);

    const high = withSleep.filter((d) => d.caffeineMg >= 300);
    const low = withSleep.filter((d) => d.caffeineMg < 300);
    if (high.length && low.length) {
        const diff = (avg(low.map((d) => d.sleep!.duration)) - avg(high.map((d) => d.sleep!.duration))) / 60;
        out.push(
            diff > 0.2
                ? `On days with 300 mg or more of caffeine, you slept about ${diff.toFixed(1)} h less on average.`
                : "Your sleep length looks similar on high and low caffeine days so far."
        );
    }

    const late = withSleep.filter((d) => d.lateMg > 0);
    const early = withSleep.filter((d) => d.lateMg === 0);
    if (late.length && early.length) {
        const q1 = avg(late.map((d) => d.sleep!.quality));
        const q2 = avg(early.map((d) => d.sleep!.quality));
        out.push(
            q2 - q1 > 0.3
                ? `Sleep quality averaged ${q1.toFixed(1)} after caffeine at 3 pm or later, versus ${q2.toFixed(1)} without it.`
                : "Afternoon caffeine does not show a clear link to your sleep quality yet."
        );
    }

    const names = [...new Set(activities.map((a) => a.name))];
    const best = names
        .map((n) => {
            const l = activities.filter((a) => a.name === n);
            return { n, gain: avg(l.map((a) => a.energyAfter - a.energyBefore)) };
        })
        .sort((a, b) => b.gain - a.gain)[0];
    if (best && best.gain > 0) out.push(`${best.n} gives you the biggest energy boost so far (+${best.gain.toFixed(1)}).`);

    if (!out.length) out.push("Log a few days of caffeine and sleep to see observations here.");
    return out;
}