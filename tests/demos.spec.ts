import { test, expect } from '@playwright/test';

test('Navegación por las opciones del menu', async ({ page }) => {
  await page.goto('http://localhost:8181/');
  await page.getByRole('link', { name: 'Calculadora' }).click();
  await expect(page.getByRole('heading', { name: 'Calculadora' })).toBeVisible();
  await page.getByRole('link', { name: 'Compras' }).click();
  await expect(page.locator('h1')).toContainText('Compras');
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
});