import { wait, waitFor } from "@testing-library/dom";

export interface UserData {
    id: number;
    userId: string;
    email: string;
    lastName: string;
    firstName: string;
}