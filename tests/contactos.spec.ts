import { test, expect, Locator } from '@playwright/test';

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
test('formulario', { tag: '@smoke' }, async ({ page }) => {
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
  // await page.getByRole('button', { name: 'Enviar' }).last().click();
  await btnEnviar.click();
 
  // await page.locator('#frmPrincipal').click();
});
