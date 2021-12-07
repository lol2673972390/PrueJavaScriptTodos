<?php
// 引入mysql文件
include('./mysql.php');
// 获取访问的方法
$fn = $_GET['fn'];
// add()
$fn();
// 添加数据的方法
function add(){
   // echo 222;
    $content = $_GET['content'];
  //  die;
  $sql = "insert into jstodos values(null,'$content',0)";
  $res = query($sql);
  echo $res;
}

// 获取数据的方法
function getAll(){
    $sql1 = 'select count(id) as listAll from jstodos';
    $listAll = select($sql1)[0]['listAll'];
    $sql = "select * from jstodos order by id asc";
    $res = select($sql);
    print_r(json_encode([$listAll,$res]));
}
// 获取单个数据的方法
function getState(){
    $state = $_GET['state'];
    $sql = 'select * from jstodos where state='.$state;
    $res = select($sql);
    print_r(json_encode($res));
}

// 删除数据的方法
function del(){
    $id = $_GET['infoId'];
    $sql = 'delete from jstodos where id='.$id;
    $res = query($sql);
    echo $res;

}
// 删除已完成数据的方法
function delCompleted(){
    $state = $_GET['state'];
    $sql = 'delete from jstodos where state='.$state;
    $res = query($sql);
    echo $res;

}

// 修改单个状态的方法
function updateState(){
    $state = $_GET['state'];
    $id = $_GET['infoId'];
    $sql = 'update jstodos set state='.$state.' where id='.$id;
    $res = query($sql);
    echo $res;
}
// 修改所有状态的方法
function updateAllState(){
    $state = $_GET['Allstate'];
    $sql = 'update jstodos set state='.$state;
    $res = query($sql);
    echo $res;
}
// 修改数据的方法
function updateContent(){
    $content = $_GET['content'];
    $id = $_GET['infoId'];
    $sql = 'update jstodos set content="'.$content.'" where id='.$id;
    $res = query($sql);
    echo $res;
}


?>