'use server'

import { signIn } from "@/app/auth"

export async function signInActions() {
    await signIn('google', {redirectTo:'/'})
}