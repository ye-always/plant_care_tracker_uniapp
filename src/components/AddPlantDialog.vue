<template>
  <view class="add-plant-dialog">
    <uni-button type="primary" @click="openDialog">添加植物</uni-button>
    
    <uni-popup ref="dialogRef" type="center" :mask-click="false">
      <view class="dialog-content">
        <h2 class="dialog-title">添加新植物</h2>
        
        <uni-forms :model="plantForm" :rules="rules" ref="formRef">
          <uni-forms-item label="植物名称" name="name">
            <uni-easyinput v-model="plantForm.name" placeholder="请输入植物名称" />
          </uni-forms-item>
          
          <uni-forms-item label="品种" name="species">
            <uni-easyinput v-model="plantForm.species" placeholder="请输入植物品种（可选）" />
          </uni-forms-item>
          
          <uni-forms-item label="种植日期" name="plantedDate">
            <uni-datetime-picker 
              v-model="plantForm.plantedDate" 
              type="date" 
              placeholder="选择种植日期" 
            />
          </uni-forms-item>
          
          <uni-forms-item label="位置" name="location">
            <uni-easyinput v-model="plantForm.location" placeholder="请输入植物位置（可选）" />
          </uni-forms-item>
          
          <uni-forms-item label="标签" name="tags">
            <uni-easyinput v-model="tagsInput" placeholder="请输入标签，用逗号分隔（可选）" />
          </uni-forms-item>
          
          <uni-forms-item label="浇水间隔" name="wateringInterval">
            <uni-easyinput v-model.number="plantForm.wateringInterval" type="number" placeholder="请输入浇水间隔（天）" />
          </uni-forms-item>
          
          <uni-forms-item label="施肥间隔" name="fertilizingInterval">
            <uni-easyinput v-model.number="plantForm.fertilizingInterval" type="number" placeholder="请输入施肥间隔（天）" />
          </uni-forms-item>
          
          <uni-forms-item label="备注" name="notes">
            <uni-easyinput v-model="plantForm.notes" type="textarea" placeholder="请输入备注（可选）" />
          </uni-forms-item>
        </uni-forms>
        
        <div class="dialog-actions">
          <uni-button type="default" @click="closeDialog">取消</uni-button>
          <uni-button type="primary" @click="handleSubmit">确定</uni-button>
        </div>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Plant } from '../types/plant';

const emit = defineEmits<{
  (e: 'add', plant: Omit<Plant, 'id'>): void
}>();

const dialogRef = ref();
const formRef = ref();

const tagsInput = ref('');

const plantForm = reactive({
  name: '',
  species: '',
  plantedDate: new Date().toISOString().split('T')[0],
  location: '',
  tags: [] as string[],
  wateringInterval: undefined,
  fertilizingInterval: undefined,
  notes: ''
});

const rules = {
  name: {
    rules: [{ required: true, errorMessage: '请输入植物名称' }]
  }
};

const openDialog = () => {
  // 重置表单
  plantForm.name = '';
  plantForm.species = '';
  plantForm.plantedDate = new Date().toISOString().split('T')[0];
  plantForm.location = '';
  tagsInput.value = '';
  plantForm.wateringInterval = undefined;
  plantForm.fertilizingInterval = undefined;
  plantForm.notes = '';
  
  dialogRef.value?.open();
};

const closeDialog = () => {
  dialogRef.value?.close();
};

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 处理标签输入
      if (tagsInput.value) {
        plantForm.tags = tagsInput.value
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag);
      } else {
        plantForm.tags = [];
      }
      
      emit('add', plantForm);
      closeDialog();
    }
  });
};
</script>

<style scoped>
.add-plant-dialog {
  display: inline-block;
}

.dialog-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.uni-forms {
  margin-bottom: 20px;
}

.uni-forms-item {
  margin-bottom: 15px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>