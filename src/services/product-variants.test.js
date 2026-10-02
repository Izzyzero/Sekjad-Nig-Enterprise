import assert from 'node:assert/strict'
import test from 'node:test'
import { api, setAccessToken } from './api.js'
import { createProduct, getProduct, isVariantAvailable, normalizeProduct, updateProduct } from './product.service.js'

test('product details normalize only explicit backend variants and their image snapshots', () => {
  const product = normalizeProduct({
    _id: 'fabric-1',
    title: 'Fabric',
    gallery: [{ url: 'gallery-only.jpg' }],
    variants: [{
      variantId: 'red-id',
      colorName: 'Red',
      image: { url: 'red.jpg', altText: 'Red fabric' },
      isAvailable: true,
    }],
  })
  assert.equal(product.id, 'fabric-1')
  assert.deepEqual(product.variants, [{
    variantId: 'red-id',
    colorName: 'Red',
    image: { url: 'red.jpg', altText: 'Red fabric' },
    isAvailable: true,
  }])
  assert.deepEqual(product.gallery, ['gallery-only.jpg'])
  assert.equal(product.variants.length, 1)
})

test('product details request receives variants from the documented product endpoint', async () => {
  const previousAdapter = api.defaults.adapter
  setAccessToken('product-test-token')
  api.defaults.adapter = async (config) => ({
    config,
    status: 200,
    headers: {},
    data: { data: { _id: 'fabric/1', title: 'Fabric', variants: [{ variantId: 'blue-id', colorName: 'Blue', image: { url: 'blue.jpg' }, isAvailable: false }] } },
  })
  try {
    const product = await getProduct('fabric/1')
    assert.equal(product.variants[0].variantId, 'blue-id')
    assert.equal(product.variants[0].isAvailable, false)
  } finally {
    api.defaults.adapter = previousAdapter
    setAccessToken(null)
  }
})

test('admin create and update submit the complete variant array as multipart JSON', async () => {
  const previousAdapter = api.defaults.adapter
  const requests = []
  api.defaults.adapter = async (config) => {
    requests.push(config)
    return { config, status: 200, headers: {}, data: { success: true } }
  }
  const variants = [
    { variantId: 'existing-red', colorName: 'Red', image: { url: 'red.jpg', altText: 'Red' }, isAvailable: true },
    { colorName: 'Blue', image: { url: 'blue.jpg', altText: 'Blue' }, isAvailable: false },
  ]
  try {
    await createProduct({ title: 'Fabric', variants, gallery: [] })
    await updateProduct('fabric-1', { title: 'Fabric', variants, gallery: [] })
    assert.equal(requests[0].url, '/products')
    assert.equal(requests[0].method, 'post')
    assert.equal(requests[1].url, '/products/fabric-1')
    assert.equal(requests[1].method, 'patch')
    for (const request of requests) {
      assert.deepEqual(JSON.parse(request.data.get('variants')), variants)
      assert.deepEqual(request.data.getAll('gallery'), [])
    }
  } finally {
    api.defaults.adapter = previousAdapter
  }
})

test('variant availability controls whether a color may be selected', () => {
  const variants = [
    { variantId: 'red', colorName: 'Red', isAvailable: true },
    { variantId: 'blue', colorName: 'Blue', isAvailable: false },
  ]
  assert.equal(isVariantAvailable(variants.find((variant) => variant.variantId === 'red')), true)
  assert.equal(isVariantAvailable(variants.find((variant) => variant.variantId === 'blue')), false)
  assert.equal(isVariantAvailable(undefined), false)
  assert.equal(normalizeProduct({ variants: [] }).variants.length, 0)
})
