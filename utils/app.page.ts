import { expect, type Locator, type Page } from '@playwright/test';
import usuarios from '../playwright/.auth/usuarios.json';
import { ContactosPage } from './contactos.page';

export class AppPage {
  readonly opciones = [
    { name: 'Inicio', title: 'Entorno de pruebas Web4Testing' },
    { name: 'Calculadora', title: 'Calculadora' },
    { name: 'Compras', title: 'Carrito de la compra' },
    { name: 'Contactos', title: 'Contactos' },
    { name: 'Alertas', title: 'Alertas' },
    { name: 'Ficheros', title: 'Ficheros' },
    { name: 'APIs', title: 'API REST' },
  ]
  readonly page: Page;
  readonly isMobile: boolean;
  readonly btnLogin: Locator;
  readonly btnLogout: Locator;
  readonly btnToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.isMobile = (page.viewportSize()?.width ?? 720) < 720;
    page.context()
    this.btnLogin = page.getByRole('button', { name: 'enviar login' }).describe('botón de enviar login')
    this.btnLogout = page.getByRole('button', { name: 'enviar logout' }).describe('botón de enviar logout')
    this.btnToggle = page.getByRole('button', { name: 'Toggle navigation' }).describe('botón de abrir menu')
  }

  async isAuthenticated() {
    return await this.btnLogout.isVisible()
  }

  async login(username: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Usuario' }).describe('Usuario').fill(username);
    await this.page.getByRole('textbox', { name: 'Contraseña' }).describe('Contraseña').fill(password);
    await this.btnLogin.click();
    await expect(this.btnLogout, 'Verifico que botón de enviar logout sea visible').toBeVisible();
  }

  async loginByIndex(index = 1) {
    return this.login(usuarios[index].idUsuario, usuarios[index].password);
  }

  async logout() {
    if (await this.isAuthenticated()) {
      await this.btnLogout.click();
    }
    await expect(this.btnLogin, 'Verifico que botón de enviar login sea visible').toBeVisible();
  }

  async goto() {
    await this.page.goto('/');
    return this;
  }

  async gotoInicio() {
    await this.navega(0);
  }

  async gotoCalculadora() {
    await this.navega(1);
  }

  async gotoCompras() {
    await this.navega(2);
  }

  async gotoContactos() {
    await this.navega(3);
    return new ContactosPage(this.page)
  }

  async gotoAlertas() {
    await this.navega(4);
  }

  async gotoFicheros() {
    await this.navega(5);
  }

  async gotoAPIs() {
    await this.navega(6);
  }

  private async navega(index: number) {
    if (this.isMobile)
      await this.page.getByRole('button', { name: 'Toggle navigation' }).click();
    await this.page.getByRole('link', { name: this.opciones[index].name }).describe(`menu ${this.opciones[index].name}`).click();
    await expect(this.page, `Verifico que tiene como titulo '${this.opciones[index].title}'`).toHaveTitle(this.opciones[index].title);
  }
}