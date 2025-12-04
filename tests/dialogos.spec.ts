import { test, expect } from '@playwright/test';
import path from 'path';
import { acceptDialog, Dialog, dismissDialog, promptDialog } from '../utils/helpers';

test.describe('cuadros de dialogo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/alertas');
  });

  test('once', async ({ page }) => {
    await test.step('paso 1: alert', async () => {
      page.once('dialog', dialog => {
        expect(dialog.message(), 'Expect valida el contenido del alert').toBe('Esta es una alerta')
        dialog.accept();
      });
      await page.getByRole('button', { name: 'Alerta' }).click();
      await expect(page.getByText('Se ha cerrado la alerta×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 2: confirm - aceptar', async () => {
      page.once('dialog', dialog => {
        expect(dialog.message(), 'Expect valida la pregunta del confirm').toBe('¿Estas seguro?')
        dialog.accept();
      });
      await page.getByRole('button', { name: 'Confirmación' }).click();
      await expect(page.getByText('Respuesta positiva')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 3: confirm - cancelar', async () => {
      page.once('dialog', dialog => {
        expect(dialog.message(), 'Expect valida la pregunta del confirm').toBe('¿Estas seguro?')
        dialog.dismiss();
      });
      await page.getByRole('button', { name: 'Confirmación' }).click();
      await expect(page.getByText('Respuesta negativa×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 4: prompt - aceptar', async () => {
      page.once('dialog', dialog => {
        expect(dialog.message(), 'Expect valida el texto del prompt').toBe('Dime algo:')
        dialog.accept('algo');
      });
      await page.getByRole('button', { name: 'Petición' }).click();
      await expect(page.getByText('Has dicho: algo×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 5: prompt - cancelar', async () => {
      page.once('dialog', dialog => {
        expect(dialog.message(), 'Expect valida el texto del prompt').toBe('Dime algo:')
        dialog.dismiss();
      });
      await page.getByRole('button', { name: 'Petición' }).click();
      await expect(page.getByText('Has cancelado×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
  });

  test('comandos', async ({ page }) => {
    await test.step('paso 1: alert', async () => {
      acceptDialog(page, 'Esta es una alerta')
      await page.getByRole('button', { name: 'Alerta' }).click();
      await expect(page.getByText('Se ha cerrado la alerta×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 2: confirm - aceptar', async () => {
      acceptDialog(page, '¿Estas seguro?')
      await page.getByRole('button', { name: 'Confirmación' }).click();
      await expect(page.getByText('Respuesta positiva')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 3: confirm - cancelar', async () => {
      dismissDialog(page, '¿Estas seguro?')
      await page.getByRole('button', { name: 'Confirmación' }).click();
      await expect(page.getByText('Respuesta negativa×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 4: prompt - aceptar', async () => {
      promptDialog(page, 'algo', 'Dime algo:')
      await page.getByRole('button', { name: 'Petición' }).click();
      await expect(page.getByText('Has dicho: algo×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 5: prompt - cancelar', async () => {
      dismissDialog(page, 'Dime algo:')
      await page.getByRole('button', { name: 'Petición' }).click();
      await expect(page.getByText('Has cancelado×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
  });

  test('asistentes', async ({ page }) => {
    await test.step('paso 1: alert', async () => {
      Dialog.accept(page, 'Esta es una alerta')
      await page.getByRole('button', { name: 'Alerta' }).click();
      await expect(page.getByText('Se ha cerrado la alerta×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 2: confirm - aceptar', async () => {
      Dialog.accept(page, '¿Estas seguro?')
      await page.getByRole('button', { name: 'Confirmación' }).click();
      await expect(page.getByText('Respuesta positiva')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 3: confirm - cancelar', async () => {
      Dialog.dismiss(page, '¿Estas seguro?')
      await page.getByRole('button', { name: 'Confirmación' }).click();
      await expect(page.getByText('Respuesta negativa×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 4: prompt - aceptar', async () => {
      Dialog.prompt(page, 'algo', 'Dime algo:')
      await page.getByRole('button', { name: 'Petición' }).click();
      await expect(page.getByText('Has dicho: algo×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
    await test.step('paso 5: prompt - cancelar', async () => {
      Dialog.dismiss(page, 'Dime algo:')
      await page.getByRole('button', { name: 'Petición' }).click();
      await expect(page.getByText('Has cancelado×')).toBeVisible();
      await page.locator('#btnCerrar').click();
    });
  });
});

test.describe('subida de ficheros', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fileupload');
  });

  test('enviar ficheros', async ({ page }) => {
    await page.getByRole('button', { name: 'Choose File' }).setInputFiles([
      path.join(__dirname, '../package.json'),
      path.join(__dirname, '../playwright.config.ts'),
    ]);

    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Subir ficheros" [level=1]
    - button "Choose File"
    - button "Subir ficheros"
    - heading "Ficheros seleccionados" [level=2]
    - list:
      - listitem: package.json
      - listitem: playwright.config.ts
    - heading "Ficheros subidos" [level=2]
    - list
    `);
    await page.getByRole('button', { name: 'Subir ficheros' }).click();
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Subir ficheros" [level=1]
    - button "Choose File"
    - button "Subir ficheros"
    - heading "Ficheros seleccionados" [level=2]
    - list
    - heading "Ficheros subidos" [level=2]
    - list:
      - listitem:
        - link "package.json":
          - /url: /files/package.json
        - link "":
          - /url: /deleteupload?file=package.json
      - listitem:
        - link "playwright.config.ts":
          - /url: /files/playwright.config.ts
        - link "":
          - /url: /deleteupload?file=playwright.config.ts
    `);
    await page.getByRole('link', { name: '' }).first().click();
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Subir ficheros" [level=1]
    - button "Choose File"
    - button "Subir ficheros"
    - heading "Ficheros seleccionados" [level=2]
    - list
    - heading "Ficheros subidos" [level=2]
    - list:
      - listitem:
        - link "playwright.config.ts":
          - /url: /files/playwright.config.ts
        - link "":
          - /url: /deleteupload?file=playwright.config.ts
    `);
    await page.getByRole('link', { name: '' }).click();
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Subir ficheros" [level=1]
    - button "Choose File"
    - button "Subir ficheros"
    - heading "Ficheros seleccionados" [level=2]
    - list
    - heading "Ficheros subidos" [level=2]
    - list
    `);
  });

  test('crear y enviar ficheros', async ({ page }) => {
    await page.getByRole('button', { name: 'Choose File' }).setInputFiles([
      { name: 'file1.txt', mimeType: 'text/plain', buffer: Buffer.from('este es el primero') },
      { name: 'file2.txt', mimeType: 'text/plain', buffer: Buffer.from('este es el segundo') },
    ]);

    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Subir ficheros" [level=1]
    - button "Choose File"
    - button "Subir ficheros"
    - heading "Ficheros seleccionados" [level=2]
    - list:
      - listitem: file1.txt
      - listitem: file2.txt
    - heading "Ficheros subidos" [level=2]
    - list
    `);
    await page.getByRole('button', { name: 'Subir ficheros' }).click();
    const page2Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'file1.txt' }).click();
    const page2 = await page2Promise;
    await expect(page2.locator('pre')).toContainText('este es el primero');
    page2.close();
    page.bringToFront()
    const page3Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'file2.txt' }).click();
    const page3 = await page3Promise;
    await expect(page3.locator('html')).toContainText('este es el segundo');
    page3.close();
    page.bringToFront()
    await page.getByRole('link', { name: '' }).nth(1).click();
    await page.getByRole('link', { name: '' }).click();
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Subir ficheros" [level=1]
    - button "Choose File"
    - button "Subir ficheros"
    - heading "Ficheros seleccionados" [level=2]
    - list
    - heading "Ficheros subidos" [level=2]
    - list
    `);
  });

});
