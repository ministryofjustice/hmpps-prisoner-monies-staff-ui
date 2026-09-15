import type { Express } from 'express'
import request from 'supertest'
import type { HmppsUser } from '../../interfaces/hmppsUser'
import { createUserWithRoles, unauthenticatedUser } from './appSetup'

export default function testRoleGatedRoute(
  buildApp: (userSupplier: () => HmppsUser) => Express,
  path: string,
  requiredRole: string,
  invalidRoles: string[] = [],
) {
  it(`allows access to ${path} with the required role`, () => {
    return request(buildApp(() => createUserWithRoles([requiredRole])))
      .get(path)
      .expect(200)
  })

  it(`redirects to /authError for ${path} without the required role`, () => {
    return request(buildApp(() => createUserWithRoles([])))
      .get(path)
      .expect(302)
      .expect('Location', '/authError')
  })

  it(`redirects to /sign-in for ${path} when not authenticated`, () => {
    return request(buildApp(() => unauthenticatedUser))
      .get(path)
      .expect(302)
      .expect('Location', '/sign-in')
  })
  invalidRoles.forEach(invalidRole => {
    it(`redirects to /authError for ${path} with invalid role ${invalidRole}`, () => {
      return request(buildApp(() => createUserWithRoles([invalidRole])))
        .get(path)
        .expect(302)
        .expect('Location', '/authError')
    })
  })
}
