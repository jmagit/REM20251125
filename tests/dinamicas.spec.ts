import { test, expect } from '@playwright/test';

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync'; // instalar: npm i -D csv-parse
const casosEnCSV = parse(fs.readFileSync(path.join(__dirname, '../fixtures', 'opciones-menu.csv')), {
  columns: true,
  skip_empty_lines: true
}) as { name: string, title: string }[];

import casosEnJSON from '../fixtures/opciones-menu.json';

test('Prueba estática', async ({ page }) => {
    await page.goto('/');
    await test.step('navega a la opción: Calculadora', async () => {
      await page.getByRole('link', { name: 'Calculadora' }).click();
      await expect(page.getByRole('heading', { name: 'Calculadora' })).toBeVisible();
    });
    await test.step('navega a la opción: Compras', async () => {
      await page.getByRole('link', { name: 'Compras' }).click();
      await expect.soft(page.locator('h1')).toContainText('Compras');
    });
    await test.step('navega a la opción: Contactos', async () => {
      await page.getByRole('link', { name: 'Contactos' }).click();
      await expect(page.getByRole('heading')).toContainText('Contactos');
    });
    await test.step('navega a la opción: Alertas', async () => {
      await page.getByRole('link', { name: 'Alertas' }).click();
      await expect(page.getByRole('heading', { name: 'Alertas' })).toBeVisible();
    });
    await test.step('navega a la opción: Ficheros', async () => {
      await page.getByRole('link', { name: 'Ficheros' }).click();
      await expect(page.locator('h1')).toContainText('Subir ficheros');
    });
    await test.step('navega a la opción: APIs', async () => {
      await page.getByRole('link', { name: 'APIs' }).click();
      await expect(page.getByRole('heading', { name: 'Servicios RestFul' })).toBeVisible();
    });
    await test.step('navega a la opción: Documentación', async () => {
      await page.getByTitle('documentación').click();
      await expect(page.getByRole('heading', { name: 'Web4Testing' })).toBeVisible();
    });
    await test.step('navega a la opción: Inicio', async () => {
      await page.getByRole('link', { name: 'Inicio' }).click();
      await expect(page).toHaveTitle('Entorno de pruebas Web4Testing');
    });
});

test.describe('Pruebas dinámicas', () => {
  test.beforeEach(async ({ page }) => {
    console.log(`Running ${test.info().title}`);
    await page.goto('/');
  });
  [
    { name: 'Inicio', title: 'Entorno de pruebas Web4Testing' },
    { name: 'Calculadora', title: 'Calculadora' },
    { name: 'Compras', title: 'Carrito de la compra' },
    { name: 'Contactos', title: 'Contactos' },
    // { name: 'Alertas', title: 'Alertas' },
    // { name: 'Ficheros', title: 'Ficheros' },
    // { name: 'APIs', title: 'API REST' },
    // { name: '', title: '' },
  ].forEach(({ name, title }) => {
    test(`usando un array, navega a la opción:  ${name}`, async ({ page }) => {
      await page.getByRole('link', { name }).click();
      await expect(page).toHaveTitle(title);
    });
  });
});

test.describe('Data test', () => {
  test.beforeEach(async ({ page }) => {
    console.log(`Running ${test.info().title}`);
    await page.goto('/');
  });

  casosEnCSV.forEach(({ name, title }) => {
    test(`usando un fichero CSV, navega a la opción: ${name}`, async ({ page }) => {
      await page.getByRole('link', { name }).click();
      await expect(page).toHaveTitle(title);
    });
  });

  casosEnJSON.forEach(({ name, title }) => {
    test(`usando un fichero JSON, navega a la opción: ${name}`, async ({ page }) => {
      await page.getByRole('link', { name }).click();
      await expect(page).toHaveTitle(title);
    });
  });
});
