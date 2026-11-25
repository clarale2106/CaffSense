import { api } from "../api";
import { dayLabel, today } from "../lib";
import BarChart from "./BarChart";
import useLoad from "./useLoad";

const LIMIT = 400;

export default function Home() {
    const { data: days, error, loading } = useLoad(() => api.summary(today(), 7));
    if (loading) return <p className="mut">Loading…</p>;
    if (error || !days) return <p className="err">Could not load data: {error}. Is the server running on port 3001?</p>;

    const t = days[days.length - 1];
    const circ = 2 * Math.PI * 52;
    const pct = Math.min(t.caffeineMg / LIMIT, 1);
    const labels = days.map((d) => dayLabel(d.date));
    const caf = days.map((d) => d.caffeineMg);
    const sleep = days.map((d) => (d.sleep ? +(d.sleep.duration / 60).toFixed(1) : 0));

    return (
        <>
            <section className="card">
                <h2>Today’s caffeine</h2>
                <div className="row">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--soft)" strokeWidth="12" />
                        <circle cx="60" cy="60" r="52" fill="none" strokeWidth="12" strokeLinecap="round"
                            stroke={t.caffeineMg > LIMIT ? "var(--warn)" : "var(--pri2)"}
                            strokeDasharray={`${circ * pct} ${circ}`} transform="rotate(-90 60 60)" />
                    </svg>
                    <div>
                        <div className="big">{t.caffeineMg} mg</div>
                        <div className="mut">of a {LIMIT} mg daily guideline for most adults</div>
                    </div>
                </div>
            </section>

            <section className="card">
                <h2>Last night’s sleep</h2>
                {t.sleep ? (
                    <>
                        <div className="big">{Math.floor(t.sleep.duration / 60)}h {t.sleep.duration % 60}m</div>
                        <div className="mut">Quality {t.sleep.quality}/5 · Mood {t.sleep.mood}/5 · Energy {t.sleep.energy}/5</div>
                    </>
                ) : (
                    <div className="mut">No sleep logged for today yet. Add it in the Log tab.</div>
                )}
            </section>

            <section className="card">
                <h2>Caffeine, last 7 days (mg)</h2>
                <BarChart values={caf} labels={labels} max={Math.max(100, ...caf)} color="var(--pri2)" />
            </section>
            <section className="card">
                <h2>Sleep, last 7 days (hours)</h2>
                <BarChart values={sleep} labels={labels} max={Math.max(8, ...sleep)} color="#6366f1" />
            </section>
        </>
    );
}