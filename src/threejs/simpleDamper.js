export class SimpleDamper {
  constructor(initialValue, damping, onChange) {
    this._value = initialValue || 0
    this._target = initialValue || 0
    this.damping = damping || 0.1
    this.onChange = onChange || null
    this.onStart = null
    this.onComplete = null
  }

  set value(target) {
    this._velocity = 0
    this._target = target
    this.update()
    if (this.onStart) this.onStart()
  }

  get value() {
    return this._value
  }

  update() {
    if (Math.abs(this._target - this._value) > 0.001) {
      const speed = this.damping * Math.pow(this._velocity, 2)

      this._value += (this._target - this._value) * speed
      this._velocity = Math.min(this._velocity + 0.1, 1)

      if (this.onChange) {
        this.onChange(this._value)
      }

      requestAnimationFrame(() => {
        this.update()
      })
    } else {
      this._value = this._target

      if (this.onChange) {
        this.onChange(this._value)
      }
      if (this.onComplete) this.onComplete()
    }
  }
}
