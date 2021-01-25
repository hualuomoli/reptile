CREATE TABLE `t_ip_address` (
  `id` varchar(20) NOT NULL COMMENT '主键',
  `country_name` varchar(32) DEFAULT NULL COMMENT '国家名称',
  `province_name` varchar(32) DEFAULT NULL COMMENT '省份名称',
  `city_name` varchar(32) DEFAULT NULL COMMENT '城市名称',
  `start_str` varchar(32) NOT NULL COMMENT '起始IP',
  `end_str` varchar(32) NOT NULL COMMENT '结束IP',
  `start_num` decimal(20,0) NOT NULL COMMENT '起始IP(数值类型)',
  `end_num` decimal(20,0) NOT NULL COMMENT '结束IP(数值类型)',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='IP地址对应名称';