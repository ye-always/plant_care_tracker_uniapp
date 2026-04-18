<template>
  <view class="stats-dashboard">
    <h2 class="dashboard-title">植物养护统计</h2>
    
    <view class="stats-cards">
      <view class="stat-card">
        <div class="stat-icon">🌱</div>
        <div class="stat-content">
          <div class="stat-value">{{ plants.length }}</div>
          <div class="stat-label">总植物数</div>
        </div>
      </view>
      
      <view class="stat-card">
        <div class="stat-icon">💧</div>
        <div class="stat-content">
          <div class="stat-value">{{ waterCount }}</div>
          <div class="stat-label">浇水次数</div>
        </div>
      </view>
      
      <view class="stat-card">
        <div class="stat-icon">🌿</div>
        <div class="stat-content">
          <div class="stat-value">{{ fertilizeCount }}</div>
          <div class="stat-label">施肥次数</div>
        </div>
      </view>
      
      <view class="stat-card">
        <div class="stat-icon">✂️</div>
        <div class="stat-content">
          <div class="stat-value">{{ pruneCount }}</div>
          <div class="stat-label">修剪次数</div>
        </div>
      </view>
    </view>
    
    <view class="recent-activity">
      <h3>最近养护活动</h3>
      <view v-if="recentRecords.length === 0" class="no-activity">
        <p>暂无养护活动</p>
      </view>
      <view v-else class="activity-list">
        <view v-for="record in recentRecords" :key="record.id" class="activity-item">
          <div class="activity-date">{{ formatDate(record.date) }}</div>
          <div class="activity-plant">{{ getPlantName(record.plantId) }}</div>
          <div class="activity-type">{{ getCareTypeText(record.type) }}</div>
          <div class="activity-notes" v-if="record.notes">{{ record.notes }}</div>
        </view>
      </view>
    </view>
    
    <view class="location-stats">
      <h3>位置分布</h3>
      <view v-if="locationStats.length === 0" class="no-locations">
        <p>暂无位置数据</p>
      </view>
      <view v-else class="location-list">
        <view v-for="stat in locationStats" :key="stat.location" class="location-item">
          <div class="location-name">{{ stat.location || '未指定' }}</div>
          <div class="location-count">{{ stat.count }} 株植物</div>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Plant, CareRecord } from '../types/plant';

const props = defineProps<{
  plants: Plant[];
  careRecords: CareRecord[];
}>();

// 统计各种养护类型的次数
const waterCount = computed(() => {
  return props.careRecords.filter(record => record.type === 'water').length;
});

const fertilizeCount = computed(() => {
  return props.careRecords.filter(record => record.type === 'fertilize').length;
});

const pruneCount = computed(() => {
  return props.careRecords.filter(record => record.type === 'prune').length;
});

// 获取最近的养护记录（最近10条）
const recentRecords = computed(() => {
  return [...props.careRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
});

// 统计位置分布
const locationStats = computed(() => {
  const locationMap = new Map<string, number>();
  
  props.plants.forEach(plant => {
    const location = plant.location || '未指定';
    locationMap.set(location, (locationMap.get(location) || 0) + 1);
  });
  
  return Array.from(locationMap.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
});

// 根据植物ID获取植物名称
const getPlantName = (plantId: string) => {
  const plant = props.plants.find(p => p.id === plantId);
  return plant ? plant.name : '未知植物';
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 获取养护类型文本
const getCareTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    water: '浇水',
    fertilize: '施肥',
    prune: '修剪',
    disease: '病害处理',
    pest: '虫害处理'
  };
  return typeMap[type] || type;
};
</script>

<style scoped>
.stats-dashboard {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.dashboard-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.recent-activity, .location-stats {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recent-activity h3, .location-stats h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.no-activity, .no-locations {
  text-align: center;
  padding: 20px;
  color: #999;
}

.activity-list, .location-list {
  space-y: 12px;
}

.activity-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.activity-plant {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.activity-type {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.activity-notes {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.location-item:last-child {
  border-bottom: none;
}

.location-name {
  font-size: 14px;
}

.location-count {
  font-size: 12px;
  color: #666;
}

@media (min-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>