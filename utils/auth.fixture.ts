import { APIRequestContext, test as base } from '@playwright/test';
import usuarios from '../playwright/.auth/usuarios.json';
export { expect } from '@playwright/test';

class LoginResponse {
  success = false;
  token_type: string = 'Bearer';
  access_token: string = '';
  refresh_token: string = '';
  name: string = '';
  roles: string[] = [];
  expires_in: number = 0;
}

let auth: LoginResponse;

async function login(request: APIRequestContext, index = 1) {
    const response = await request.post('/api/login', {
        headers: { "content-type": "application/json" },
        data: { username: usuarios[index].idUsuario, password: usuarios[index].password }
    })
    if(response.ok()){
        auth = await response.json()
    } else {
        throw new Error('Error de autenticación')
    }
}

type AuthFixture = {
    authToken: string;
    authHeader: Record<string, string>;
};
export const test = base.extend<AuthFixture>({
    authToken: async ({ request }, use) => { 
        if(!auth)
            await login(request)
        use(`${auth.token_type} ${auth.access_token}`)
    },
    authHeader: async ({ request }, use) => { 
        if(!auth)
            await login(request)
        use({ Authorization: `${auth.token_type} ${auth.access_token}`})
    },
});
