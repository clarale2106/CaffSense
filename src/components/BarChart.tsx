interface Props { values: number[]; labels: string[]; max: number; color: string }

export default function BarChart({ values, labels, max, color }: Props) {
    const h = 110, bw = 26, gap = (320 - bw * values.length) / (values.length + 1);
    return (
        <svg viewBox="0 0 320 130" width="100%" role="img" aria-label="Bar chart">
            {values.map((v, i) => {
                const bh = max ? Math.round((v / max) * h) : 0;
                const x = gap + i * (bw + gap);
                return (
                    <g key={i}>
                        <rect x={x} y={h - bh} width={bw} height={Math.max(bh, 2)} rx={6} fill={color} />
                        <text x={x + bw / 2} y={125} textAnchor="middle">{labels[i]}</text>
                    </g>
                );
            })}
        </svg>
    );
}