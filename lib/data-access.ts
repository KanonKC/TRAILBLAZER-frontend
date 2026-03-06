import { cookies } from "next/headers";

export async function fetchData<T>(url: string): Promise<T | null> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${baseUrl}${url}`, {
        headers: {
            Cookie: cookieHeader,
        },
        cache: "no-store",
    });

    console.log("res", res)
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data as T;
}