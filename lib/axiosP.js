/*
    @param {method,url,data,dataType,success,error} object
    method   请求方式
    url      请求地址
    data     传输参数
    dataType 返回值类型
    以对象的方式传参，调用Ajax方法

    返回promise函数 
*/
class Ajax {
    static request(param = {}) {

        // 解构赋值
        let {
            method,
            url,
            data = null,
            dataType = 'json',
        } = param
        // 判断请求地址，不能为空
        if (!url) {
            throw new Error('请求地址不能为空')
        }
        // 转换参数 data为对象
        let str = null
        if (data) {
            str = ''
            // 遍历参数对象
            for (const key in data) {
                // 拼接内容
                str += `${key}=${data[key]}&`
            }
            // 裁剪掉最后一个多余的&符号
            str = str.slice(0, -1)
            // 判断请求方式是否为method
            // method统一大小写
            if (method.toLowerCase() == 'get') {
                // 参数拼接到地址后
                url += `?${str}`
                // 参数清空
                str = null
            }
        }
        return new Promise(function (resolve, reject) {
            // 获取XMLHttpRequest对象
            let xhr = new XMLHttpRequest()
            // 设置请求
            xhr.open(method, url, true)
            // 设置请求头 兼顾post 影响不大
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
            // 发送请求
            xhr.send(str)
            // 监听Ajax请求
            xhr.onreadystatechange = () => {
                // Ajax准备状态为4，服务器状态为200及200到300内
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // 接收返回值
                        let res = xhr.response
                        // 如果返回结果类型为json，则进行json解密
                        if (dataType.toLowerCase() === 'json') {
                            res = JSON.parse(xhr.response)
                        }
                        // 判断有成功的回调函数且调用   参数是响应值
                        resolve(res)
                    } else {
                        // 判断有失败的回调函数且调用   参数是服务器状态
                        reject(xhr.status)
                    }
                }
            }
        })
    }
}