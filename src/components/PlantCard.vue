<template>
  <view class="plant-card" @click="$emit('view')">
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
      <h3 class="plant-name">{{ plant.name }}</h3>
      <p class="plant-species">{{ plant.species || '未指定品种' }}</p>
      <p class="plant-date">种植于 {{ formatDate(plant.plantedDate) }}</p>
      <view class="plant-tags" v-if="plant.tags && plant.tags.length > 0">
        <view v-for="tag in plant.tags" :key="tag" class="tag">
          {{ tag }}
        </view>
      </view>
      <view class="plant-care-info" v-if="careRecords.length > 0">
        <p class="last-care">最后养护: {{ formatDate(careRecords[0].date) }}</p>
        <p class="care-type">{{ getCareTypeText(careRecords[0].type) }}</p>
      </view>
    </view>
    <view class="plant-actions">
      <uni-button type="default" size="small" @click.stop="$emit('delete')">删除</uni-button>
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
.plant-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  position: relative;
}

.plant-card:hover {
  transform: translateY(-2px);
}

.plant-image-container {
  height: 200px;
  overflow: hidden;
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
}

.placeholder-icon {
  font-size: 48px;
}

.plant-info {
  padding: 16px;
}

.plant-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.plant-species {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.plant-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.plant-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.plant-care-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.last-care {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.care-type {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.plant-actions {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>