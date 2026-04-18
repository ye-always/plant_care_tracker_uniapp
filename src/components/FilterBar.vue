<template>
  <view class="filter-bar">
    <div class="search-section">
      <uni-search-bar v-model="localSearchQuery" placeholder="搜索植物名称或品种" @input="handleSearchChange" />
    </div>
    
    <div class="filter-options">
      <div class="filter-item">
        <uni-data-select 
          v-model="localSortBy" 
          :localdata="sortOptions" 
          placeholder="排序方式" 
          @change="handleSortChange"
        />
      </div>
      
      <div class="filter-item">
        <uni-data-select 
          v-model="localViewMode" 
          :localdata="viewModeOptions" 
          placeholder="显示方式" 
          @change="handleViewModeChange"
        />
      </div>
      
      <div class="filter-item">
        <uni-data-select 
          v-model="localSelectedLocation" 
          :localdata="locationOptions" 
          placeholder="位置" 
          @change="handleLocationChange"
        />
      </div>
      
      <div class="filter-item">
        <uni-data-select 
          v-model="localSelectedTag" 
          :localdata="tagOptions" 
          placeholder="标签" 
          @change="handleTagChange"
        />
      </div>
    </div>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ViewMode, SortBy } from '../types/plant';

const props = defineProps<{
  searchQuery: string;
  sortBy: SortBy;
  viewMode: ViewMode;
  selectedLocation: string;
  selectedTag: string;
  locations: string[];
  tags: string[];
}>();

const emit = defineEmits<{
  (e: 'search-change', value: string): void;
  (e: 'sort-change', value: SortBy): void;
  (e: 'view-mode-change', value: ViewMode): void;
  (e: 'location-change', value: string): void;
  (e: 'tag-change', value: string): void;
}>();

const localSearchQuery = ref(props.searchQuery);
const localSortBy = ref(props.sortBy);
const localViewMode = ref(props.viewMode);
const localSelectedLocation = ref(props.selectedLocation);
const localSelectedTag = ref(props.selectedTag);

const sortOptions = [
  { value: 'name', text: '按名称' },
  { value: 'date', text: '按种植日期' },
  { value: 'recent-care', text: '按最近养护' }
];

const viewModeOptions = [
  { value: 'grid', text: '网格' },
  { value: 'list', text: '列表' }
];

const locationOptions = computed(() => {
  return [
    { value: 'all', text: '全部位置' },
    ...props.locations.map(location => ({ value: location, text: location }))
  ];
});

const tagOptions = computed(() => {
  return [
    { value: 'all', text: '全部标签' },
    ...props.tags.map(tag => ({ value: tag, text: tag }))
  ];
});

watch(() => props.searchQuery, (newValue) => {
  localSearchQuery.value = newValue;
});

watch(() => props.sortBy, (newValue) => {
  localSortBy.value = newValue;
});

watch(() => props.viewMode, (newValue) => {
  localViewMode.value = newValue;
});

watch(() => props.selectedLocation, (newValue) => {
  localSelectedLocation.value = newValue;
});

watch(() => props.selectedTag, (newValue) => {
  localSelectedTag.value = newValue;
});

const handleSearchChange = () => {
  emit('search-change', localSearchQuery.value);
};

const handleSortChange = () => {
  emit('sort-change', localSortBy.value as SortBy);
};

const handleViewModeChange = () => {
  emit('view-mode-change', localViewMode.value as ViewMode);
};

const handleLocationChange = () => {
  emit('location-change', localSelectedLocation.value);
};

const handleTagChange = () => {
  emit('tag-change', localSelectedTag.value);
};
</script>

<style scoped>
.filter-bar {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 16px;
}

.filter-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.filter-item {
  width: 100%;
}

@media (min-width: 768px) {
  .filter-options {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>