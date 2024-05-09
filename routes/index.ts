import { Elysia } from 'elysia';
import { controllers } from '../controllers';

// ----------------------------------
const apiRoutes = new Elysia().post('/api', () => 'Hello API');

// ----------------------------------
const tvRoutes = new Elysia().post('/tv/:keyId', controllers.tv);

// ----------------------------------
export const routes = new Elysia()
  .get('/', () => 'hi')
  .use(apiRoutes)
  .use(tvRoutes)
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return 'Not Found :(';
    }
    return new Response(error.toString());
  });
