export interface Caffeine { id: number; date: string; drink: string; mg: number; time: string }
export interface Sleep {
    date: string; bed: string; wake: string; duration: number;
    quality: number; mood: number; energy: number;
}
export interface Activity { id: number; name: string; energyBefore: number; energyAfter: number }
export interface Day { date: string; caffeineMg: number; lateMg: number; sleep: Sleep | null }
export interface ChatMessage { role: "user" | "model"; text: string }
