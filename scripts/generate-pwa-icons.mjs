import sharp from 'sharp'

const source =
  'public/favicon.svg'

await sharp(source)
  .resize(96, 96)
  .png()
  .toFile(
    'public/icon-96.png'
  )

await sharp(source)
  .resize(192, 192)
  .png()
  .toFile(
    'public/icon-192.png'
  )

await sharp(source)
  .resize(512, 512)
  .png()
  .toFile(
    'public/icon-512.png'
  )

await sharp(source)
  .resize(400, 400)
  .extend({
    top: 56,
    bottom: 56,
    left: 56,
    right: 56,
    background: '#090c13'
  })
  .png()
  .toFile(
    'public/icon-512-maskable.png'
  )

console.log(
  '✓ PWA icons generated'
)