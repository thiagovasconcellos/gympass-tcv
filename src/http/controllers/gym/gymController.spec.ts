import request from 'supertest'
import { app } from '@/app'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createUserAndAuthenticate } from '@/helpers/createUserAndAuthenticate'

describe('Gym Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get create a gym', async () => {
    const { token } = await createUserAndAuthenticate(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Awesome Gym',
        description: 'Some description',
        phone: '13997506020',
        latitude: -27.2092052,
        longitude: -49.6401091
      })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to get search for gyms', async () => {
    const { token } = await createUserAndAuthenticate(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Awesome Gym',
        description: 'Some description',
        phone: '13997506020',
        latitude: -27.2092052,
        longitude: -49.6401091
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Too Good Gym',
        description: 'Some description',
        phone: '13997506020',
        latitude: -27.2092052,
        longitude: -49.6401091
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Awesome'
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(2)
  })
})
