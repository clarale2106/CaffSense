import { api } from "../api";
import { buildInsights, today } from "../lib";
import useLoad from "./useLoad";

export default function Insights() {
    const { data, error, loading } = useLoad(async () => {
        const [days, acts] = await Promise.all([api.summary(today(), 30), api.activities()]);
        return buildInsights(days, acts);
    });
    if (loading) return <p className="mut">Loading…</p>;
    if (error || !data) return <p className="err">Could not load insights: {error}</p>;
    return (
        <section className="card">
            <h2>Your observations (last 30 days)</h2>
            {data.map((t) => <div className="tip" key={t}>{t}</div>)}
            <div className="mut">These are simple pattern checks on your own records, not medical advice.</div>
        </section>
    );
}