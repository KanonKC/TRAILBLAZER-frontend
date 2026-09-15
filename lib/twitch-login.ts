import crypto from "crypto";

export const CONSENT_COOKIE_NAME = "trailblazer_consent_accepted";

// Bump this (and the matching CONSENT_VERSION in TRAILBLAZER-backend's
// user.service.ts) whenever the consent terms change — it invalidates every
// existing acceptance cookie/record so users are asked to accept again.
export const CONSENT_VERSION = "2026-09-14";

export function getCookie(name: string): string | null {
	if (typeof document === "undefined") return null;
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
	return null;
}

export function setCookie(name: string, value: string, days: number) {
	const expires = new Date();
	expires.setDate(expires.getDate() + days);
	document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export function hasAcceptedConsent(): boolean {
	return getCookie(CONSENT_COOKIE_NAME) === CONSENT_VERSION;
}

export function acceptConsent() {
	setCookie(CONSENT_COOKIE_NAME, CONSENT_VERSION, 365);
}

export function redirectToTwitchLogin() {
	const LOGIN_URL = process.env.NEXT_PUBLIC_TWITCH_LOGIN_URL;

	if (!LOGIN_URL) {
		console.error("LOGIN_URL is not defined");
		return;
	}

	const ref = getCookie("blaze_ref");
	const nonce = crypto.randomBytes(16).toString("hex");
	const state = ref ? `${nonce}:${ref}` : nonce;

	window.location.href = LOGIN_URL + "&state=" + state;
}
