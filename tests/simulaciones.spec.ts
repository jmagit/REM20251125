import { test, expect } from '@playwright/test';
import { ContactosPage } from '../utils/contactos.page';

// test.use({ timezoneId: 'Europe/Madrid' })
// test.use({ timezoneId: 'Atlantic/Canary' })

test.describe('clock - simula el reloj', () => {
  test('fija la hora inicial, avanza el tiempo', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2032-02-02T11:00:00'));
    await page.goto('/alertas');
    await expect(page.locator('#currentDate')).toContainText('2032-02-02T10:00:00.000Z');
    await expect(page.getByRole('contentinfo')).toContainText('© 2017-2032');
    await page.clock.runFor('01:30')
    await expect(page.locator('#crono')).toHaveText('90 seconds');
    await page.clock.runFor('01:30')
    await expect(page.locator('#crono')).toHaveText('180 seconds');
    await page.clock.runFor('05:30')
    await expect(page.locator('#crono')).toHaveText('515 seconds');
  });

  test('fija la hora inicial, avanza el reloj', async ({ page }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const $ = (_: any): any => { }  // FAKE: evita error TypeScript

    await page.clock.install({ time: new Date('2025-04-03T12:00:00') });
    await page.goto('/alertas');
    await expect(page.locator('#currentDate')).toContainText('2025-04-03T10:00:00');
    await page.clock.fastForward('30:00');
    await page.evaluate(() => {
      // eslint-disable-next-line playwright/no-unsafe-references
      $('#currentDate').text(new Date().toJSON())
    })
    await expect(page.locator('#currentDate')).toContainText('2025-04-03T10:30:00');
    await expect(page.locator('#crono')).toHaveText('2 seconds');
    await page.clock.fastForward('30:00');
    await page.evaluate(() => {
      // eslint-disable-next-line playwright/no-unsafe-references
      $('#currentDate').text(new Date().toJSON())
    })
    await expect(page.locator('#currentDate')).toContainText('2025-04-03T11:00');
    await expect(page.locator('#crono')).toHaveText('4 seconds');
  });

  test('controla el carrusel', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');
    await expect(page.locator('#myCarousel')).toContainText('Calculadora');
    await page.clock.runFor(5000)
    await expect(page.locator('#myCarousel')).toContainText('Carrito de la compra');
    await page.clock.runFor(5000)
    await expect(page.locator('#myCarousel')).toContainText('API Rest');
    await page.clock.runFor(5000)
    await expect(page.locator('#myCarousel')).toContainText('Calculadora');
    await expect(page.getByRole('contentinfo')).toContainText(`© 2017-${(new Date()).getFullYear()}`);
    await page.getByRole('link', { name: 'Privacy' }).focus();
  });
});

test.describe('Suplantación de las APIs del navegador', () => {

  test('Debería cargar la página del tiempo con la geolocalización', async ({ page }) => {
    page.context().grantPermissions(['geolocation'])

    page.context().setGeolocation({ latitude: 40.6892, longitude: -74.0445, })
    await page.goto('https://openweathermap.org/');
    await expect(page.locator('#weather-widget')).toContainText('Hudson, US');
    // await page.getByRole('button', { name: 'Accept' }).click();
    await page.getByRole('button', { name: 'Decline' }).click();
    await page.waitForTimeout(5000);

    page.context().setGeolocation({ latitude: 40.416779, longitude: -3.703540, })
    await page.goto('https://openweathermap.org/');
    await expect.soft(page.locator('#weather-widget')).toContainText('Sol, ES');
    // await expect.soft(page.locator('#weather-widget')).toContainText('Madrid, ES');
    await page.waitForTimeout(5000);

    page.context().setGeolocation({ latitude: 37.386085, longitude: -5.992431, })
    await page.goto('https://openweathermap.org/');
    await expect.soft(page.locator('#weather-widget')).toContainText('Seville, ES');
    await page.waitForTimeout(5000);

    page.context().setGeolocation({ latitude: 18.4327866, longitude: -69.01372, })
    await page.goto('https://openweathermap.org/');
    await expect.soft(page.locator('#weather-widget')).toContainText('La Romana, DO');
    await page.waitForTimeout(5000);
  });
});

test.describe('Suplantación de la red', () => {
  test('debería cargar la página sin css', async ({ page }) => {
    await page.context().route(/.css$/, route => route.abort());
    await page.goto('/contactos');
  });

  test('debería cargar la página con fotos por defecto', async ({ page }) => {
    await page.context().route('**/men/*.jpg', route => route.fulfill({
      status: 200,
      contentType: 'image/png',
      path: 'fixtures/user-not-found-male.png'
    }));
    await page.context().route('**/women/*.jpg', route => route.fulfill({
      status: 200,
      contentType: 'image/png',
      path: 'fixtures/user-not-found-female.png'
    }));
    await page.goto('/contactos');
    await expect(page.getByRole('img', { name: 'Foto de Aveline McCullagh' })).toBeVisible();
  });
});

test.describe('Suplantación de un API REST', () => {
  let pom: ContactosPage

  test.beforeEach('crea page object', async ({ page }) => {
    await page.context().route('**/api/contactos?_sort=nombre,apellidos&_projection=id,tratamiento,nombre,apellidos,avatar,telefono,email&_page=0&_rows=7', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      path: 'fixtures/contactos-page-0.json'
    }));
    await page.context().route('**/api/contactos?_sort=nombre,apellidos&_projection=id,tratamiento,nombre,apellidos,avatar,telefono,email&_page=1&_rows=7', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      path: 'fixtures/contactos-page-1.json'
    }));
    pom = new ContactosPage(page)
  });

  test('debería cargar la lista fija de contactos', async ({ page }) => {
    await pom.goto();
    await expect(page.getByRole('img', { name: 'Foto de Jill Goodbar' })).toBeVisible();
    await pom.irSiguiente();
    expect(await pom.elementosPorPagina()).toBe(3);
  });

  test('debería cargar siempre a Pepito Grillo', async ({ page }) => {
    await pom.page.context().route(/\/api\/contactos\/\d+/, route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      path: 'fixtures/contacto-101.json'
    }));
    await pom.goto();
    await pom.ver('Jill Goodbar')
    await expect(page.locator('#listado')).toMatchAriaSnapshot(`
      - img "Foto de Pepito Grillo"
      - heading "Sr. Pepito Grillo" [level=4]
      - paragraph:
        - text: / 555 123 456 /
        - link "pepito@grillo":
          - /url: mailto:pepito@grillo
        - text: / 25/12/2000/
      `);
  });

  test('debería interceptar la petición', async ({ page }) => {
    await pom.page.context().route(/\/api\/contactos\/\d+/, async (route) => {
      switch (route.request().method()) {
        case "GET": {
          const response = await route.fetch();
          const json = await response.json();
          await route.fulfill({ response, json: { ...json, nombre: 'Pepito' } });
          break;
        }
        default:
          await route.fulfill({
            status: 204,
            contentType: 'application/json',
            path: 'fixtures/contacto-101.json'
          });
      }
    });
    await pom.goto();
    await pom.editar('Jill Goodbar')
    await pom.ponId('101')
    await pom.ponApellidos('1234 56789')
    await pom.enviar()
    await expect(page.getByRole('img', { name: 'Foto de Jill Goodbar' })).toBeVisible();
  });

  test('simula errores de red', async ({ page }) => {
    await page.context().route(/\/api\/contactos\/\d+/, async (route) => {
      switch (route.request().method()) {
        case "GET": {
          await route.fulfill({ status: 404,  });
          // await route.abort('aborted');
          break;
        }
        default: 
          // await route.fulfill({ status: 400,  });
          await route.abort('aborted');
      }
    });
    await page.context().route(/\/api\/contactos$/, async (route) => {
      switch (route.request().method()) {
        case "PUT": {
          await route.fulfill({ status: 404,  });
          break;
        }
      }
    });
    await pom.goto();
    await pom.editar('Jill Goodbar')
    // await expect(page.locator('#alertError')).toMatchAriaSnapshot(`
    //   - text: "/ERROR: 404: Not Found/"
    //   `);
    // await pom.nuevo()
    // await pom.ponId('101')
    // await pom.ponNombre('1234 56789')
    // await pom.enviar()
    // await expect(page.locator('#alertError')).toMatchAriaSnapshot(`
    //   - text: "/ERROR: 400: Bad Request/"
    //   `);
  });
});

