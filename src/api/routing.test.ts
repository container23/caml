import { setupRoutes } from './routing';
import { Server } from './utils';

describe('API Routes Registration', () => {
  const expectedRoutes = [
    {
      path: '/',
      reqType: 'get',
    },
    {
      path: '/discord/interactions',
      reqType: 'post',
    },
    {
      path: '/aml/search',
      reqType: 'get',
    },
  ];

  const registeredRoutes: Record<string, string> = {};

  const mockAppServer = {
    get: (route: string) => (registeredRoutes[route] = 'get'),
    post: (route: string) => (registeredRoutes[route] = 'post'),
    put: (route: string) => (registeredRoutes[route] = 'put'),
  } as unknown as Server;

  setupRoutes(mockAppServer);

  expectedRoutes.forEach((r) => {
    test(`should register route: ${r.reqType} ${r.path}`, () => {
      const routeReqType = registeredRoutes[r.path];
      expect(routeReqType).toBeDefined();
      expect(routeReqType).toEqual(r.reqType);
    });
  });
});
