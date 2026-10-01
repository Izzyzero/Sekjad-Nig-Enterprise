import assert from 'node:assert/strict'
import test from 'node:test'
import { previewApi, productPreviewService } from './product-preview.service.js'
import { api, setAccessToken } from './api.js'

test('both previews use parameter-free public requests and preserve backend order and card fields', async () => {
  setAccessToken('signed-in-token')
  const records = Array.from({ length: 6 }, (_, index) => ({
    _id: `product-${index}`, title: `Fabric ${index}`, slug: `fabric-${index}`,
    price: 100, compareAtPrice: 150, currency: 'NGN',
    image: { url: `/image-${index}.jpg`, altText: `Fabric sample ${index}` }, isFeatured: true,
  }))
  const paths = []
  previewApi.defaults.adapter = async (config) => {
    paths.push(config.url)
    assert.equal(config.params, undefined)
    assert.equal(config.headers.Authorization, undefined)
    assert.ok(!config.withCredentials)
    return { config, status: 200, headers: {}, data: { success: true, data: records } }
  }
  for (const load of [productPreviewService.featured, productPreviewService.latest]) {
    const products = await load()
    assert.deepEqual(products.map((product) => product.id), records.map((product) => product._id))
    assert.equal(products[0].image, '/image-0.jpg')
    assert.equal(products[0].imageAlt, 'Fabric sample 0')
    assert.equal(products[0].name, 'Fabric 0')
    assert.equal(products[0].compareAtPrice, 150)
    assert.equal(products[0].currency, 'NGN')
  }
  assert.deepEqual(paths, ['/products/preview/featured', '/products/preview/latest'])
  setAccessToken(null)
})

test('empty previews stay empty and denied previews never refresh the session', async () => {
  previewApi.defaults.adapter = async (config) => ({ config, status: 200, headers: {}, data: { success: true, data: [] } })
  assert.deepEqual(await productPreviewService.latest(), [])
  let protectedRequests = 0
  api.defaults.adapter = async () => { protectedRequests += 1; throw new Error('Unexpected protected request') }
  previewApi.defaults.adapter = async (config) => { throw { config, response: { status: 401 } } }
  await assert.rejects(productPreviewService.featured())
  assert.equal(protectedRequests, 0)
})
