import { test, expect } from '@playwright/test';

test.describe('Navegación', () => {

  test('Navegación por las opciones del menu', async ({ page }) => {
    await page.goto('http://localhost:8181/');
    await page.getByRole('link', { name: 'Calculadora' }).click();
    await expect(page.getByRole('heading', { name: 'Calculadora' })).toBeVisible();
    await page.getByRole('link', { name: 'Compras' }).click();
    await expect.soft(page.locator('h1')).toContainText('Compras');
    await page.getByRole('link', { name: 'Contactos' }).click();
    await expect(page.getByRole('heading')).toContainText('Contactos');
    await page.getByRole('link', { name: 'Alertas' }).click();
    await expect(page.getByRole('heading', { name: 'Alertas' })).toBeVisible();
    await page.getByRole('link', { name: 'Ficheros' }).click();
    await expect(page.locator('h1')).toContainText('Subir ficheros');
    await page.getByRole('link', { name: 'APIs' }).click();
    await expect(page.getByRole('heading', { name: 'Servicios RestFul' })).toBeVisible();
    await page.getByTitle('documentación').click();
    await expect(page.getByRole('heading', { name: 'Web4Testing' })).toBeVisible();
    await page.getByRole('link', { name: 'Inicio' }).click();
    await expect(page).toHaveTitle('Entorno de pruebas Web4Testing');
  });

});

test.describe('Pie de página', () => {
  test('La fecha del copyright debe estar actualizada', async ({ page } ) => {
    const año = (new Date()).getFullYear();
    // console.log(`Estoy en un ${browserName}`)
    await page.goto('http://localhost:8181/')
    await expect(page.getByRole('contentinfo')).toContainText(`© 2017-${año} Company, Inc.`);
  });

  test('Enlaces de privacidad y terminos', async ({ page } ) => {
    await page.goto('http://localhost:8181/')
    // await expect(page.getByRole('contentinfo')).toContainText(`© 2017-${año} Company, Inc.`);
  });
});
