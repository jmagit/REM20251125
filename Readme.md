# Curso de Playwright

## Instalaciones

- Node.js LTS (Alternativas)
  - [Node.js](https://nodejs.org/es)
  - [NVM for Windows](https://github.com/coreybutler/nvm-windows/releases)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [Git](https://git-scm.com/)

### CI (opcional)

#### GitHub Actions

- Cuenta GitHub

#### Docker Desktop

- [WSL 2 feature on Windows](https://learn.microsoft.com/es-es/windows/wsl/install)
- [Docker Desktop](https://www.docker.com/get-started/)

#### Alternativas a Docker Desktop

- [Podman](https://podman.io/docs/installation)
- [Rancher Desktop](https://rancherdesktop.io/)

#### Configuración de puertos dinámicos en Windows (como administrador)

    netsh int ipv4 set dynamic tcp start=51000 num=14536

### Contenedores

#### Web para pruebas

    docker run -d --name web-for-testing -p 8181:8181 jamarton/web-for-testing

## Documentación

- [Playwright](https://playwright.dev/)

## Sitios web para practicar pruebas E2E

- [Web4Testing](https://github.com/jmagit/Web4Testing)
- [Practice Software Testing](https://practicesoftwaretesting.com/)
- [OpenCart](https://opencart.abstracta.us/)
- [Sauce Demo](https://www.saucedemo.com/)

## Creación del proyecto

Para crear un proyecto denominado `appName` (cambiar al nombre real):

    npm init playwright@latest appName
    √ Do you want to use TypeScript or JavaScript? · TypeScript
    √ Where to put your end-to-end tests? · tests
    √ Add a GitHub Actions workflow? (Y/n) · true
    √ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true

    cd appName
    npm install eslint typescript-eslint eslint-plugin-playwright @eslint/js globals --save-dev

Copiar en el directorio del proyecto los ficheros [eslint.config.mjs](https://github.com/jmagit/REM20251125/blob/main/eslint.config.mjs) y [tsconfig.json](https://github.com/jmagit/REM20251125/blob/main/tsconfig.json).

Editar el fichero package.json y sustituir la linea 6 (`"scripts": {},`) por:

``` json
    "scripts": {
      "test": "playwright test",
      "e2e": "playwright test",
      "e2e:report": "playwright show-report",
      "e2e:dev": "playwright test --project=chromium --ui",
      "e2e:chrome": "playwright test --project=chromium",
      "e2e:headed": "playwright test --headed",
      "lint": "eslint tests",
      "lint:fix": "eslint tests --fix"
    },
```
