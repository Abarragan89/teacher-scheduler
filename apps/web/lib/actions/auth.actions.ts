"use server";
import { z } from "zod";
import { FormState, LoginFormSchema, SignupFormSchema } from "../types";
import { BACKEND_URL } from "../constants";
import { redirect } from "next/navigation";
import { createSession } from "./session";

export async function signUp(
    state: FormState,
    formData: FormData
): Promise<FormState> {

    // Validate the user data
    const validationFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    })

    // Handle any errors with data input
    if (!validationFields.success) {
        const tree = z.treeifyError(validationFields.error)
        return {
            error: {
                name: tree.properties?.name?.errors ?? [],
                email: tree.properties?.email?.errors ?? [],
                password: tree.properties?.password?.errors ?? [],
            },
        };
    }

    // Send the response to Nest.js
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validationFields.data)
    });

    if (response.ok) {
        redirect('/auth/signin')
    } else {
        return {
            message: response.status === 409 ? '' : response.statusText
        }
    }
}

export async function signIn(
    state: FormState,
    formData: FormData
): Promise<FormState> {

    // Validate user input
    const validationFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })

    // Handle any errors with data input
    if (!validationFields.success) {
        const tree = z.treeifyError(validationFields.error)
        return {
            error: {
                email: tree.properties?.email?.errors ?? [],
                password: tree.properties?.password?.errors ?? [],
            },
        };
    }

    // Send request to backend
    const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validationFields.data)
    })

    // If request successfully passed Guards, Local strategy, etc, then return
    if (response.ok) {
        const result = await response.json();

        // Create The Session for Authenticated User (saves it in http only cookie)
        await createSession({
            user: {
                id: result.id,
                name: result.name
            }
        })
        redirect('/');
    } else {
        return {
            message: response.status === 401 ? 'Invalid Credentials' : response.statusText
        }
    }

}