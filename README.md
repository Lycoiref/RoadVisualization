# 交通数据展示
## 项目技术栈
前端：Vue3 + Vite + Element Plus + Echarts  
后端：Node.js + Koa + Prisma + Postgres

## 数据字段解析
- load_track_detail 为道路数据表，一段路最多由4个点组成,每个点的纬度经度为[lat,lng]，表中的lat1表示第一点的纬度lng2表示第一个点的经度，以此类推；
- five_carflow20140101 道路流量表每隔5分钟统计一次
    - road_id: 路段标号
    - car_flow_out: 出流量
	- car_flow_in: 进流量
    - time_minute: 时间（转化为分钟）


_注：使用mysql，将表导入其中使用，一共十五天数据！_