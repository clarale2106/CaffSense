import { useState, type FormEvent } from "react";
import { api } from "../api";
import { today } from "../lib";
import useLoad from "./useLoad";

const DRINKS: [string, number][] = [["Coffee", 95], ["Espresso", 63], ["Energy drink", 160], ["Tea", 47], ["Cola", 34]];
const nowHM = () => new Date().toTimeString().slice(0, 5);
const scale = [1, 2, 3, 4, 5];

function CaffeineForm() {
    const [drink, setDrink] = useState("Coffee");
    const [mg, setMg] = useState("95");
    const [time, setTime] = useState(nowHM());
    const [error, setError] = useState("");
    const { data: entries, reload } = useLoad(() => api.caffeine(today()));

    async function submit(e: FormEvent) {
        e.preventDefault();
        try {
            await api.addCaffeine({ date: today(), drink, mg: Number(mg), time });
            setError("");
            reload();
        } catch (err) { setError((err as Error).message); }
    }

    return (
        <>
            <form className="card" onSubmit={submit}>
                <h2>Add a drink</h2>
                <label>Drink</label>
                <select value={drink} onChange={(e) => {
                    setDrink(e.target.value);
                    const d = DRINKS.find(([n]) => n === e.target.value);
                    if (d) setMg(String(d[1]));
                }}>
                    {DRINKS.map(([n, v]) => <option key={n} value={n}>{n} ({v})</option>)}
                </select>
                <label>Caffeine (mg)</label>
                <input type="number" value={mg} onChange={(e) => setMg(e.target.value)} />
                <label>Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                <div className="err">{error}</div>
                <button className="btn">Save drink</button>
            </form>
            <section className="card">
                <h2>Today’s entries</h2>
                {entries?.length ? entries.map((c) => (
                    <div className="item" key={c.id}>
                        <span>{c.drink} · {c.mg} mg <span className="mut">{c.time}</span></span>
                        <button className="x" aria-label="Delete entry" onClick={() => api.deleteCaffeine(c.id).then(reload)}>✕</button>
                    </div>
                )) : <div className="mut">Nothing logged today. Add your first drink above.</div>}
            </section>
        </>
    );
}

function SleepForm() {
    const [f, setF] = useState({ date: today(), bed: "23:30", wake: "07:00", quality: 3, mood: 3, energy: 3 });
    const [msg, setMsg] = useState("");
    const [ok, setOk] = useState(false);
    const set = (k: string, v: string | number) => setF({ ...f, [k]: v });

    async function submit(e: FormEvent) {
        e.preventDefault();
        try { await api.saveSleep(f); setOk(true); setMsg("Saved. Check the Home tab."); }
        catch (err) { setOk(false); setMsg((err as Error).message); }
    }
    const pick = (k: "quality" | "mood" | "energy", label: string) => (
        <div style={{ flex: 1 }}>
            <label>{label}</label>
            <select value={f[k]} onChange={(e) => set(k, Number(e.target.value))}>
                {scale.map((n) => <option key={n}>{n}</option>)}
            </select>
        </div>
    );

    return (
        <form className="card" onSubmit={submit}>
            <h2>Log sleep, mood and energy</h2>
            <label>Date</label>
            <input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
            <div className="row">
                <div style={{ flex: 1 }}><label>Bedtime</label><input type="time" value={f.bed} onChange={(e) => set("bed", e.target.value)} /></div>
                <div style={{ flex: 1 }}><label>Wake-up</label><input type="time" value={f.wake} onChange={(e) => set("wake", e.target.value)} /></div>
            </div>
            <div className="row">{pick("quality", "Sleep quality")}{pick("mood", "Mood")}{pick("energy", "Energy")}</div>
            <div className={ok ? "okmsg" : "err"}>{msg}</div>
            <button className="btn">Save sleep</button>
        </form>
    );
}

export default function Log() {
    const [seg, setSeg] = useState<"caf" | "sleep">("caf");
    return (
        <>
            <div className="seg">
                <button className={seg === "caf" ? "on" : ""} onClick={() => setSeg("caf")}>Caffeine</button>
                <button className={seg === "sleep" ? "on" : ""} onClick={() => setSeg("sleep")}>Sleep and mood</button>
            </div>
            {seg === "caf" ? <CaffeineForm /> : <SleepForm />}
        </>
    );
}
