<template>
  <view class="quick-water-dialog">
    <uni-button type="default" @click="openDialog">快速浇水</uni-button>
    
    <uni-popup ref="dialogRef" type="center" :mask-click="false">
      <view class="dialog-content">
        <h2 class="dialog-title">快速浇水</h2>
        <p class="dialog-subtitle">选择要浇水的植物</p>
        
        <view class="plant-list">
          <view v-if="plants.length === 0" class="no-plants">
            <p>暂无植物</p>
          </view>
          <view v-else class="plants">
            <view v-for="plant in plants" :key="plant.id" class="plant-item">
              <uni-checkbox v-model="selectedPlants" :value="plant.id" />
              <div class="plant-info">
                <h3 class="plant-name">{{ plant.name }}</h3>
                <p class="plant-species">{{ plant.species || '未指定品种' }}</p>
              </div>
            </view>
          </view>
        </view>
        
        <div class="dialog-actions">
          <uni-button type="default" @click="closeDialog">取消</uni-button>
          <uni-button type="primary" @click="handleWater" :disabled="selectedPlants.length === 0">浇水</uni-button>
        </div>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plant } from '../types/plant';

const props = defineProps<{
  plants: Plant[];
}>();

const emit = defineEmits<{
  (e: 'water-plants', plantIds: string[]): void;
}>();

const dialogRef = ref();
const selectedPlants = ref<string[]>([]);

const openDialog = () => {
  // 重置选择
  selectedPlants.value = [];
  dialogRef.value?.open();
};

const closeDialog = () => {
  dialogRef.value?.close();
};

const handleWater = () => {
  if (selectedPlants.value.length > 0) {
    emit('water-plants', selectedPlants.value);
    closeDialog();
  }
};
</script>

<style scoped>
.quick-water-dialog {
  display: inline-block;
}

.dialog-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.dialog-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  text-align: center;
}

.plant-list {
  margin-bottom: 20px;
}

.no-plants {
  text-align: center;
  padding: 20px;
  color: #999;
}

.plant-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.plant-item:last-child {
  border-bottom: none;
}

.plant-info {
  margin-left: 12px;
  flex: 1;
}

.plant-name {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.plant-species {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>