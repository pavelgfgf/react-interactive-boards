/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_835830827")

  // update collection data
  unmarshal({
    "name": "days_of_week"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_835830827")

  // update collection data
  unmarshal({
    "name": "days_map"
  }, collection)

  return app.save(collection)
})
