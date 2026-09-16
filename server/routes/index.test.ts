import type { Express } from 'express'
import { AuditService } from '@ministryofjustice/hmpps-audit-client'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import ExampleService from '../services/exampleService'
import ExampleApiClient from '../data/exampleApiClient'
import { Page } from '.'
import createUserToken from '../testutils/createUserToken'
import USER_ROLES from '../constants/auth'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../services/exampleService')

const auditService = new AuditService({} as never) as jest.Mocked<AuditService>
const exampleService = new ExampleService({} as ExampleApiClient) as jest.Mocked<ExampleService>

let app: Express

const authedAdminUser = {
  ...user,
  token: createUserToken([
    `ROLE_${USER_ROLES.BANK_ADMIN}`,
    `ROLE_${USER_ROLES.CASHBOOK}`,
    `ROLE_${USER_ROLES.NOMS_OPS}`,
  ]),
  userRoles: [USER_ROLES.BANK_ADMIN, USER_ROLES.CASHBOOK, USER_ROLES.NOMS_OPS],
}
beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      exampleService,
    },
    userSupplier: () => authedAdminUser,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    auditService.logPageView.mockResolvedValue(undefined)
    exampleService.getCurrentTime.mockResolvedValue('2025-01-01T12:00:00.000')

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Applications')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.HOME_DASHBOARD, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
