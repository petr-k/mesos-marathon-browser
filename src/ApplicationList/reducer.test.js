import reducer from './reducer'

it('should apply loaded Docker image metadata', () => {
  const appA = getApp('a', 'image-name-a')
  const appB = getApp('b')
  const appC = getApp('c', 'image-name-c')

  const state = {
    apps: {
      [appA.definition.id]: appA,
      [appB.definition.id]: appB,
      [appC.definition.id]: appC,
    },
    visibleApps: [appA, appB, appC],
  }

  const action = {
    type: 'LoadImageMetadata',
    results: {
      'image-name-a': {
        labels: {
          x: 1,
          y: 2,
        }
      },
      'image-name-c': null,
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
          },
          loadError: false,
          isLoading: false,
        }
      },
      c: {
        imageMetadata: {
          labels: {},
          loadError: true,
          isLoading: false,
        },
      }
    }
  })

  expect(actual.apps.b).toEqual(state.apps.b) // leave unrelated app objects untouched
  expect(actual.visibleApps[0]).toBe(actual.apps.a)
  expect(actual.visibleApps[1]).toBe(actual.apps.b)
})

function getApp(id, image = null) {
  return {
    definition: {
      id,
      container: image
        ? {
          type: 'DOCKER',
          docker: {
            image,
          },
        }
        : null,
    }
  }
}
