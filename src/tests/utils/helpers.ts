import supertest from 'supertest';
import { expect } from 'chai';
import { v4 as uuid } from 'uuid';
import { getJWT } from './constants';
import * as _ from 'lodash';
import server from '../../server';
import db from '../../services/db/db';
export const constants = {
  BASE_URL: `${process.env.BASE_URL}:${process.env.PORT}/rest`
};

function clone<T> (obj: T) : T{
  return JSON.parse(JSON.stringify(obj));
}

const api = supertest(server);

export function testRequiredField (method, url, field, data, role?) {
  it(`should return ${field} is required if not provided`, (done) => {
    let temp = Object.assign({}, data);
    delete temp[field];
    api[method](url)
    .set('Authorization', `Bearer ${getJWT(role)}`)
      .send(temp)
      .expect(422)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0].keyword).eq('required');
        expect(res.body.data[0].message.indexOf(field) > -1).eq(true);
        done();
      });
  });
}

export function testFieldValidation (method, url, field, data, invalidData, role?) {
  it(`should return validation error for invalid ${field}`, (done) => {
    let temp = clone(data);
    if (typeof invalidData === 'function') {
      temp = invalidData(temp);
    } else {
      _.set(temp, field, invalidData);
    }
    api[method](url)
      .set('Authorization', `Bearer ${getJWT(role)}`)
      .send(temp)
      .expect(422)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0].dataPath.indexOf(field) > -1).eq(true);
        done();
      });
  });

}

export function testAuthentication (method, url, data) {
  it('authentication should fail without jwt', (done) => {
    api[method](url)
      .send(data)
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eq('authentication_failed');
        done();
      });
  });
}

export async function testRouteExists (method, url, status?) {
  status = status ? status : 422;
  it('route should exist', (done) => {
    api[method](url)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect (res.status).not.eq(404);
        done();
      });
  });
}

export async function testRequest (route, method = 'get', body = {}) {
  await api[method](route)
  .send(body)
  .expect(200);
}

export async function testPost (route, body) {
  const response = await api.post(route)
  .send(body)
  .expect(200);

  expect(response.body).to.haveOwnProperty('data');
  return response.body.data;
}

export async function testAddEntity (route, body, role?) {
  const response = await api.post(route)
  .set('Authorization', `Bearer ${getJWT(role)}`)
  .send(body)
  .expect(200);

  expect(response.body).to.haveOwnProperty('data');
  return response.body.data;
}
export async function testEditEntity (route, body, role) {
  const response = await api.put(route)
  .set('Authorization', `Bearer ${getJWT(role)}`)
  .send(body)
  .expect(200);

  expect(response.body).to.haveOwnProperty('data');
  return response;
}
export async function testGetEntity (route, role) {
  const response = await api.get(route)
  .set('Authorization', `Bearer ${getJWT(role)}`)
  .expect(200);

  expect(response.body).to.haveOwnProperty('data');
  return response.body.data;
}
export async function testDeleteEntity (route, role) {
  const response = await api.delete(route)
  .set('Authorization', `Bearer ${getJWT(role)}`)
  .expect(204);
}


export async function truncateTables (...tables) {
  await db.runQuery(`truncate ${tables} cascade`);
}
