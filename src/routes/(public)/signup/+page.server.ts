import { isString } from "$lib";
import type { ResponseSchema } from "$lib/response-schema";
import { auth } from "$lib/server/auth";
import { fail, isRedirect, redirect, type Actions } from "@sveltejs/kit";
import { APIError } from "better-auth/api";

export const actions = {
  default: async (event) => {
    const data = await event.request.formData()
    const user = {
      name: isString(data.get('name')) ? data.get('name')!.toString() : '',
      email: isString(data.get('email')) ? data.get('email')!.toString() : '',
      password: isString(data.get('password')) ? data.get('password')!.toString() : ''
    }
    const passwordConfirmation = isString(data.get('passwordConfirmation')) ? data.get('passwordConfirmation')!.toString() : ''

    if (!user.name.trim()) {
      return fail<ResponseSchema<typeof user, Partial<typeof user>>>(400, {
        status: "fail",
        code: 400,
        error: {
          message: "Validation error",
          details: {
            name: 'Name is required'
          },
          data: user
        }
      })
    }

    if (!user.email.trim()) {
      return fail<ResponseSchema<typeof user, Partial<typeof user>>>(400, {
        status: "fail",
        code: 400,
        error: {
          message: "Validation error",
          details: {
            email: 'Email is required'
          },
          data: user
        }
      })
    }

    if (user.password !== passwordConfirmation) {
      return fail<ResponseSchema<typeof user, Partial<typeof user>>>(400, {
        status: "fail",
        code: 400,
        error: {
          message: "Validation error",
          details: {
            password: 'Password and password confirmation is not match',
          },
          data: user
        }
      })
    }

    try {
      await auth.api.signUpEmail({
        body: user
      })
      redirect(303, '/')
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }
      if (error instanceof APIError) {
        console.log(error.message, error.status)
        console.log('error euy: ', error);

        return fail<ResponseSchema<typeof user, Partial<typeof user>>>(400, {
          status: 'fail',
          code: 400,
          error: {
            message: error.body?.code === 'USER_ALREADY_EXISTS' ? 'User already exist, try to Sign In instead' : 'Sign up failed, make sure to enter correct information and try again',
            details: {
              email: error.body?.code === 'INVALID_EMAIL' ? error.body.message : '',
              password: error.body?.code === 'PASSWORD_TOO_SHORT' ? error.body.message : '',
            },
            data: user
          }
        });
    }
    }
  }
} satisfies Actions