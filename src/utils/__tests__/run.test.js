import run from '../run'

it('run a command and returns its output', () => {
  expect(run('echo', ['toto'])).toBe('toto')
})

it('properly escapes arguments', () => {
  const commitMessage = `feat(seoblock): add "search for more" tip in default select options`
  expect(run('printf', ['[%s]', commitMessage])).toBe(
    '[feat(seoblock): add "search for more" tip in default select options]'
  )
})

it('passes optional ENV variables to the process', () => {
  expect(run('sh', ['-c', 'echo $VAR'], { VAR: 'toto' })).toBe('toto')
})
