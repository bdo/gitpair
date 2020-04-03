import niceJoin from '../nice-join'

jest.mock('chalk', () => ({
  bold: (s) => s,
}))

it('returns element if single', () => {
  expect(niceJoin(['Peter'])).toEqual('Peter')
})

it('returns empty string if empty', () => {
  expect(niceJoin([])).toEqual('')
})

it("returns items separated with 'and' if double", () => {
  expect(niceJoin(['Peter', 'Paul'])).toEqual('Peter and Paul')
})

it("returns items separated with command and 'and' if double", () => {
  expect(niceJoin(['Peter', 'Paul', 'Mary'])).toEqual('Peter, Paul and Mary')
})
