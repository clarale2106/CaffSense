import type { Activity, Caffeine, ChatMessage, Day, Sleep } from "./types";

const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const API_BASE = configuredApiUrl
    ? configuredApiUrl.endsWith("/api") ? configuredApiUrl : `${configuredApiUrl}/api`
    : "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(API_BASE + path, { headers: { "Content-Type": "application/json" }, ...init });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Request failed.");
    return data as T;
}
const post = (body: unknown): RequestInit => ({ method: "POST", body: JSON.stringify(body) });

export const api = {
    caffeine: (date: string) => request<Caffeine[]>(`/caffeine?date=${date}`),
    addCaffeine: (b: Omit<Caffeine, "id">) => request<Caffeine>("/caffeine", post(b)),
    deleteCaffeine: (id: number) => request<{ ok: true }>(`/caffeine/${id}`, { method: "DELETE" }),
    saveSleep: (b: Omit<Sleep, "duration">) => request<Sleep>("/sleep", post(b)),
    summary: (end: string, days = 7) => request<Day[]>(`/summary?end=${end}&days=${days}`),
    activities: () => request<Activity[]>("/activities"),
    addActivity: (b: Omit<Activity, "id">) => request<Activity>("/activities", post(b)),
    chat: (b: { message: string; history: ChatMessage[] }) =>
        request<{ reply: string }>("/chat", post(b)),
};
