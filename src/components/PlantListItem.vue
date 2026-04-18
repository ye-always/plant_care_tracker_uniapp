<template>
  <view class="plant-list-item" @click="$emit('view')">
    <view class="plant-image-container">
      <image 
        v-if="plant.imageUrl" 
        :src="plant.imageUrl" 
        class="plant-image"
        mode="aspectFill"
      />
      <view v-else class="plant-image-placeholder">
        <text class="placeholder-icon">🌿</text>
      </view>
    </view>
    <view class="plant-info">
      <div class="plant-header">
        <h3 class="plant-name">{{ plant.name }}</h3>
        <uni-button type="default" size="small" @click.stop="$emit('delete')">删除</uni-button>
      </div>
      <p class="plant-species">{{ plant.species || '未指定品种' }}</p>
      <div class="plant-meta">
        <p class="plant-date">种植于 {{ formatDate(plant.plantedDate) }}</p>
        <p v-if="plant.location" class="plant-location">位置: {{ plant.location }}</p>
      </div>
      <view class="plant-tags" v-if="plant.tags && plant.tags.length > 0">
        <view v-for="tag in plant.tags" :key="tag" class="tag">
          {{ tag }}
        </view>
      </view>
      <view class="plant-care-info" v-if="careRecords.length > 0">
        <p class="care-info">最后养护: {{ formatDate(careRecords[0].date) }} ({{ getCareTypeText(careRecords[0].type) }})</p>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Plant, CareRecord } from '../types/plant';

const props = defineProps<{
  plant: Plant;
  careRecords: CareRecord[];
}>();

const emit = defineEmits<{
  (e: 'view'): void;
  (e: 'delete'): void;
}>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

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
.plant-list-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 12px;
  transition: transform 0.2s ease;
}

.plant-list-item:hover {
  transform: translateY(-2px);
}

.plant-image-container {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 16px;
  flex-shrink: 0;
}

.plant-image {
  width: 100%;
  height: 100%;
}

.plant-image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.placeholder-icon {
  font-size: 32px;
}

.plant-info {
  flex: 1;
  min-width: 0;
}

.plant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plant-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.plant-species {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.plant-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.plant-date, .plant-location {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.plant-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.tag {
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.plant-care-info {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.care-info {
  font-size: 12px;
  color: #666;
  margin: 0;
}
</style>