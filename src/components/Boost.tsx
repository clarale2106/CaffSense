import { useState, type FormEvent } from "react";
import { api } from "../api";
import useLoad from "./useLoad";

const ACTIVITIES = [["🚶", "Short walk"], ["🤸", "Stretching"], ["💧", "Hydration"], ["😌", "Rest break"]];
const scale = [1, 2, 3, 4, 5];

export default function Boost() {
    const [name, setName] = useState("Short walk");
    const [before, setBefore] = useState(3);
    const [after, setAfter] = useState(3);
    const [error, setError] = useState("");
    const { data: list, reload } = useLoad(api.activities);

    async function submit(e: FormEvent) {
        e.preventDefault();
        try { await api.addActivity({ name, energyBefore: before, energyAfter: after }); setError(""); reload(); }
        catch (err) { setError((err as Error).message); }
    }

    return (
        <>
            <div className="grid">
                {ACTIVITIES.map(([icon, n]) => <div className="act" key={n}><b>{icon}</b>{n}</div>)}
            </div>
            <form className="card" onSubmit={submit}>
                <h2>Try an alternative to caffeine</h2>
                <label>Activity</label>
                <select value={name} onChange={(e) => setName(e.target.value)}>
                    {ACTIVITIES.map(([, n]) => <option key={n}>{n}</option>)}
                </select>
                <div className="row">
                    <div style={{ flex: 1 }}><label>Energy before</label>
                        <select value={before} onChange={(e) => setBefore(Number(e.target.value))}>{scale.map((n) => <option key={n}>{n}</option>)}</select></div>
                    <div style={{ flex: 1 }}><label>Energy after</label>
                        <select value={after} onChange={(e) => setAfter(Number(e.target.value))}>{scale.map((n) => <option key={n}>{n}</option>)}</select></div>
                </div>
                <div className="err">{error}</div>
                <button className="btn">Save result</button>
            </form>
            <section className="card">
                <h2>What seems to help you</h2>
                {ACTIVITIES.map(([icon, n]) => {
                    const l = (list ?? []).filter((a) => a.name === n);
                    const gain = l.length ? l.reduce((s, a) => s + a.energyAfter - a.energyBefore, 0) / l.length : 0;
                    return (
                        <div className="item" key={n}>
                            <span>{icon} {n}</span>
                            <span className="mut">{l.length ? `avg ${gain >= 0 ? "+" : ""}${gain.toFixed(1)} energy (${l.length})` : "no data"}</span>
                        </div>
                    );
                })}
            </section>
        </>
    );
}
