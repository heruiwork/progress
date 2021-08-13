// 冒泡
function bubble(arr) {
    let length = arr.length
    if (length <= 1) return arr
    for(let i = 0; i < length; i++) {
        let flag = false
        for(let j = 0; j < length - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                let temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
                flag = true
            }
        }
        if (!flag) break
    }
    return arr
}
bubble([4,2,5,3,6,9,1,7])

// 选择
function select(arr) {
    let length = arr.length
    if (length <= 1) return arr
    let part = 0
    let min = part
    for (let i = 0; i < length; i++) {
        for(let j = part; j < length; j++) {
            if (arr[j] < arr[min]) {
                min = j
            }
        }
        let temp = arr[min]
        arr[min] = arr[part]
        arr[part] = temp
        part++
        min = part
    }
    return arr
}
select([4,2,5,3,6,9,1,7])

// 插入
function insert(arr) {
    let length = arr.length
    if (length <= 1) return arr

    for(let i = 1; i < length; i++) {
        let value = arr[i]
        let j = i - 1
        for (; j >= 0; j--) {
            if (arr[j] > value) {
                arr[j+1] = arr[j]
            } else {
                break
            }
        }
        arr[j+1] = value
    }
    return arr
}
insert([4,2,5,3,6,9,1,7])

//归并
function mergeSort(arr) {
    function sort(arr, start, end) {
        if (start >= end) return [arr[start]]
        let part = (start + end) >> 1
        let leftArr = sort(arr, start, part)
        let rightArr = sort(arr, part + 1, end)
        return merge(leftArr, rightArr)
    }
    function merge(leftArr, rightArr) {
        let result = [], length = leftArr.length + rightArr.length
        leftArr[leftArr.length] = Number.MAX_SAFE_INTEGER
        rightArr[rightArr.length] = Number.MAX_SAFE_INTEGER

        let k = 0, i = 0, j = 0
        while(k < length) {
            result[k++] = leftArr[i] < rightArr[j] ? leftArr[i++] : rightArr[j++]
        }
        return result
    }
    return sort(arr, 0, arr.length - 1)
}
mergeSort([4,2,5,3,6,9,1,7])

// 快排
function quick(arr) {
    function sort(arr, start, end) {
        if (start >= end) return

        let part = partition(arr, start, end)
        sort(arr, start, part - 1)
        sort(arr, part + 1, end)
    }

    function partition(arr, start, end) {
        let pivot = arr[end], i = start
        for(let j = start; j < end; j++) {
            if (arr[j] < pivot) {
                swap(arr, i, j)
                i++
            }
        }
        swap(arr, end, i)
        return i
    }
    function swap(arr, i ,j) {
        let temp = arr[j]
        arr[j] = arr[i]
        arr[i] = temp
    }

    sort(arr, 0, arr.length - 1)
    return arr
}
quick([4,2,5,3,6,9,1,7])