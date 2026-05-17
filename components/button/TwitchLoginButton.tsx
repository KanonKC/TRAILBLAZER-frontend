"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Twitch } from "@/components/icons/twitch"
import { cn } from "@/lib/utils"
import crypto from "crypto"

interface TwitchLoginButtonProps extends React.ComponentProps<typeof Button> {
  children?: React.ReactNode
}

export function TwitchLoginButton({ className, children, ...props }: TwitchLoginButtonProps) {
  const LOGIN_URL = process.env.NEXT_PUBLIC_TWITCH_LOGIN_URL

  const handleClick = () => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const ref = getCookie("blaze_ref");
    const nonce = crypto.randomBytes(16).toString("hex");
    const state = ref ? `${nonce}:${ref}` : nonce;

    if (LOGIN_URL) {
      window.location.href = LOGIN_URL + "&state=" + state
    } else {
      console.error("LOGIN_URL is not defined")
    }
  }

  return (
    <Button asChild variant="twitch" className={cn(className)} {...props}>
      <a onClick={handleClick} className="flex items-center justify-center">
        <Twitch className="mr-2 h-4 w-4" />
        {children || "Login with Twitch"}
      </a>
    </Button>
  )
}
