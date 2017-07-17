import reducer from './reducer'


it('should apply loaded Docker image metadata', () => {
  const appA = {
    definition: {
      id: 'a',
      container: {
        type: 'DOCKER',
        docker: {
          image: 'image-name-a'
        }
      }
    },
  }
  const appB = {
    definition: {
      id: 'b'
    }
  }
  const state = {
    apps: {
      a: appA,
      b: appB,
    },
    visibleApps: [appA, appB],
  }

  const action = {
    type: 'LoadImageMetadata',
    results: {
      'image-name-a': {
        labels: {
          x: 1,
          y: 2,
        }
      }
    }
  }

  const actual = reducer(state, action)

  expect(actual).toMatchObject({
    apps: {
      a: {
        imageMetadata: {
          labels: {
            x: 1,
            y: 2
          }
        }
      }
    }
  })

  expect(actual.apps.b).toEqual(state.apps.b) // leave unrelated app objects untouched
  expect(actual.visibleApps[0]).toBe(actual.apps.a)
  expect(actual.visibleApps[1]).toBe(actual.apps.b)
})
