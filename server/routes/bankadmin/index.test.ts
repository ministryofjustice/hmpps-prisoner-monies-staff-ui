import { appWithAllRoutes } from '../testutils/appSetup'
import testRoleGatedRoute from '../testutils/testRoleGatedRoute'
import USER_ROLES from '../../constants/auth'

describe('GET /bankadmin', () => {
  testRoleGatedRoute(userSupplier => appWithAllRoutes({ userSupplier }), '/bankadmin', USER_ROLES.BANK_ADMIN, [
    USER_ROLES.CASHBOOK,
    USER_ROLES.NOMS_OPS,
  ])
})
