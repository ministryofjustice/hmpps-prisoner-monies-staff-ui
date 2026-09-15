import { Router } from 'express'
import type { Services } from '../../services'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import USER_ROLES from '../../constants/auth'

export default function bankadminRoutes(_services: Services): Router {
  const router = Router()
  router.use(authorisationMiddleware([USER_ROLES.BANK_ADMIN]))

  router.get('/', async (_req, res) => res.render('pages/bankadmin/index'))

  return router
}
