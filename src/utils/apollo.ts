import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { useMemo } from 'react'

let apolloClient: ApolloClient<NormalizedCacheObject>

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', //that defines if are server or client
    link: new HttpLink({ uri: 'http://localhost:1337/graphql' }), //if was only uri only accepts http. and not isomorphic links
    cache: new InMemoryCache()
  })
}

export function initializeApollo(initialState = {}) {
  //if apolloclient is initialized, will not initialize again. and then, recover cache.
  const apolloClientGlobal = apolloClient ?? createApolloClient()

  // se a página usar o apolloClient no lado client
  // hidratamos o estado inicial aqui
  if (initialState) {
    apolloClientGlobal.cache.restore(initialState)
  }

  //always initialized with clean cache with ssr
  if (typeof window === 'undefined') return apolloClientGlobal
  // create apolloClient if is client side
  apolloClient = apolloClient ?? apolloClientGlobal

  return apolloClient
}

export function useApollo(initialState = {}) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
