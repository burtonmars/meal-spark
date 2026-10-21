import { jest } from '@jest/globals'

export const useRouter = jest.fn().mockReturnValue({
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
})
