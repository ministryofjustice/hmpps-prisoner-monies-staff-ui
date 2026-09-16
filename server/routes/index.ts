import { Router } from 'express'
import cashbookRoutes from './cashbook'
import bankadminRoutes from './bankadmin'
import nomsopsRoutes from './nomsops'
import type { Services } from '../services'
import auditSearchRequest from '../middleware/auditSearchRequest'
import USER_ROLES from '../constants/auth'
import config from '../config'

export enum Page {
  HOME_DASHBOARD = 'HOME_DASHBOARD',

  SEARCH_OFFENDERS = 'SEARCH_OFFENDERS',
}

function buildCardList(showCashbook: boolean, showBankAdmin: boolean, showNomsOps: boolean) {
  const cards = []
  if (showCashbook) {
    cards.push({
      href: '/cashbook',
      heading: 'Cashbook',
      description: 'Manage cashbook entries',
      id: 'cashbook',
    })
  }
  if (showBankAdmin) {
    cards.push({
      href: '/bankadmin',
      heading: 'Bank Admin',
      description: 'Manage bank administration tasks',
      id: 'bankadmin',
    })
  }
  if (showNomsOps) {
    cards.push({
      href: '/nomsops',
      heading: 'NOMS Ops',
      description: 'Manage NOMS Ops tasks',
      id: 'nomsops',
    })
  }
  return cards
}

export default function routes(services: Services): Router {
  const { auditService } = services
  const router = Router()

  router.get('/', async (req, res, _next) => {
    await auditService.logPageView(Page.HOME_DASHBOARD, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    /*
    Check if this User has the relevant roles to show the corresponding cards for a service
    */
    let showCashbook = res.locals.user.userRoles.includes(USER_ROLES.CASHBOOK)
    let showBankAdmin = res.locals.user.userRoles.includes(USER_ROLES.BANK_ADMIN)
    let showNomsOps = res.locals.user.userRoles.includes(USER_ROLES.NOMS_OPS)

    // for development purposes, if the local user has access to all services, show all cards
    if (config.localUserAccessAllServices) {
      showCashbook = true
      showBankAdmin = true
      showNomsOps = true
    }

    const tileCards = buildCardList(showCashbook, showBankAdmin, showNomsOps)

    return res.render('pages/index', { cards: tileCards })
  })

  // Example of an audited route.
  router.post(
    '/perform-search',
    auditSearchRequest({ services, page: Page.SEARCH_OFFENDERS }),
    async (_req, res, _next) => {
      return res.redirect('/')
    },
  )

  router.use('/cashbook', cashbookRoutes(services))
  router.use('/bankadmin', bankadminRoutes(services))
  router.use('/nomsops', nomsopsRoutes(services))
  return router
}
