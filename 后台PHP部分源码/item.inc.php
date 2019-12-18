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
$act = in_array($_GPC['act'], array('display', 'post', 'add', 'delete', 'search', 'test', 'set_top', 'cancel_set_top'))?$_GPC['act']:'display';
$title = '发布管理';
if ($act == 'display') {
    //物品分类
    $filter = array(
        'uniacid' => $_W['uniacid'],
    );
    $category = pdo_getall('superman_hand2_category', $filter, '*', '', $orderby);
    //获取分类
    if (isset($_GPC['get_category']) && $_GPC['get_category'] == 1) {
        die(json_encode($category));
    }
    //获取商品详情信息
    if (isset($_GPC['get_item'])
        && $_GPC['get_item'] == 1
        && $_GPC['itemid'] > 0) {
        $filter = array(
            'uniacid' => $_W['uniacid'],
            'id' => $_GPC['itemid'],
        );
        $item = pdo_get('superman_hand2_item', $filter);
        SupermanHandModel::superman_hand2_item($item);
        die(json_encode($item));
    }
    //更改物品分类
    if (checksubmit('update_category')) {
        $itemid = intval($_GPC['itemid']);
        $cid = intval($_GPC['categoryid']);
        $ret = pdo_update('superman_hand2_item', array(
            'cid' => $cid,
        ), array('id' => $itemid));
        if ($ret === false) {
            itoast('更改失败', referer(), 'error');
        }
        itoast('更改成功！', referer(), 'success');
    }

    $nickname = trim($_GPC['nickname']);
    $item_title = trim($_GPC['item_title']);
    $cid = intval($_GPC['cid']);
    $pindex = max(1, intval($_GPC['page']));
    $pagesize = 20;
    $start = ($pindex - 1) * $pagesize;
    $filter = array(
        ':uniacid' => $_W['uniacid'],
        //':item_type' => array(-1, 0),
    );
    $params = array(
        'uniacid' => $_W['uniacid'],
        'item_type' => array(-1, 0),
    );
    $sql = "SELECT * FROM " . tablename('superman_hand2_item') . " WHERE uniacid=:uniacid AND item_type in (-1, 0)";
    if (!empty($item_title)) {
        $sql .= ' AND title LIKE "%'.$item_title.'%"';
        $params['title LIKE'] = "%{$item_title}%";
    }
    $status = in_array($_GPC['status'], array( '-1', '0', '1', '2', 'all'))?$_GPC['status']:'all';
    if ($status != 'all') {
        $filter[':status'] = $status;
        $params['status'] = $status;
        $sql .= ' AND status=:status';
    } else {
        $sql .= ' AND status != -2';
        $params['status !='] = -2;
    }
    if (!empty($nickname)) {
        $users = pdo_getall('mc_members', array(
            'uniacid' => $_W['uniacid'],
            'nickname LIKE' => "%{$nickname}%"
        ), array('uid'));
        if (!empty($users)) {
            $arr = array();
            foreach ($users as $li) {
                $arr[] = $li['uid'];
            }
            $filter[':seller_uid'] = implode(',', $arr);
            $params['seller_uid'] = implode(',', $arr);
        } else {
            $filter[':seller_uid'] = 0;
            $params['seller_uid'] = 0;
        }
        $sql .= ' AND seller_uid=:seller_uid';
    }
    if ($cid > 0) {
        $filter[':cid'] = $cid;
        $params['cid'] = $cid;
        $sql .= ' AND cid=:cid';
    }
    $total = pdo_getcolumn('superman_hand2_item', $params, 'COUNT(*)');
    $orderby .= ' ORDER BY CASE WHEN status = 0 THEN -1 ELSE -2 END DESC, createtime DESC, updatetime DESC';
    $limit .= $pagesize > 0?" LIMIT {$start},{$pagesize}":'';
    $list = pdo_fetchall($sql.$orderby.$limit, $filter);
    $pager = pagination($total, $pindex, $pagesize);
    if ($list) {
        foreach ($list as &$li) {
            $li['category'] = pdo_get('superman_hand2_category', array(
                'uniacid' => $_W['uniacid'],
                'id' => $li['cid'],
            ));
            if ($li['seller_uid'] > 0) {
                $user = pdo_get('mc_members', array('uid' => $li['seller_uid']));
                $li['nickname'] = $user['nickname'];
            }
            if ($this->plugin_module['plugin_ad']['module']
                && !$this->plugin_module['plugin_ad']['module']['is_delete']) {
                $li['position_title'] = $li['pay_position'] > 0 ? '是' : '否';
                $li['pay_position'] = $user = pdo_get('superman_hand2_pay_position', array(
                    'uniacid' => $_W['uniacid'],
                    'displayorder' => $li['pay_position']
                ), array('title'));
            }
        }
        unset($li);
    }
    
} else if ($act == 'post') {
    $id = intval($_GPC['id']);
    $status = intval($_GPC['status']);
    if (checksubmit()) {
        $data = array(
            'title' => $_GPC['title'],
            'status' => $status,
        );
        $ret = pdo_update('superman_hand2_item', $data, array('id' => $id));
        if ($ret === false) {
            itoast('数据库更新失败！', '', 'error');
        }
        //统计日成交量
        if ($status == 2) {
            SupermanHandUtil::stat_day_item_trade();
        }
        get_credit($status, $id, $this->module['config']);
        //发送模板消息
        if (in_array($status, array('-3', '1'))) {
            $item = pdo_get('superman_hand2_item', array('id' => $id));
            $res = SupermanHandUtil::get_uid_formid($item['seller_uid']);
            if ($res['formid']) {
                $openid = SupermanHandUtil::uid2openid($item['seller_uid']);
                $tpl_id = $this->module['config']['minipg']['audit_result']['tmpl_id'];
                $url = 'pages/detail/index?id='.$item['id'];
                $message_data = array(
                    'keyword1' => array(
                        'value' => $item['title'],  //商品名称
                    )                    
                   ),
               );
                $ret = SupermanHandUtil::send_wxapp_msg($message_data, $openid, $tpl_id, $url, $res['formid']);
                if ($ret) {
                    SupermanHandUtil::delete_uid_formid($res['id']);
                }
            }
        }
        $url = $_W['siteroot'].'web/'.$this->createWebUrl('item').'&version_id='.$_GPC['version_id'];
        itoast('操作成功！', $url, 'success');
    }
    