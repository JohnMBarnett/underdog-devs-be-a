const request = require('supertest');
const express = require('express');
const db = require('../../data/db-config');
const actionsRouter = require('../../api/actions/actionsRouter');
const handleError = require('../../api/middleware/handleError');

// Reset Test Database Before/After Tests

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => await db.seed.run());

afterAll(async () => await db.destroy());

// Declare Test API

const app = express();
app.use(express.json());
app.use('/actions', actionsRouter);
app.use(handleError);

// Declare Tests

describe('Sanity Checks', () => {
  test('matchers are working', () => {
    expect(true).toBe(true);
    expect(20 - 5).toBe(15);
    expect(9 + 10).not.toEqual(21);
  });

  test('test environment is being used', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});

describe('Actions Router', () => {
  describe('[GET] /actions', () => {
    let res;
    beforeAll(async () => {
      res = await request(app).get('/actions');
    });

    it('responds with status 200', () => {
      const expected = 200;
      const actual = res.status;

      expect(actual).toBe(expected);
    });

    it('returns list of action tickets', () => {
      const expected = [
        {
          action_ticket_id: 1,
          comments: null,
          issue: 'Spencer missed his 2nd weekly session, may be dropped?',
          pending: true,
          resolved: false,
          strike: true,
          subject_id: '10',
          submitted_by: '7',
        },
        {
          action_ticket_id: 2,
          comments: null,
          issue:
            "My mentor isn't really helping me learn, could I seek reassignment?",
          pending: true,
          resolved: false,
          strike: false,
          subject_id: '00u13oned0U8XP8Mb4x7',
          submitted_by: '11',
        },
        {
          action_ticket_id: 3,
          comments: null,
          issue:
            'Mentee and I have not been getting along, I suggest a reassignment for best outcome.',
          pending: true,
          resolved: false,
          strike: false,
          subject_id: '11',
          submitted_by: '00u13oned0U8XP8Mb4x7',
        },
        {
          action_ticket_id: 4,
          comments: null,
          issue: 'Has not turned in their assignments.',
          pending: true,
          resolved: false,
          strike: true,
          subject_id: '12',
          submitted_by: '9',
        },
      ];
      const actual = res.body;

      expect(actual).toMatchObject(expected);
    });
  });

  describe('[GET] /actions/:id', () => {
    describe('success', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).get('/actions/1');
      });

      it('responds with status 200', () => {
        const expected = 200;
        const actual = res.status;

        expect(actual).toBe(expected);
      });

      it('returns action ticket', () => {
        const expected = {
          action_ticket_id: 1,
          comments: null,
          issue: 'Spencer missed his 2nd weekly session, may be dropped?',
          pending: true,
          resolved: false,
          strike: true,
          subject_id: '10',
          submitted_by: '7',
        };
        const actual = res.body;

        expect(actual).toMatchObject(expected);
      });
    });

    describe('failure', () => {
      describe('invalid id', () => {
        let res;
        beforeAll(async () => {
          res = await request(app).get('/actions/987654321');
        });

        it('responds with status 404', () => {
          const expected = 404;
          const actual = res.status;

          expect(actual).toBe(expected);
        });

        it('returns message "action ticket id not found"', () => {
          const expected = /action ticket id not found/i;
          const actual = res.body.message;

          expect(actual).toMatch(expected);
        });
      });
    });
  });

  describe('[POST] /actions', () => {
    describe('success', () => {
      const validNewAction = {
        submitted_by: '7',
        subject_id: '10',
        issue: 'Test Issue',
      };
      let res;

      beforeAll(async () => {
        res = await request(app)
          .post('/actions')
          .send({ ...validNewAction });
      });

      it('responds with status 201', () => {
        const expected = 201;
        const actual = res.status;

        expect(actual).toBe(expected);
      });

      it('returns success message', () => {
        const expected = /success/i;
        const actual = res.body.message;

        expect(actual).toMatch(expected);
      });

      it('returns newly created action ticket', () => {
        const expected = { ...validNewAction };
        const actual = res.body.action;

        expect(actual).toMatchObject(expected);
      });
    });
  });

  describe('[PUT] /actions', () => {
    describe('success', () => {
      const validActionUpdate = {
        issue: 'Updated Test Issue',
        pending: false,
        resolved: true,
      };
      let res;

      beforeAll(async () => {
        res = await request(app)
          .put('/actions/4')
          .send({ ...validActionUpdate });
      });

      it('responds with status 200', () => {
        const expected = 200;
        const actual = res.status;

        expect(actual).toBe(expected);
      });

      it('returns requested edits', () => {
        const expected = { ...validActionUpdate };
        const actual = res.body.changes;

        expect(actual).toMatchObject(expected);
      });
    });
  });
});
