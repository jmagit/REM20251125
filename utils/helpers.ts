import { expect, Page } from '@playwright/test';

export function acceptDialog(page: Page, message?: string) {
    page.once('dialog', dialog => {
        if (message) {
            expect(dialog.message(), `Valido que el contenido sea '${message}'`).toBe(message)
        }
        dialog.accept();
    });
}
export function dismissDialog(page: Page, message?: string) {
    page.once('dialog', dialog => {
        if (message) {
            expect(dialog.message(), `Valido que el contenido sea '${message}'`).toBe(message)
        }
        dialog.dismiss();
    });
}
export function promptDialog(page: Page, response: string, message?: string) {
    page.once('dialog', dialog => {
        if (message) {
            expect(dialog.message(), `Valido que el contenido sea '${message}'`).toBe(message)
        }
        dialog.accept(response);
    });
}

export class Dialog {
    static accept(page: Page, message?: string) {
        page.once('dialog', dialog => {
            if (message) {
                expect(dialog.message(), `Valido que el contenido sea '${message}'`).toBe(message)
            }
            dialog.accept();
        });
    }
    static dismiss(page: Page, message?: string) {
        page.once('dialog', dialog => {
            if (message) {
                expect(dialog.message(), `Valido que el contenido sea '${message}'`).toBe(message)
            }
            dialog.dismiss();
        });
    }
    static prompt(page: Page, response: string, message?: string) {
        page.once('dialog', dialog => {
            if (message) {
                expect(dialog.message(), `Valido que el contenido sea '${message}'`).toBe(message)
            }
            dialog.accept(response);
        });
    }
}

