/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580948106")

  // update collection data
  unmarshal({
    "name": "bell_schedule"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580948106")

  // update collection data
  unmarshal({
    "name": "BellSchedule"
  }, collection)

  return app.save(collection)
})
