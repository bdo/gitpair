import run from '../run'

it('run a command and returns its output', () => {
  expect(run('echo', ['toto'])).toEqual('toto')
})

it('properly escapes arguments', () => {
  const commitMessage = `feat(seoblock): add "search for more" tip in default select options`
  expect(run('printf', ['[%s]', commitMessage])).toEqual(
    '[feat(seoblock): add "search for more" tip in default select options]'
  )
})

it('passes optional ENV variables to the process', () => {
  expect(run('sh', ['-c', 'echo $VAR'], { VAR: 'toto' })).toEqual('toto')
})
