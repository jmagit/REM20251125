import { test, expect } from '@playwright/test';

test.beforeEach('Prepara la prueba navegando a la página inicial', async ({ page }) => {
  // await page.goto('http://host.docker.internal:8181/');
  await page.goto('/contactos');
});

test('prueba las opciones de navegación por el menu de la página principal', { tag: '@smoke' }, async ({ page }) => {
  await expect(page).toHaveTitle('Contactos')
});
