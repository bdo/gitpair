import format from '../format'
import niceJoin from '../nice-join'

format.bold = (s) => s

it('returns element if single', () => {
  expect(niceJoin(['Peter'])).toBe('Peter')
})

it('returns empty string if empty', () => {
  expect(niceJoin([])).toBe('')
})

it("returns items separated with 'and' if double", () => {
  expect(niceJoin(['Peter', 'Paul'])).toBe('Peter and Paul')
})

it("returns items separated with command and 'and' if double", () => {
  expect(niceJoin(['Peter', 'Paul', 'Mary'])).toBe('Peter, Paul and Mary')
})
