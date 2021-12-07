<?php 
  function con(){
      $link = mysqli_connect('127.0.0.1','root','root','test',3306);
      if(!$link){
          echo '连接失败';
          die;
      }
      return $link;
  }
  // 执行非查询操作
  function query($sql){
      $link = con();
      $res = mysqli_query($link,$sql);
      return $res;
  }
  // 执行查询操作的
  function select($sql){
    $link = con();
    $res = mysqli_query($link,$sql);
    if(!$res){
        return false;
    }
    $arr = [];
    while($tmp = mysqli_fetch_assoc($res)){
        $arr[]= $tmp;
    }
    return $arr;
  }
?>