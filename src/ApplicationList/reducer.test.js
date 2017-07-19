import reducer from './reducer'

it('should apply loaded Docker image metadata', () => {
  const appA = appMother.get('a', 'image-name-a')
  const appB = appMother.get('b')
  const appC = appMother.get('c', 'image-name-c')

  const state = stateMother.get([appA, appB, appC])

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

it('should remove apps when they are not present in newly loaded list', () => {
  const appA = appMother.get('a', 'image-name-a')
  const appB = appMother.get('b')

  const state = stateMother.get([appA, appB])

  const action = {
    type: 'LoadApplications',
    response: {
      apps: [
        {
          id: 'a',
          instances: 2,
        }
      ]
    }
  }

  const actual = reducer(state, action)
  expect(actual.apps).not.toHaveProperty('b')
})

const appMother = {
  get(id, image = null) {
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
}

const stateMother = {
  get(apps) {
    return {
      apps: Object.assign(...apps.map(a => ({ [a.definition.id]: a }))),
      visibleApps: apps,
    }
  }
}