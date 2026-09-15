import { appWithAllRoutes } from '../testutils/appSetup'
import testRoleGatedRoute from '../testutils/testRoleGatedRoute'
import USER_ROLES from '../../constants/auth'

describe('GET /nomsops', () => {
  testRoleGatedRoute(userSupplier => appWithAllRoutes({ userSupplier }), '/nomsops', USER_ROLES.NOMS_OPS, [
    USER_ROLES.CASHBOOK,
    USER_ROLES.BANK_ADMIN,
  ])
})
