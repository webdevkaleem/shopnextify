/**
 * Queue utility to serialize cart operations and prevent race conditions
 * when multiple products are added to cart simultaneously.
 */

type QueueOperation<T> = () => Promise<T>

class CartQueue {
  private queue: Array<{
    operation: QueueOperation<unknown>
    resolve: (value: unknown) => void
    reject: (error: unknown) => void
  }> = []
  private processing = false

  async enqueue<T>(operation: QueueOperation<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        operation: operation as QueueOperation<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      })

      this.process()
    })
  }

  private async process() {
    if (this.processing || this.queue.length === 0) {
      return
    }

    this.processing = true

    while (this.queue.length > 0) {
      const item = this.queue.shift()
      if (!item) break

      try {
        const result = await item.operation()
        item.resolve(result)
      } catch (error) {
        item.reject(error)
      }
    }

    this.processing = false
  }
}

// Singleton instance
export const cartQueue = new CartQueue()
