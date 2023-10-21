import { authAxios, axi } from "./userAxios";

export const get_users = async () => {
    const response = await authAxios.get("/users/get/")
    return response.data
};

export const registerRequest = async (email: string, name: string, last_name: string, password: string) => {
    await axi.post("/users/register/", { email, name, last_name, password })
};

export const loginRequest = async (email: string, password: string) => {
    const response = await axi.post("/users/login/", { email, password })
    return response;
};

export const delete_user = async (id: number) => {
    await authAxios.delete(`/users/delete/${id}/`)
};