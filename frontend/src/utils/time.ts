export const calcTimeSinceMillis = (millisThen: number, millisNow: number): string => {
    const SEC = 1e3;
    const MIN = SEC * 60;
    const HOUR = MIN * 60;
    const DAY = HOUR * 24;

    const millis = millisNow - millisThen;

    const d = millis / DAY | 0;
    const h = millis % DAY / HOUR | 0;
    const m = millis % HOUR / MIN | 0;
    const s = millis % MIN / SEC | 0;

    if (d >= 1)
        return d + "d";
    if (h >= 1)
        return h + "h";
    if (m >= 1)
        return m + "m";
    if (s >= 1)
        return s + "s";
    return "1s"
}
