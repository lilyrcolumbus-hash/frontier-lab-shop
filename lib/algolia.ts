import algoliasearch from 'algoliasearch'

export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
)

export const speciesIndex = algoliaClient.initIndex('species')
export const productsIndex = algoliaClient.initIndex('products')
