<template>
  <uni-popup :visible="open" type="center" :mask-click="false" @close="$emit('open-change', false)">
    <view class="dialog-content" v-if="plant">
      <h2 class="dialog-title">{{ plant.name }}</h2>
      
      <view class="plant-detail-image">
        <image 
          v-if="plant.imageUrl" 
          :src="plant.imageUrl" 
          class="image"
          mode="aspectFill"
        />
        <view v-else class="image-placeholder">
          <text class="placeholder-icon">🌿</text>
        </view>
      </view>
      
      <view class="plant-detail-info">
        <p><strong>品种:</strong> {{ plant.species || '未指定' }}</p>
        <p><strong>种植日期:</strong> {{ formatDate(plant.plantedDate) }}</p>
        <p v-if="plant.location"><strong>位置:</strong> {{ plant.location }}</p>
        <p v-if="plant.wateringInterval"><strong>浇水间隔:</strong> {{ plant.wateringInterval }} 天</p>
        <p v-if="plant.fertilizingInterval"><strong>施肥间隔:</strong> {{ plant.fertilizingInterval }} 天</p>
        <p v-if="plant.notes"><strong>备注:</strong> {{ plant.notes }}</p>
        <view v-if="plant.tags && plant.tags.length > 0">
          <strong>标签:</strong>
          <view class="tags">
            <view v-for="tag in plant.tags" :key="tag" class="tag">
              {{ tag }}
            </view>
          </view>
        </view>
      </view>
      
      <view class="care-records">
        <div class="care-records-header">
          <h3>养护记录</h3>
          <uni-button type="primary" size="small" @click="showAddRecordForm = true">添加记录</uni-button>
        </div>
        
        <view v-if="careRecords.length === 0" class="no-records">
          <p>暂无养护记录</p>
        </view>
        <view v-else class="records-list">
          <view v-for="record in careRecords" :key="record.id" class="record-item">
            <div class="record-date">{{ formatDate(record.date) }}</div>
            <div class="record-type">{{ getCareTypeText(record.type) }}</div>
            <div class="record-notes" v-if="record.notes">{{ record.notes }}</div>
            <uni-button type="default" size="small" @click="handleDeleteRecord(record.id)">删除</uni-button>
          </view>
        </view>
      </view>
      
      <!-- 添加养护记录表单 -->
      <uni-popup v-if="showAddRecordForm" type="bottom" :mask-click="false">
        <view class="add-record-form">
          <h3>添加养护记录</h3>
          
          <uni-forms :model="recordForm" :rules="recordRules" ref="recordFormRef">
            <uni-forms-item label="养护类型" name="type">
              <uni-data-select 
                v-model="recordForm.type" 
                :localdata="careTypes" 
                placeholder="选择养护类型"
              />
            </uni-forms-item>
            
            <uni-forms-item label="日期" name="date">
              <uni-datetime-picker 
                v-model="recordForm.date" 
                type="date" 
                placeholder="选择日期" 
              />
            </uni-forms-item>
            
            <uni-forms-item label="备注" name="notes">
              <uni-easyinput v-model="recordForm.notes" type="textarea" placeholder="请输入备注（可选）" />
            </uni-forms-item>
          </uni-forms>
          
          <div class="form-actions">
            <uni-button type="default" @click="showAddRecordForm = false">取消</uni-button>
            <uni-button type="primary" @click="handleAddRecord">确定</uni-button>
          </div>
        </view>
      </uni-popup>
      
      <div class="dialog-actions">
        <uni-button type="default" @click="$emit('open-change', false)">关闭</uni-button>
      </div>
    </view>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Plant, CareRecord } from '../types/plant';

const props = defineProps<{
  plant: Plant | null;
  open: boolean;
  careRecords: CareRecord[];
}>();

const emit = defineEmits<{
  (e: 'open-change', value: boolean): void;
  (e: 'add-record', record: Omit<CareRecord, 'id'>): void;
  (e: 'delete-record', id: string): void;
}>();

const showAddRecordForm = ref(false);
const recordFormRef = ref();

const recordForm = reactive({
  type: '',
  date: new Date().toISOString().split('T')[0],
  notes: ''
});

const recordRules = {
  type: {
    rules: [{ required: true, errorMessage: '请选择养护类型' }]
  },
  date: {
    rules: [{ required: true, errorMessage: '请选择日期' }]
  }
};

const careTypes = [
  { value: 'water', text: '浇水' },
  { value: 'fertilize', text: '施肥' },
  { value: 'prune', text: '修剪' },
  { value: 'disease', text: '病害处理' },
  { value: 'pest', text: '虫害处理' }
];

watch(() => props.open, (newValue) => {
  if (!newValue) {
    showAddRecordForm.value = false;
  }
});

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

const handleAddRecord = () => {
  if (props.plant) {
    recordFormRef.value?.validate((valid: boolean) => {
      if (valid) {
        emit('add-record', {
          plantId: props.plant.id,
          type: recordForm.type as any,
          date: recordForm.date,
          notes: recordForm.notes
        });
        showAddRecordForm.value = false;
        // 重置表单
        recordForm.type = '';
        recordForm.date = new Date().toISOString().split('T')[0];
        recordForm.notes = '';
      }
    });
  }
};

const handleDeleteRecord = (id: string) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条养护记录吗？',
    success: (res) => {
      if (res.confirm) {
        emit('delete-record', id);
      }
    }
  });
};
</script>

<style scoped>
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
  margin-bottom: 20px;
  text-align: center;
}

.plant-detail-image {
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
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

.plant-detail-info {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.plant-detail-info p {
  margin-bottom: 8px;
  font-size: 14px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.tag {
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.care-records {
  margin-bottom: 20px;
}

.care-records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.care-records-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.no-records {
  text-align: center;
  padding: 20px;
  color: #999;
}

.records-list {
  space-y: 12px;
}

.record-item {
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  position: relative;
}

.record-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.record-type {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.record-notes {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.add-record-form {
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  padding: 20px;
  width: 100%;
}

.add-record-form h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>