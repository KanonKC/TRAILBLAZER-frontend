/** Build a backend event URL while keeping path segments and overlay keys encoded. */
export function buildEventUrl(path: string, userId: string, key?: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = new URL(`${baseUrl.replace(/\/$/, "")}${path}/${encodeURIComponent(userId)}`);
    if (key) url.searchParams.set("key", key);
    return url.toString();
}
