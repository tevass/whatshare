export class Time {
  static async delay(ms: number = 150) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
