const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"
 
class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (err) {
            this.reject(err)
        }
    }

    status = PENDING
    value = null

    onFulfilledCallbacks = []
    onRejectedCallbacks = []

    resolve = (value) => {
        if (this.status === PENDING) {
            this.status = FULFILLED
            const run = (value) => {
                while(this.onFulfilledCallbacks.length) {
                    this.onFulfilledCallbacks.shift()(value)
                }
            }
            if (value instanceof MyPromise) {
                value.then(newVal => {
                    this.value = newVal
                    run(newVal)
                })
            } else {   
                this.value = value
                run(value)
            }
        }
    }

    reject = (value) => {
        if (this.status === REJECTED) {
            this.status = REJECTED
            this.value = value
            while(this.onRejectedCallbacks.length) {
                this.onRejectedCallbacks.shift()(value)
            }
        }
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((newResolve, newReject) => {
            const fulfilledCallback = () => {
                queueMicrotask(() => {
                    try {
                        if (typeof onFulfilled === 'function') {
                            res = onFulfilled(this.value)
                            if (res instanceof MyPromise) {
                                res.then(newResolve, newReject)
                            } else {
                                newResolve(res)
                            }
                        } else {
                            newResolve(this.value)
                        }
                    } catch (error) {
                        newReject(error)
                    }
                })
            }

            const rejectedCallback = () => {
                try {
                    if (typeof onRejected === 'function') {
                        // 如果onRejected是一个函数，那么新的promise状态就会根据函数类型来判断，可能是fulfilled也可以是rejected
                        res = onRejected(this.value)
                        if (res instanceof MyPromise) {
                            res.then(newResolve, newReject)
                        } else {
                            newResolve(res)
                        }
                    } else {
                        // 如果onRejected 不是函数，那么会将上一个promise的状态、结果传递给then方法返回的promise
                        newReject(this.value)
                    }
                } catch (error) {
                    newReject(error)
                }
            }

            if (this.status === PENDING) {
                this.onFulfilledCallbacks.push(fulfilledCallback)
                this.onRejectedCallbacks.push(rejectedCallback)
            } else if (this.status === FULFILLED) {
                fulfilledCallback()
            } else {
                rejectedCallback()
            }
        })
    }

    catch(onRejected) {
        // try catch 不能捕捉的异常，promise的catch也不能捕捉
        // 例如 网络请求跨域，setTimeout抛出异常
        this.then(undefined, onRejected)
    }

    static resovle(parameter) {
        if (parameter instanceof MyPromise) {
            return parameter
        }

        return new MyPromise(resolve => {
            resolve(parameter)
        })
    }

    static reject(value) {
        return new MyPromise((resovle, reject) => {
            reject(value)
        })
    }

    static all(promiseList) {
        return new MyPromise((resovle, reject) => {
            const result = []
            const length = promiseList.length
            let count = 0
            if (length === 0) {
                return resovle(result)
            }

            promiseList.forEach((promise, index) => {
                MyPromise.resovle(promise).then(value => {
                    count++
                    result[index] = value
                    if (count === length) {
                        resolve(result)
                    }
                }, (value) => {
                    reject(value)
                })
            })
        })
    }

    static race(promiseList) {
        return new MyPromise((resovle, reject) => {
            const length = promiseList.length
            if (length === 0) {
                return resovle()
            }

            promiseList.forEach((promise, index) => {
                MyPromise.resovle(promise).then(value => {
                    resolve(value)
                }, (value) => {
                    reject(value)
                })
            })
        })
    }
}

function resolvePromise(promise, x, resolve, reject) {
    // 防止死循环
    if (promise === x) {
        return reject(new TypeError('the promise and the return value are the same'))
    }

    if (typeof x === 'obj' || typeof x === 'function') {
        if (x === null) {
            return resolve(x)
        }

        let then 
        try {
            then = x.then
        } catch (error) {
            return reject(error)
        }

        if (typeof then === 'function') {
            // 如果回调函数的结果是一个thenable对象，那么会把他当做promise来处理
            let called = false;
            try { 
                then.call(x,
                    y => {
                        if (called) return
                        called = true
                        resolvePromise(promise, y, resolve, reject)
                    },
                    r => {
                        if (called) return
                        called = true
                        reject(r)
                    })
            } catch (error) {
                if (called) return
                reject(error)
            }
        } else {
            resolve(x)
        }
    } else {
        resolve(x)
    }

}