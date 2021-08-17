function myNew() {
    const Constructor = Array.prototype.shift.call(arguments)
    const obj = Object.create(Constructor.prototype)

    const res = Constructor.apply(obj, arguments)
    return typeof res === 'object' ? res : obj
}