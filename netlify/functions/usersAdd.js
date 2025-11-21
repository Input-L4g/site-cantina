import {
    createUser
} from "../../src/utils/user_crud.js"

import {
    createHTTPResponse
} from "../../public/js/utils.js";

export async function handler(event, context) {
    try {
        if (event.method !== "POST") {
            return createHTTPResponse(
                405, {
                    error:"O método usado é inválido. Só é aceito método POST."
                }
            );
        }
        console.log(event.body);
        const { 
            name, 
            email, 
            phoneNumber,
            password, 
            confirmPassword 
        } = JSON.parse(event.body);
        if (password !== confirmPassword) {
            return createHTTPResponse(
                422, {
                    message: "As senhas não se conferem."
                }
            );
        }
        const hasCreated = createUser(email, name, phoneNumber, password);
        if (hasCreated) {
            return createHTTPResponse(
                200, {
                    message: "Conta criada com sucesso."
                }
            )
        }
    } catch (err) {
        return createHTTPResponse(
            500, {
                message: "Algo deu errado."
            }
        )
    }
}
