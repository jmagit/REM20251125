import { test, expect } from "@playwright/test";
import { AppPage } from '../utils/app.page';

let app: AppPage

test.beforeEach('prepara el POM', async ({ page }) => {
  app = new AppPage(page);
});

// test.use({ storageState: { cookies: [], origins: [] } });
test.describe('page object', () => {
  test.describe.configure({ retries: 2 });
  // eslint-disable-next-line playwright/expect-expect
  test('navegación', async () => {
    await app.goto()
    await app.logout()
    await app.gotoCalculadora()
    await app.gotoAPIs()
    await app.loginByIndex(3)
    await app.gotoCompras()
    await app.gotoContactos()
  });

  test('contactos - paginación', async () => {
    const pom = await (await app.goto()).gotoContactos()
    await pom.irA(7)
    await pom.irAnterior()
    await expect(pom.paginaActiva(), 'Verifico que sea la página 6').toHaveText('6')
    await pom.irAnterior()
    expect(await pom.elementosPorPagina(), 'Verifico que sean 7 filas').toBe(7)
    await pom.irSiguiente()
    await pom.irA(10)
    await pom.irUltima()
    expect(await pom.elementosPorPagina(), 'Verifico que sean 2 filas').toBe(2)
    await pom.irAnterior()

  });

  // eslint-disable-next-line playwright/expect-expect
  test('contactos - CRUD', async () => {
    const pom = await (await app.goto()).gotoContactos()
    pom.nuevo()
    await pom.ponId('0')
    await pom.ponTratamiento('Dra.')
    await pom.ponNombre('11223344')
    await pom.ponApellidos('Aaaaa Bbbbbbb')
    await pom.ponTelefono('555 444 333')
    await pom.ponEmail('a@example.com')
    await pom.ponSexo('M')
    await pom.ponNacimiento('2001-02-03')
    await pom.ponAvatar('https://randomuser.me/api/portraits/women/10.jpg')
    await pom.ponConflictivo(true)
    await pom.enviar()

    await pom.editar('11223344 Aaaaa Bbbbbbb')
    await pom.ponTratamiento('Dr.')
    await pom.ponSexo('H')
    await pom.ponAvatar('https://randomuser.me/api/portraits/men/10.jpg')
    await pom.enviar()

    await pom.borrar('11223344 Aaaaa Bbbbbbb')
  });
})
