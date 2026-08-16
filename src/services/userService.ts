import { http, patchJson } from '@/lib/httpClient';
import { User } from '@/types/flashcards';

export const userService = {
    update: (
        data: { email?: string, password?: string },
    ) => http<User>(`/users`, patchJson(data)),
    changePassword: (
        data: { currentPassword: string, newPassword: string },
    ) => http<User>(`/users/password/update`, patchJson(data)),
};
