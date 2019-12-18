<?php
/**
 * 【 】模块定义
 *
 * @author  
 * @url 
 */
defined('IN_IA') or exit('Access Denied');
global $_W, $_GPC;
$do = $_GPC['do'];
$act = in_array($_GPC['act'], array('display'))?$_GPC['act']:'display';
$title = '订单管理';
if ($act == 'display') {
    //搜索
    $ordersn = trim($_GPC['ordersn']);
    $order_title = trim($_GPC['title']);
    $filter = array(
        'uniacid' => $_W['uniacid'],
    );
    if (!empty($ordersn)) {
        $filter['ordersn'] = $ordersn;
    }
    if (!empty($order_title)) {
        $filter['title LIKE'] = "%{$order_title}%";
    }
    $status = in_array($_GPC['status'], array( '-2', '-1', '0', '1', '2', '3', '4', 'all'))?$_GPC['status']:'all';
    if ($status != 'all') {
        $filter['status'] = $status;
    }
    $pindex = max(1, intval($_GPC['page']));
    $pagesize = 20;
    $total = pdo_getcolumn('superman_hand2_order', $filter, 'COUNT(*)');
    $orderby = 'createtime DESC';
    $list = pdo_getall('superman_hand2_order', $filter, '', '', $orderby, array($pindex, $pagesize));
    $pager = pagination($total, $pindex, $pagesize);
    if (!empty($list)) {
        foreach ($list as &$li) {
            $li['_status_title'] = SupermanHandUtil::order_status_title($li['status']);
            $li['seller'] = mc_fetch($li['seller_uid'], array('nickname'));
            $li['buyer'] = mc_fetch($li['buyer_uid'], array('nickname'));
            $li['_createtime'] = $li['createtime']?date('Y-m-d H:i:s', $li['createtime']):'';
        }
        unset($li);
    }
}
include $this->template($this->web_template_path);