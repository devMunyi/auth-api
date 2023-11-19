import { object, string, TypeOf } from "zod";

export const CreateUserSchema = object({
    body: object({
        firstName: string({
            required_error: "Firstname is required"
        }).trim(),
        lastName: string({
            required_error: "Lastname is required"
        }).trim(),
        password: string({
            required_error: "Password is required"
        }).trim().min(6, "Password is too short - should be min 6 chars"),
        passwordConfirmation: string({
            required_error: "Password confirmation is required"
        }).trim(),
        email: string({
            required_error: "Email is required"
        }).trim().email("Email not valid")
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]
    })
})

export type CreateUserInput = TypeOf<typeof CreateUserSchema>['body'];