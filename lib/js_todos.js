class Todos {
    /*
        @param {input,radio,ul,allBtn,activeBtn,completedBtn,clearAll,totalText,btnGroup,selectAll} object
        input 输入内容框
        ul 显示列表
        radio 完成按钮
        allBtn 显示全部任务按钮
        activeBtn 显示已完成按钮
        completedBtn 显示未完成按钮
        clearAll 清除所有已完成
        totalText 显示列表总数
        activeClassName 已完成class类名
        selectAll 全选按钮

        属性值：id或者class
    */
    constructor(param = {}) {
        // 参数是对象，遍历参数，一一赋值
        for (let attr in param) {
            this[attr] = param[attr]
        }
        // 调用初始化方法
        this.init();
    }
    init() {
        // 回车上传事件
        this.enterRequest();
        // 显示列表
        Todos.show('all', this.ul, this.totalText);
        // 绑定显示全部按钮事件
        this.allList();
        // 绑定显示未完成按钮事件
        this.activeList();
        // 绑定显示已完成按钮事件
        this.completedList();
        // ul事件委托
        this.ulDelegation();
        // ul事件委托双击版本
        this.ulDelegationDblclick();
        // 判断有已完成事件打开按钮
        this.examineClearCompleted();
        // 清除全部已完成
        this.clearCompleted();
        // 判断有内容显示全选按钮
        this.examineSelectAll();
        // 全选功能
        this.selectAllFn();
    }
    enterRequest() {
        let _this = this;
        // 只在键盘抬起时触发
        Todos.$$(this.input).onkeyup = function(e) {
            // 兼容写法
            e = e || window.event;
            // enter键的键码是13 时才触发请求
            if (e.keyCode === 13) {
                // 获取输入框内容
                let content = this.value;
                // 判断内容为空则不触发
                if (!content) return;
                // 发送Ajax请求
                Ajax.request({
                    method: 'get',
                    url: './lib/index.php',
                    data: {
                        fn: 'add',
                        content
                    },
                    dataType: ''
                }).then(data => {
                    // 传输成功
                    this.value = '';
                    // 刷新当前显示页面
                    let state = Todos.$$(_this.ul).getAttribute('index');
                    Todos.show(state, _this.ul, _this.totalText);
                    // 判断有无内容显示界面
                    _this.examineSelectAll();
                })
            }
        }
    }
    static show(state = 'all', ul, totalText) {
        // state 显示方式：全部('all')、已完成(1)、未完成(0)
        // ul 显示列表
        // 判断条件是所有显示还是显示部分
        if (state === 'all') {
            // 发送Ajax请求
            Ajax.request({
                method: 'get',
                url: './lib/index.php',
                data: {
                    fn: 'getAll',
                }
            }).then(data => {
                // 设置总共显示数目
                Todos.$$(totalText).innerHTML = `${data[0]} item left`;
                // 调用页面创建方法
                // 输出内容
                Todos.$$(ul).innerHTML = Todos.createAllListHtml(data[1]);
                // 给显示列表添加id标记此时需要显示什么
                Todos.$$(ul).setAttribute('index', `${state}`)
            })
        } else {
            Ajax.request({
                method: 'get',
                url: './lib/index.php',
                data: {
                    fn: 'getState',
                    state
                }
            }).then(data => {
                // 设置总共显示数目
                Todos.$$(totalText).innerHTML = `${data.length} item left`;
                // 调用页面创建方法
                // 输出内容
                Todos.$$(ul).innerHTML = Todos.createAllListHtml(data);
                // 给显示列表添加id标记此时需要显示什么
                Todos.$$(ul).setAttribute('index', `${state}`)
            })
        }
    }
    static createAllListHtml(data) {
        // 创建所有列表HTML
        // 创建html字符串
        let html = '';
        // 遍历数据
        data.forEach(item => {
            // 创建完成状态字符串
            let stateClass;
            // 判断状态，为1添加active的className
            item.state == 0 ? stateClass = '' : stateClass = 'actived';
            // 遍历对象
            let li = `
                <li class="list-group-item ${stateClass}" id="list_${item.id}">
                    <label class="state">
                        <input type="checkbox" name="state">
                        <div><div class="act"></div></div>
                    </label>
                    <span class="badge">x</span> 
                    <input type="text" id="contentInput" value="${item.content}" disabled>
                </li>`;
            html += li;
        });
        // 返回字符串
        return html;
    }
    allList() {
        // 显示全部列表函数
        let _this = this;
        // 存储按钮组
        let child = Todos.$$All(this.btnGroup);
        // 绑定点击事件
        child[0].onclick = function() {
            // 调用show方法，修改状态
            Todos.show('all', _this.ul, _this.totalText);
            // 排他，修改样式
            for (let i = 0; i < child.length; i++) {
                child[i].removeAttribute('class')
            }
            // 给自己设置样式
            this.setAttribute('class', 'nowSelect')
        }
    }
    activeList() {
        // 显示未完成列表函数
        let _this = this;
        // 存储按钮组
        let child = Todos.$$All(this.btnGroup);
        // 绑定点击事件
        child[1].onclick = function() {
            // 调用show方法，修改状态
            Todos.show(0, _this.ul, _this.totalText);
            // 排他，修改样式
            for (let i = 0; i < child.length; i++) {
                child[i].removeAttribute('class')
            }
            // 给自己设置样式
            this.setAttribute('class', 'nowSelect')
        }
    }
    completedList() {
        // 显示已完成列表函数
        let _this = this;
        // 存储按钮组
        let child = Todos.$$All(this.btnGroup);
        // 绑定点击事件
        child[2].onclick = function() {
            // 调用show方法，修改状态
            Todos.show(1, _this.ul, _this.totalText);
            // 排他，修改样式
            for (let i = 0; i < child.length; i++) {
                child[i].removeAttribute('class')
            }
            // 给自己设置样式
            this.setAttribute('class', 'nowSelect')
        }
    }
    ulDelegation() {
        // 事件单机委派
        Todos.$$(this.ul).onclick = (e) => {
            // 兼容写法
            e = e || window.event;
            // 获取target属性
            let target = e.target;
            // 点击复选框修改当前状态
            if (target.name == 'state') {
                // 绑定事件
                this.listStateChange(target);
            }
            // 点击删除按钮直接删除
            if (target.className == 'badge') {
                // 绑定事件
                this.delCurrentList(target);
            }
        }
    }
    ulDelegationDblclick() {
        // 事件双击委派
        Todos.$$(this.ul).ondblclick = (e) => {
            // 兼容写法
            e = e || window.event;
            // 获取target属性
            let target = e.target;
            // 双击文本框修改内容
            if (target.id == 'contentInput') {
                // 调用修改方法
                this.updateContent(target);
                // 点击页面外其他地方取消可编辑状态
                this.updateContentClose(target);
            }
        }
    }
    listStateChange(target) {
        // 列表状态改变
        // console.log()
        // 获取父级LI
        let li = target.parentNode.parentNode;
        // 获取父级li的class
        let classStr = li.className;
        // 获取当前列表id
        let infoId = ((target.parentNode.parentNode.id).split('_'))[1];
        // 判断当前状态 设置相反状态
        let state;
        if (classStr.indexOf(`${this.activeClassName}`) === -1) {
            state = 1;
        } else {
            state = 0;
        }
        // 发送Ajax请求
        Ajax.request({
            method: 'get',
            url: './lib/index.php',
            data: {
                fn: 'updateState',
                state,
                infoId
            },
            dataType: ''
        }).then(data => {
            // 改变内容判断有无已完成
            this.examineClearCompleted();
            if (state == 1) {
                li.classList.add(`${this.activeClassName}`);
            } else {
                li.classList.remove(`${this.activeClassName}`);
            }
            // 刷新当前显示页面
            let state1 = Todos.$$(this.ul).getAttribute('index');
            Todos.show(state1, this.ul, this.totalText);
        })
    }
    delCurrentList(target) {
        // 删除当前列表
        // 获取父级
        let li = target.parentNode;
        // 获取该行ID
        let infoId = ((target.parentNode.id).split('_'))[1];
        // 发送Ajax请求
        Ajax.request({
            method: 'get',
            url: './lib/index.php',
            data: {
                fn: 'del',
                infoId
            },
            dataType: ''
        }).then(data => {
            // 成功后删除本行
            li.remove();
            // 改变内容判断有无已完成
            this.examineClearCompleted();
            // 判断有无内容显示界面
            this.examineSelectAll();
            // 刷新当前显示页面
            let state = Todos.$$(this.ul).getAttribute('index');
            Todos.show(state, this.ul, this.totalText);
        })
    }
    updateContent(target) {
        let _this = this
            // 可编辑状态
        target.disabled = false;
        // 添加边框
        target.classList.add('noDisabled');
        // 获取父级
        let li = target.parentNode;
        // 获取该行ID
        let infoId = ((target.parentNode.id).split('_'))[1];
        // 只在键盘抬起时触发
        target.onkeyup = function(e) {
            // 兼容写法
            e = e || window.event;
            // enter键的键码是13 时才触发请求
            if (e.keyCode === 13) {
                // 获取输入框内容
                let content = this.value;
                // 判断内容，有则修改,没有则删除
                if (content) {
                    // 发送Ajax请求
                    Ajax.request({
                        method: 'get',
                        url: './lib/index.php',
                        data: {
                            fn: 'updateContent',
                            infoId,
                            content
                        },
                        dataType: ''
                    }).then(data => {
                        // 传输成功删除边框
                        this.classList.remove('noDisabled');
                        // 关闭可编辑
                        this.disabled = true;
                    })
                } else {
                    // 内容为空则删除
                    // 发送Ajax请求
                    Ajax.request({
                        method: 'get',
                        url: './lib/index.php',
                        data: {
                            fn: 'del',
                            infoId
                        },
                        dataType: ''
                    }).then(data => {
                        // 成功后删除
                        li.remove();
                        // 改变内容判断有无已完成
                        _this.examineClearCompleted();
                        // 判断有无内容显示界面
                        _this.examineSelectAll();
                    })
                }
            }
        }
    }
    updateContentClose(target) {
        document.onclick = () => {
            target.onblur = () => {
                // 获取输入框内容
                let content = target.value;
                // 获取该行ID
                let infoId = ((target.parentNode.id).split('_'))[1];
                // 判断有内容为修改
                if (content) {
                    // 发送Ajax请求
                    Ajax.request({
                        method: 'get',
                        url: './lib/index.php',
                        data: {
                            fn: 'updateContent',
                            infoId,
                            content
                        },
                        dataType: ''
                    }).then(data => {
                        // 删除边框
                        target.classList.remove('noDisabled');
                        // 打开禁用
                        target.disabled = true;
                    })
                } else {
                    // 内容为空则删除
                    // 发送Ajax请求
                    Ajax.request({
                        method: 'get',
                        url: './lib/index.php',
                        data: {
                            fn: 'del',
                            infoId
                        },
                        dataType: ''
                    }).then(data => {
                        // 成功后删除
                        target.parentNode.remove();
                        // 改变内容判断有无已完成
                        this.examineClearCompleted();
                        // 判断有无内容显示界面
                        this.examineSelectAll();
                    })
                }
            }
        }
    }
    examineClearCompleted() {
        // 检查是否已完成事件，有则显示内容
        let aBtn = Todos.$$(this.clearAll);
        // 发送Ajax
        Ajax.request({
            method: 'get',
            url: './lib/index.php',
            data: {
                fn: 'getState',
                state: 1
            }
        }).then(data => {
            if (data.length == 0) {
                aBtn.style.display = 'none'
            } else {
                aBtn.style.display = ''
            }
        })
    }
    clearCompleted() {
        // 删除所有已完成事件
        let aBtn = Todos.$$(this.clearAll);
        // 点击事件
        aBtn.onclick = () => {
            // 发送Ajax请求
            Ajax.request({
                method: 'get',
                url: './lib/index.php',
                data: {
                    fn: 'delCompleted',
                    state: 1
                }
            }).then(data => {
                // 刷新当前显示页面
                let state = Todos.$$(this.ul).getAttribute('index');
                Todos.show(state, this.ul, this.totalText);
                // 改变内容判断有无已完成
                this.examineClearCompleted();
                // 判断有无内容显示界面
                this.examineSelectAll();
            })
        }
    }
    examineSelectAll() {
        // 检查是否已完成事件，有则显示内容
        let allBtn = Todos.$$(this.selectAll);
        let box = Todos.$$(this.bottomBox);
        // 发送Ajax
        Ajax.request({
            method: 'get',
            url: './lib/index.php',
            data: {
                fn: 'getAll',
            }
        }).then(data => {
            if (data[1].length == 0) {
                allBtn.style.display = 'none'
                box.style.display = 'none'
            } else {
                allBtn.style.display = ''
                box.style.display = ''
            }
        })
    }
    selectAllFn() {
        let _this = this;
        // 检查是否已完成事件，有则显示内容
        let allBtn = Todos.$$(this.selectAll);
        // 使用every方法，全部满足已完成返回true，根据条件改变状态
        allBtn.onclick = () => {
            // 发送Ajax请求
            Ajax.request({
                method: 'get',
                url: './lib/index.php',
                data: {
                    fn: 'getAll',
                }
            }).then(data => {
                // 全部完成返回true
                let flag = data[1].every(item => {
                    if (item.state == 1) {
                        return true;
                    }
                });
                // 全部完成改未完成
                if (flag) {
                    Ajax.request({
                        method: 'get',
                        url: './lib/index.php',
                        data: {
                            fn: 'updateAllState',
                            Allstate: 0
                        }
                    }).then(data => {
                        // 刷新当前显示页面
                        let state = Todos.$$(_this.ul).getAttribute('index');
                        Todos.show(state, _this.ul, _this.totalText);
                        // 改变内容判断有无已完成
                        _this.examineClearCompleted();
                    })
                } else {
                    // 未完成改完成
                    Ajax.request({
                        method: 'get',
                        url: './lib/index.php',
                        data: {
                            fn: 'updateAllState',
                            Allstate: 1
                        }
                    }).then(data => {
                        // 刷新当前显示页面
                        let state = Todos.$$(_this.ul).getAttribute('index');
                        Todos.show(state, _this.ul, _this.totalText);
                        // 改变内容判断有无已完成
                        _this.examineClearCompleted();
                    })
                }
            })
        }
    }
    static $$(tag) {
        // 快捷获取节点对象函数
        // 返回节点对象
        return document.querySelector(tag);
    }
    static $$All(tag) {
        // 返回节点对象群组
        return document.querySelectorAll(tag)
    }
}

new Todos({
    input: '#content',
    ul: '#main>div ul',
    totalText: '.operate>span',
    // allBtn: '.operate>button:nth-of-type(1)',
    // activeBtn: '.operate>button:nth-of-type(2)',
    // completedBtn: '.operate>button:nth-of-type(3)',
    btnGroup: '.operate>button',
    activeClassName: 'actived',
    clearAll: '.operate>a',
    selectAll: '.allState>a',
    bottomBox: '.operate'
})