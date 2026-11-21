import { mapWithConcurrency } from "../map-with-concurrency"

const tick = () => new Promise((resolve) => setTimeout(resolve, 1))

describe("mapWithConcurrency", () => {
  it("keeps the input order even when calls finish out of order", async () => {
    const delays = [5, 1, 3, 0, 2]

    const results = await mapWithConcurrency(delays, 2, async (delay, index) => {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return `item-${index}`
    })

    expect(results).toEqual(["item-0", "item-1", "item-2", "item-3", "item-4"])
  })

  it("never runs more than `limit` calls at once", async () => {
    let inFlight = 0
    let maxInFlight = 0

    await mapWithConcurrency(Array.from({ length: 10 }), 3, async () => {
      inFlight++
      maxInFlight = Math.max(maxInFlight, inFlight)
      await tick()
      inFlight--
    })

    expect(maxInFlight).toBe(3)
  })

  it("returns an empty array without calling fn for empty input", async () => {
    const fn = jest.fn()

    await expect(mapWithConcurrency([], 3, fn)).resolves.toEqual([])
    expect(fn).not.toHaveBeenCalled()
  })

  it("rejects when any call rejects", async () => {
    const run = mapWithConcurrency([1, 2, 3], 2, async (value) => {
      if (value === 2) {
        throw new Error("boom")
      }
      return value
    })

    await expect(run).rejects.toThrow("boom")
  })
})
