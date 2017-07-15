import matcher from './appMatcher'

const apps = [
  {
    definition: {
      id: '/autoscaler'
    }
  },
  {
    definition: {
      id: '/avg/avast-manuallyclassify'
    }
  },
  {
    definition: {
      id: '/idp/file-extractor'
    }
  },
]

describe('matcher', () => {
  it('should match multiple words', () => {
    const actual = matcher(apps, 'file ex')
    expect(actual.map(a => a.definition.id)).toEqual(['/idp/file-extractor'])
  })
})
