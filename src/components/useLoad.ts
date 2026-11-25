import { useCallback, useEffect, useState } from "react";

export default function useLoad<T>(fn: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const reload = useCallback(() => {
        setLoading(true);
        fn().then((d) => { setData(d); setError(""); })
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(reload, [reload]);
    return { data, error, loading, reload };
}