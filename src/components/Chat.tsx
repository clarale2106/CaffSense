import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "../api";
import type { ChatMessage } from "../types";

const WELCOME: ChatMessage = {
    role: "model",
    text: "Hi! I can help you make sense of your caffeine, sleep, mood, and energy patterns—or answer a general question. What’s on your mind?",
};

export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function submit(e: FormEvent) {
        e.preventDefault();
        const message = input.trim();
        if (!message || loading) return;

        const history = messages.filter((item) => item !== WELCOME);
        setMessages((current) => [...current, { role: "user", text: message }]);
        setInput("");
        setError("");
        setLoading(true);
        try {
            const result = await api.chat({ message, history });
            setMessages((current) => [...current, { role: "model", text: result.reply }]);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="chat card">
            <div className="chat-intro">
                <h2>Chat with CaffSense</h2>
                <div className="mut">Your saved app data is shared with Gemini to answer relevant questions. Chat history clears when you refresh.</div>
            </div>
            <div className="chat-messages" aria-live="polite">
                {messages.map((message, index) => (
                    <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                        {message.text}
                    </div>
                ))}
                {loading && <div className="chat-message model mut">Thinking…</div>}
                <div ref={endRef} />
            </div>
            <form className="chat-form" onSubmit={submit}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your patterns…"
                    rows={2}
                    maxLength={4000}
                    disabled={loading}
                    aria-label="Chat message"
                />
                <button className="btn" disabled={loading || !input.trim()}>Send</button>
            </form>
            <div className="err">{error}</div>
        </section>
    );
}
