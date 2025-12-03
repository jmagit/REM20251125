import { test, expect, Locator } from '@playwright/test';

// test.use({ storageState: 'playwright/.auth/user-storage-state.json' });

test.beforeEach(async ({ page }) => {
  await page.goto('/calculadora');
})

test('llega a la página calculadora', { tag: '@smoke' }, async ({ page }) => {
  await expect(page).toHaveTitle('Calculadora')
});

test.describe('Botones de la calculadora', () => {
  let pantalla: Locator

  test.beforeEach(async ({ page }) => {
    pantalla = page.locator('#txtPantalla')
  })

  // eslint-disable-next-line playwright/expect-expect
  test('básico (sin aserciones directas)', async ({ page }) => {
    await page.getByRole('button', { name: '9' }).click();
    await page.getByRole('button', { name: '8' }).click();
    await page.getByRole('button', { name: '7' }).click();
    await page.getByRole('button', { name: '4' }).click();
    await page.getByRole('button', { name: '5' }).click();
    await page.getByRole('button', { name: '6' }).click();
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '0' }).click();
    await page.getByText('9874563210').click();
  });

  test('botones de la calculadora', async ({ page }) => {
    await test.step('1 - botones numéricos', async () => {
      await page.getByRole('button', { name: '9' }).click();
      await page.getByRole('button', { name: '8' }).click();
      await page.getByRole('button', { name: '7' }).click();
      await page.getByRole('button', { name: '6' }).click();
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '4' }).click();
      await page.getByRole('button', { name: '3' }).click();
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: ',' }).click();
      await page.getByRole('button', { name: '1' }).click();
      await expect(pantalla).toContainText('987654310,1');
    });
    await test.step('2 - cambio de signo', async () => {
      await page.getByRole('button', { name: '±' }).click();
      await expect(pantalla).toContainText('-987654310,1');
    });
    await test.step('3 - borrar uno a uno', async () => {
      await page.getByRole('button', { name: '↶ BORRAR' }).click();
      await page.getByRole('button', { name: '↶ BORRAR' }).click();
      await page.getByRole('button', { name: '↶ BORRAR' }).click();
      await page.getByRole('button', { name: '↶ BORRAR' }).click();
      await expect(pantalla).toContainText('-9876543');
    });
    await test.step('4 - borrar todo', async () => {
      await page.getByRole('button', { name: 'C' }).click();
      await pantalla.click();
      await expect(pantalla).toContainText('0');
    });
  });

  test('bucle botones de la calculadora', async ({ page }) => {
    const secuencia = '98765432,01'
    for (let index = 0; index < secuencia.length; index++) {
      await page.getByRole('button', { name: secuencia[index] as string }).click();
      await expect(pantalla).toContainText(secuencia.substring(0, index + 1));
    }
    await page.getByRole('button', { name: '±' }).click();
    await expect(pantalla).toHaveText(`-${secuencia}`);
    await page.getByRole('button', { name: '±' }).click();
    await expect(pantalla).toHaveText(secuencia);
    for (let index = 1; index < 5; index++) {
      await page.getByRole('button', { name: '↶ BORRAR' }).click();
      await expect(pantalla).toHaveText(secuencia.substring(0, secuencia.length - index));
    }
    await page.getByRole('button', { name: 'C' }).click();
    await expect(pantalla).toHaveText('0');
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '±' }).click();
    await expect(pantalla).toHaveText('-1');
    await page.getByRole('button', { name: '↶ BORRAR' }).click();
    await expect(pantalla).toHaveText('0');
  });

})

test.describe('Operaciones de la calculadora', () => {
  let pantalla: Locator
  let resumen: Locator

  test.beforeEach(async ({ page }) => {
    pantalla = page.locator('#txtPantalla')
    resumen = page.locator('#txtResumen')
  })

  test.describe('Botones de operaciones', () => {
    [
      { operacion: '+', resultado: '6' },
      { operacion: '-', resultado: '0' },
      { operacion: '*', resultado: '9' },
      { operacion: '/', resultado: '1' },
    ].forEach(async ({ operacion, resultado }) => {
      test(`Botón ${operacion}`, async ({ page }) => {
        await page.getByRole('button', { name: '3' }).click();
        await page.getByRole('button', { name: operacion }).click();
        await expect(pantalla).toHaveText('3');
        await expect(resumen).toHaveText(`3 ${operacion}`);
        await page.getByRole('button', { name: '=' }).click();
        await expect(pantalla).toHaveText(resultado);
        await expect(resumen).toBeHidden();
      })
    })
  })

  test('Error IEE-754', () => {
    expect.soft(0.1 + 0.2).toBe(0.3)
    expect.soft(1 - 0.9).toBe(0.1)
    expect.soft(1/0).toBe(Infinity)
    expect.soft(-1/0).toBe(-Infinity)
    expect.soft(1/0*0).toBe(NaN)
    test.info().expectedStatus = 'failed'
  })

  test.describe('Cálculos', () => {
    [
      { operacion: '4321-1234*666/30=', resultado: '68531,4' },
      { operacion: '0,1+0,2=', resultado: '0,3' },
      { operacion: '1-0,9=', resultado: '0,1' },
      { operacion: '1/0=', resultado: 'Infinity' },
      { operacion: '1-2/0=', resultado: '-Infinity' },
      { operacion: '1/0*0=', resultado: 'NaN' },
    ].forEach(async ({ operacion, resultado }) => {
      test(`${operacion}=${resultado}`, async ({ page }) => {
        for (const name of operacion) {
          await page.getByRole('button', { name }).click();
          if (name === "=") break;
        }
        await expect(pantalla).toHaveText(resultado);
        await expect(resumen).toBeHidden();
      })
    })
  })
})

test.describe('Instantáneas de la calculadora', () => {
  const operaciones = [
    { operacion: '+', nombre: 'sum', },
    { operacion: '-', nombre: 'rest', },
    { operacion: '*', nombre: 'multi', },
    { operacion: '/', nombre: 'div', },
  ]

  test.describe('Con visual snapshot', () => {
    operaciones.forEach(async ({ operacion, nombre }) => {
      test(`visual snapshot ${nombre}`, async ({ page }) => {
        await page.getByRole('button', { name: '1' }).click();
        await page.getByRole('button', { name: operacion }).click();
        await expect(page).toHaveScreenshot();
      })
    })
  })

  test.describe('Con content snapshot', () => {
    operaciones.forEach(async ({ operacion, nombre }) => {
      test(`content snapshot ${nombre}`, async ({ page }) => {
        await page.getByRole('button', { name: '5' }).click();
        await page.getByRole('button', { name: operacion }).click();
        expect(await page.innerHTML('main')).toMatchSnapshot();
      })
    })
  })

  test.describe('Con aria snapshot', () => {
    operaciones.forEach(async ({ operacion, nombre }) => {
      test(`aria snapshot ${nombre}`, async ({ page }) => {
        await page.getByRole('button', { name: '5' }).click();
        await page.getByRole('button', { name: operacion }).click();
        await expect(page.getByRole('main')).toMatchAriaSnapshot(`
          - main:
            - heading "Calculadora" [level=1]
            - status: 5 ${operacion}
            - status: "5"
            - button "C"
            - button "↶ BORRAR"
            - button "+"
            - button "7"
            - button "8"
            - button "9"
            - button "-"
            - button "4"
            - button "5"
            - button "6"
            - button "*"
            - button "1"
            - button "2"
            - button "3"
            - button //
            - button "±"
            - button "0"
            - button ","
            - button "="
          `);
      })
    })
  })
})
