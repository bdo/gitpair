import stripCoAuthorship from '../strip-co-authorship'

it('strips a co-authored-by trailer message', () => {
  const commitMsg = `Commit message 1

Co-authored-by: marry@peterpaulandmarry.com`
  expect(stripCoAuthorship(commitMsg)).toBe('Commit message 1')
})

it('strips multiple co-authored-by trailer messages', () => {
  const commitMsg = `Commit message 2

Co-authored-by: marry@peterpaulandmarry.com
Co-authored-by: paul@peterpaulandmarry.com`
  expect(stripCoAuthorship(commitMsg)).toBe('Commit message 2')
})

it('does not remove any other git trailer messages', () => {
  const commitMsg = `Commit message 3

Signed-off-by: Peter <peter@peterpaulandmarry.com>
Acked-by: Marry <marry@peterpaulandmarry.com>`
  expect(stripCoAuthorship(commitMsg)).toBe(commitMsg)
})

it('strips a co-authored-by trailer message in the middle of other trailers', () => {
  const commitMsg = `Commit message 4

Signed-off-by: Peter <peter@peterpaulandmarry.com>
Co-authored-by: paul@peterpaulandmarry.com
Acked-by: Marry <marry@peterpaulandmarry.com>`
  expect(stripCoAuthorship(commitMsg)).toBe(`Commit message 4

Signed-off-by: Peter <peter@peterpaulandmarry.com>
Acked-by: Marry <marry@peterpaulandmarry.com>`)
})
