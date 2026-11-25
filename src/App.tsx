
import { useState } from "react";
import Home from "./components/Home";
import Log from "./components/Log";
import Boost from "./components/Boost";
import Insights from "./components/Insights";
import Chat from "./components/Chat";

const TABS = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "log", icon: "➕", label: "Log" },
    { id: "boost", icon: "⚡", label: "Boost" },
    { id: "insights", icon: "💡", label: "Insights" },
    { id: "chat", icon: "💬", label: "Chat" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function App() {
    const [tab, setTab] = useState<TabId>("home");
    const activeIndex = TABS.findIndex(t => t.id === tab);

    return (
        <div className="app">
            <header>
                <h1>☕ CaffSense</h1>
                <p>Small habits, better days.</p>
            </header>

            <main key={tab}>
                <div className="page-transition">
                    {tab === "home" && <Home />}
                    {tab === "log" && <Log />}
                    {tab === "boost" && <Boost />}
                    {tab === "insights" && <Insights />}
                    {tab === "chat" && <Chat />}
                </div>
            </main>

            <nav aria-label="Main navigation">
                <div
                    className="nav-indicator"
                    style={{
                        transform: `translateX(${activeIndex * 100}%)`
                    }}
                />

                {TABS.map((t) => (
                    <button
                        key={t.id}
                        className={tab === t.id ? "on" : ""}
                        aria-current={tab === t.id ? "page" : undefined}
                        onClick={() => setTab(t.id)}
                    >
                        <span>{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
