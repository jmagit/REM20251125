import { test as setup, expect, Dialog, PlaywrightTestArgs } from '@playwright/test';
import path from 'path';
import usuarios from '../playwright/.auth/usuarios.json';

const auth = (index: number) => async ({ page }: PlaywrightTestArgs) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Usuario' }).fill(usuarios[index].idUsuario);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(usuarios[index].password);
    page.once('dialog', (dialog: Dialog) => {
        dialog.dismiss();
        expect(dialog.message()).toBeFalsy();
    });
    await page.getByRole('button', { name: 'enviar login' }).click();
    await page.getByRole('textbox', { name: 'Usuario' }).focus();
    await expect(page.locator('#userData')).toContainText(`Hola ${usuarios[index].nombre}`);
    await expect(page.getByRole('button', { name: 'enviar logout' })).toBeVisible();
    await page.context().storageState({ path: path.join(__dirname, `../playwright/.auth/${usuarios[index].filesufix}-storage-state.json`) });
};

const authApi = (index: number) => async ({ request }: PlaywrightTestArgs) => {
    const response = await request.post('/api/login?cookie=true', {
        headers: { "content-type": "application/json" },
        data: { username: usuarios[index].idUsuario, password: usuarios[index].password }
    })
    expect(response.ok()).toBeTruthy()
    await request.storageState({ path: path.join(__dirname, `../playwright/.auth/${usuarios[index].filesufix}-api-storage-state.json`) });
};

setup('admin storage authenticate state', auth(1));
setup('usr storage authenticate state', auth(1));
setup('emp storage authenticate state', auth(3));
setup('test storage authenticate state', auth(4));
setup('user storage authenticate state', authApi(2));
