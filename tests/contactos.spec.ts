import { Locator } from '@playwright/test';
import { test, expect } from '../utils/auth.fixture';

let btnEnviar: Locator

test.beforeEach('Prepara la prueba navegando a la página inicial', async ({ page }) => {
  // await page.goto('http://host.docker.internal:8181/');
  await page.goto('/contactos');
  // btnEnviar = page.getByRole('button', { name: 'Enviar' }).last();
  btnEnviar = page.locator('#btnEnviar');

});

test('llega a la página de contactos', { tag: '@smoke' }, async ({ page }) => {
  await expect(page).toHaveTitle('Contactos')
});

test('prueba la paginación de los contactos', { tag: '@smoke' }, async ({ page }) => {
  await expect(page.getByRole('columnheader', { name: 'Lista de contactos' })).toBeVisible();
  expect(await page.getByRole('row').count()).toBe(8)
  await expect(page.getByText('Dr. Adolf Dunster Tlfn.: 699')).toBeVisible();
  await page.getByRole('link', { name: '3' }).click();
  await expect(page.getByText('Sr. Chrissy Madgin Tlfn.: 721')).toBeVisible();
  await page.getByRole('link').filter({ hasText: 'siguiente' }).click();
  await expect(page.getByText('Excmo. Dalli Orthmann Tlfn.:')).toBeVisible();
  await page.getByRole('link').filter({ hasText: 'último' }).click();
  expect(await page.getByRole('row').count()).toBe(3)
  await page.getByRole('link').filter({ hasText: 'anterior' }).click();
  await expect(page.getByText('Sr. Teodorico Soppit Tlfn.:')).toBeVisible();
  await page.getByRole('link').filter({ hasText: /^inicio$/ }).click();
  await expect(page.getByText('Dr. Adolf Dunster Tlfn.: 699')).toBeVisible();
});

test('consulta un contacto', async ({ page }) => {
  await page.getByRole('button', { name: 'Dr. Adolf Dunster' }).click();
  await expect(page.locator('#listado')).toMatchAriaSnapshot(`
    - img "Foto de Adolf Dunster"
    - heading "Dr. Adolf Dunster" [level=4]
    - paragraph:  Persona conflictiva
    - paragraph:
      - text: / 699 455 408 /
      - link "adunster1a@amazon.co.uk":
        - /url: mailto:adunster1a@amazon.co.uk
      - text: / 01/09/1979/
    `);
});

test('añadir un contacto', { tag: '@smoke' }, async ({ page, request }) => {
  await request.delete('/api/contactos/101', { ignoreHTTPSErrors: true })
  await page.getByRole('button', { name: 'Añadir' }).describe('pulsar el botón de añadir').click();
  await page.getByRole('spinbutton', { name: 'Código:' }).describe('meter el código incorrecto').fill('-1');
  await page.getByRole('spinbutton', { name: 'Código:' }).press('Tab');
  await expect(page.locator('#err_id'), 'Expect Sale el mensaje de error').toContainText('El valor debe ser superior o igual a 0');
  await page.getByRole('spinbutton', { name: 'Código:' }).fill('0');
  await page.getByRole('spinbutton', { name: 'Código:' }).blur();
  await expect(page.locator('#err_id')).toBeHidden();
  await page.getByLabel('Tratamiento:').selectOption('Srta.');
  await page.getByRole('textbox', { name: 'Nombre:' }).fill('1234');
  await page.getByRole('textbox', { name: 'Apellidos:' }).fill('98765 4321');
  await page.getByRole('textbox', { name: 'Teléfono:' }).fill('987 654 321');
  await page.getByRole('textbox', { name: 'Correo:' }).fill('a@a');
  await page.getByRole('radio', { name: 'Mujer' }).check();
  await page.getByRole('checkbox', { name: 'Conflictivo' }).check();
  await page.getByRole('textbox', { name: 'Avatar:' }).fill('https://randomuser.me/api/portraits/women/1.jpg');
  await btnEnviar.click();
});

test('añadir un mal contacto', async ({ page }) => {
  await page.getByRole('button', { name: 'Añadir' }).click();
  await btnEnviar.click();
  await expect(page.locator('#err_id')).toBeVisible();
  await expect(page.locator('#err_id')).toContainText('Completa este campo');
  await expect(page.locator('#err_nombre')).toBeVisible();
  await expect(page.locator('#err_nombre')).toContainText('Completa este campo');

  await page.getByRole('spinbutton', { name: 'Código:' }).fill('-1');
  await page.getByRole('spinbutton', { name: 'Código:' }).press('Tab');
  await expect(page.locator('#err_id')).toBeVisible();
  await expect(page.locator('#err_id')).toContainText('El valor debe ser superior o igual a 0');
  await page.getByRole('spinbutton', { name: 'Código:' }).fill('0');
  await page.getByRole('spinbutton', { name: 'Código:' }).press('Tab');
  await expect(page.locator('#err_id')).toBeHidden();

  await page.getByRole('textbox', { name: 'Nombre:' }).fill('1');
  await page.getByRole('textbox', { name: 'Apellidos:' }).fill('1');
  await page.getByRole('textbox', { name: 'Correo:' }).fill('1');
  await page.getByRole('textbox', { name: 'F. Nacimiento:' }).pressSequentially('310');
  await page.getByRole('textbox', { name: 'F. Nacimiento:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Avatar:' }).fill('1');

  await page.getByRole('button', { name: 'Volver' }).focus();

  // await expect(page.locator('#err_nombre')).toContainText('Aumenta la longitud de este texto a 2 caracteres o más (actualmente, el texto tiene 1 carácter).');
  // await expect(page.locator('#err_apellidos')).toContainText('Aumenta la longitud de este texto a 2 caracteres o más (actualmente, el texto tiene 1 carácter).');
  // await expect(page.locator('#err_email')).toContainText('Incluye un signo "@" en la dirección de correo electrónico. La dirección "1" no incluye el signo "@".');
  // await expect(page.locator('#err_avatar')).toContainText('Introduce una URL');

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - text: Datos inválidos
    - button
    - heading "Contactos" [level=1]
    - text: "Código:"
    - spinbutton "Código:"
    - text: "Tratamiento:"
    - text: "Nombre:"
    - textbox "Nombre:"
    - text: "Aumenta la longitud de este texto a 2 caracteres o más (actualmente, el texto tiene 1 carácter). Apellidos:"
    - textbox "Apellidos:"
    - text: "Aumenta la longitud de este texto a 2 caracteres o más (actualmente, el texto tiene 1 carácter). Teléfono:"
    - textbox "Teléfono:"
    - text: "Correo:"
    - textbox "Correo:"
    - text: "Incluye un signo \\"@\\" en la dirección de correo electrónico. La dirección \\"1\\" no incluye el signo \\"@\\". F. Nacimiento:"
    - text: "Conflictivo Avatar:"
    - textbox "Avatar:"
    - text: Introduce una URL
    - button "Enviar" [disabled]
    - button "Volver"
    `);

  // await page.getByRole('textbox', { name: 'Nombre:' }).fill('12');
  // await page.getByRole('textbox', { name: 'Apellidos:' }).fill('12');
  // await page.getByRole('textbox', { name: 'Correo:' }).fill('a@a');
  // await page.getByRole('textbox', { name: 'Avatar:' }).fill('http://www.example.com/image.png');

  await page.getByRole('button', { name: 'Volver' }).focus();
});

test('añadir un mal contacto - con instantáneas', async ({ page }) => {
  await page.getByRole('button', { name: 'Añadir' }).click();
  await btnEnviar.click();
  await expect(page.getByRole('main')).toHaveScreenshot('inicial.png');

  await page.getByRole('spinbutton', { name: 'Código:' }).fill('-1');
  await page.getByRole('textbox', { name: 'Nombre:' }).fill('1');
  await page.getByRole('textbox', { name: 'Apellidos:' }).fill('1');
  await page.getByRole('textbox', { name: 'Correo:' }).fill('1');
  await page.getByRole('textbox', { name: 'F. Nacimiento:' }).pressSequentially('310');
  await page.getByRole('textbox', { name: 'F. Nacimiento:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Avatar:' }).fill('1');
  await page.getByRole('button', { name: 'Volver' }).focus();
  await expect(page.getByRole('main')).toHaveScreenshot('con-errores.png');

  await page.getByRole('spinbutton', { name: 'Código:' }).fill('0');
  await page.getByRole('textbox', { name: 'Nombre:' }).fill('12');
  await page.getByRole('textbox', { name: 'Apellidos:' }).fill('12');
  await page.getByRole('textbox', { name: 'Correo:' }).fill('a@a');
  await page.getByRole('textbox', { name: 'F. Nacimiento:' }).fill('2008-09-28');
  await page.getByRole('textbox', { name: 'Avatar:' }).fill('http://www.example.com/image.png');
  await page.getByRole('button', { name: 'Volver' }).focus();
  await expect(page.getByRole('main')).toHaveScreenshot('sin-errores.png');
});

test.describe('modifica o borra datos existentes', () => {

  test.beforeEach('prepara datos', async ({ request, authHeader }) => {
    await request.delete('/api/contactos/101', { ignoreHTTPSErrors: true, headers: authHeader })
    const response = await request.post('/api/contactos', {
      headers: { "content-type": "application/json" },
      data: {
        "id": 0, "tratamiento": "Srta.",
        "nombre": "1234",
        "apellidos": "98765 4321",
        "telefono": "987 654 321",
        "email": "a@a",
        "nacimiento": "2002-12-21",
        "sexo": "M",
        "conflictivo": true, "avatar": "https://randomuser.me/api/portraits/women/1.jpg"
      }
    })
    expect(response.ok()).toBeTruthy();
  })
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8181/contactos');
  });

  test('modificar un contacto', async ({ page }) => {
    await page.getByRole('row', { name: 'Foto de 1234 98765 4321' }).getByLabel('editar').click();
    await page.getByLabel('Tratamiento:').selectOption('Sr.');
    await page.getByRole('textbox', { name: 'Nombre:' }).fill(' Pepito');
    await page.getByRole('textbox', { name: 'Apellidos:' }).fill('Grillo');
    await page.getByRole('textbox', { name: 'Teléfono:' }).fill('555 654 321');
    await page.getByRole('textbox', { name: 'Correo:' }).fill('pgrillo@example.com');
    await page.getByRole('textbox', { name: 'F. Nacimiento:' }).fill('2001-02-03');
    await page.getByRole('radio', { name: 'Hombre' }).check();
    await page.getByRole('checkbox', { name: 'Conflictivo' }).uncheck();
    await page.getByRole('textbox', { name: 'Avatar:' }).fill('https://randomuser.me/api/portraits/men/1.jpg');
    await btnEnviar.click();
    await page.getByRole('row', { name: 'Foto de Pepito Grillo' }).getByLabel('ver').click();
    await expect(page.locator('#listado')).toMatchAriaSnapshot(`
      - img "Foto de Pepito Grillo"
      - heading "Sr. Pepito Grillo" [level=4]
      - paragraph:
        - text: / 555 654 321 /
        - link "pgrillo@example.com":
          - /url: mailto:pgrillo@example.com
        - text: / 03/02/2001/
      - button "Social"
      - button "Social"
      - button "Volver"
      `);
  })

  test('borrar un contacto - aceptar', async ({ page }) => {
    page.once('dialog', dialog => {
      expect(dialog.message(), 'Expect valida la pregunta del confirm').toBe('¿Estas seguro?')
      dialog.accept();
    });
    await page.getByRole('row', { name: 'Foto de 1234 98765 4321' }).getByLabel('borrar').click();
    await expect(page.getByRole('row', { name: 'Foto de 1234 98765 4321' })).toBeHidden();
  })

  test('borrar un contacto - cancelar', async ({ page }) => {
    page.once('dialog', dialog => {
      expect(dialog.message(), 'Expect valida la pregunta del confirm').toBe('¿Estas seguro?')
      dialog.dismiss();
    });
    await page.getByRole('row', { name: 'Foto de 1234 98765 4321' }).getByLabel('borrar').click();
    await expect(page.getByRole('row', { name: 'Foto de 1234 98765 4321' })).toBeVisible();
  })

})