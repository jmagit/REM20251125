import { test, expect } from '@playwright/test';

const opciones = [
  { name: 'Inicio', title: 'Entorno de pruebas Web4Testing' },
  { name: 'Calculadora', title: 'Calculadora' },
  { name: 'Compras', title: 'Carrito de la compra' },
  { name: 'Contactos', title: 'Contactos' },
  { name: 'Alertas', title: 'Alertas' },
  { name: 'Ficheros', title: 'Ficheros' },
  { name: 'APIs', title: 'API REST' },
  // { name: '', title: '' },
]

test.beforeEach('Prepara la prueba navegando a la página inicial', async ({ page }) => {
  // await page.goto('http://host.docker.internal:8181/');
  await page.goto('/');
});

test.describe('Navegación', () => {

  test('prueba las opciones de navegación por el menu de la página principal', {
    tag: '@smoke',
    annotation: [
      { type: 'issue', description: 'https://github.com/microsoft/playwright/issues/23180' },
      { type: 'performance', description: 'very slow test!' },
    ],
  }, async ({ page }) => {
    // await page.goto('http://localhost:8181/');
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

  test.describe('Recorrer todas las opciones', () => {
    opciones.forEach(async ({ name, title }) => {
      test(`Navega a la opción: ${name}`, async ({ page, /*isMobile,*/ viewport }) => {
        // eslint-disable-next-line playwright/no-conditional-in-test
        if ((viewport?.width ?? 720) < 720 /* isMobile*/)
          await page.getByRole('button', { name: 'Toggle navigation' }).click();
        await page.getByRole('link', { name }).click();
        await expect(page).toHaveTitle(title);
      });
    });
  });
});

test.describe('Pie de página', () => {
  test('La fecha del copyright debe estar actualizada', async ({ page, browserName }) => {
    test.info().tags.push('@smoke')
    test.info().annotations.push({ type: 'navegador', description: browserName })
    // test.skip(browserName === 'firefox', 'porque no afecta al firefox');
    const año = (new Date()).getFullYear();
    // console.log(`Estoy en un ${browserName}`)
    // await page.goto('http://localhost:8181/')
    await expect(page.getByRole('contentinfo')).toContainText(`© 2017-${año} Company, Inc.`);
  });

  test('Enlaces de privacidad y terminos', async ({ page }) => {
    // await page.goto('http://localhost:8181/')
    expect(true).toBeTruthy()
    // expect(true).toBeFalsy()
    test.fixme(test.info().status === 'passed', 'esta a medias')
    await expect(page.getByRole('contentinfo')).toContainText(`© 2017-${(new Date()).getFullYear()} Company, Inc.`);
  });
});

test('Pagina de inicio', async ({page}) => {
  await page.getByRole('img', { name: 'Calculadora' }).click();
  await expect(page.getByRole('button', { name: 'Ver mas »' }).first()).toBeVisible();
  await page.getByText('Carrito de la compraEl').nth(1).click();
  await page.locator('#myCarousel').getByRole('heading', { name: 'Calculadora' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('#myCarousel').getByRole('heading', { name: 'Carrito de la compra' }).click();
  await page.getByRole('heading', { name: 'Entorno de pruebas Web4Testing' }).click();
})