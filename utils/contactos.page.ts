import { Locator, Page } from '@playwright/test';
import { Dialog } from './helpers';

export class ContactosPage {
  readonly btnNuevo: Locator;
  readonly btnEnviar: Locator;
  readonly btnVolver: Locator;
  readonly page: Page;
  readonly id: Locator;
  readonly tratamiento: Locator;
  readonly nombre: Locator;
  readonly apellidos: Locator;
  readonly telefono: Locator;
  readonly email: Locator;
  readonly hombre: Locator;
  readonly mujer: Locator;
  readonly nacimiento: Locator;
  readonly avatar: Locator;
  readonly conflictivo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnNuevo = page.getByRole('button', { name: 'Añadir' }).describe('botón de Añadir')
    this.btnEnviar = page.locator('#btnEnviar').describe('botón de Enviar')
    this.btnVolver = page.getByRole('button', { name: 'Volver' }).describe('botón de Volver')
    this.id = page.getByRole('spinbutton', { name: 'Código:' }).describe('Código')
    this.tratamiento = page.getByLabel('Tratamiento:').describe('Tratamiento')
    this.nombre = page.getByRole('textbox', { name: 'Nombre:' }).describe('Nombre')
    this.apellidos = page.getByRole('textbox', { name: 'Apellidos:' }).describe('Apellidos')
    this.telefono = page.getByRole('textbox', { name: 'Teléfono:' }).describe('Teléfono')
    this.email = page.getByRole('textbox', { name: 'Correo:' }).describe('Correo')
    this.hombre = page.getByRole('radio', { name: 'Hombre' }).describe('Hombre')
    this.mujer = page.getByRole('radio', { name: 'Mujer' }).describe('Mujer')
    this.nacimiento = page.getByRole('textbox', { name: 'F. Nacimiento:' }).describe('F. Nacimiento')
    this.avatar = page.getByRole('textbox', { name: 'Avatar:' }).describe('Avatar')
    this.conflictivo = page.getByRole('checkbox', { name: 'Conflictivo' }).describe('Conflictivo')

  }

  goto() {
    return this.page.goto('/contactos');
  }

  irA(numPagina: number) {
    return this.page.getByRole('link', { name: numPagina.toString() }).describe(`página ${numPagina}`).click();
  }
  irPrimera() {
    return this.page.getByRole('link').filter({ hasText: /^inicio$/ }).describe('página primera').click();
  }
  irAnterior() {
    return this.page.getByRole('link').filter({ hasText: 'anterior' }).describe('página anterior').click();
  }
  irSiguiente() {
    return this.page.getByRole('link').filter({ hasText: 'siguiente' }).describe('página siguiente').click();
  }
  irUltima() {
    return this.page.getByRole('link').filter({ hasText: 'último' }).describe('página última').click();
  }
  elementosPorPagina() {
    return this.page.locator('tbody tr').describe('filas de la tabla').count();
  }
  paginaActiva() {
    return this.page.locator('.pagination .active').describe('página activa');
  }


  nuevo() { return this.btnNuevo.click(); }
  ver(nombre: string) {
    return this.page.getByRole('row', { name: nombre }).getByLabel('ver').describe('botón de Ver').click();
  }
  editar(nombre: string) {
    return this.page.getByRole('row', { name: nombre }).getByLabel('editar').describe('botón de Editar').click();
  }
  borrar(nombre: string) {
    Dialog.accept(this.page, '¿Estas seguro?')
    return this.page.getByRole('row', { name: nombre }).getByLabel('borrar').describe('botón de Borrar').click();
  }
  enviar() { return this.btnEnviar.click(); }
  volver() { return this.btnVolver.click(); }

  ponId(valor: string) { return this.id.fill(valor); }
  ponTratamiento(valor: string) { return this.tratamiento.selectOption(valor); }
  ponNombre(valor: string) { return this.nombre.fill(valor); }
  ponApellidos(valor: string) { return this.apellidos.fill(valor); }
  ponTelefono(valor: string) { return this.telefono.fill(valor); }
  ponEmail(valor: string) { return this.email.fill(valor); }
  ponSexo(valor: 'H' | 'M') { return (valor === 'H' ? this.hombre : this.mujer).check(); }
  ponNacimiento(valor: string) { return this.nacimiento.fill(valor); }
  ponAvatar(valor: string) { return this.avatar.fill(valor); }
  ponConflictivo(valor: boolean) { return this.conflictivo.setChecked(valor); }

}