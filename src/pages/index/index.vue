<template>
  <view class="min-h-screen bg-neutral-50">
    <!-- Header -->
    <view class="bg-white border-b sticky top-0 z-10">
      <view class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <view class="flex items-center justify-between gap-2 sm:gap-4">
          <view class="flex items-center gap-2 sm:gap-3 min-w-0">
            <view class="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
              <text class="text-white text-lg">🌿</text>
            </view>
            <view class="min-w-0">
              <text class="text-base sm:text-xl font-semibold truncate">植物养护记录</text>
              <text class="text-xs sm:text-sm text-neutral-500 block">记录您的植物生长历程</text>
            </view>
          </view>
          <view class="flex gap-1 sm:gap-2 shrink-0">
            <QuickWaterDialog :plants="plants" @water-plants="handleQuickWater" />
            <AddPlantDialog @add="handleAddPlant" />
          </view>
        </view>
      </view>
    </view>

    <!-- Main Content -->
    <view class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      <template v-if="plants.length === 0">
        <view class="text-center py-12 sm:py-16">
          <view class="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <text class="text-green-500 text-xl">🌿</text>
          </view>
          <text class="text-lg sm:text-xl font-medium block mb-2">还没有植物记录</text>
          <text class="text-sm sm:text-base text-neutral-500 block mb-6">点击上方按钮添加您的第一株植物吧</text>
          <AddPlantDialog @add="handleAddPlant" />
        </view>
      </template>
      <template v-else>
        <uni-tabs v-model="activeTab" class="space-y-4 sm:space-y-6">
          <uni-tabs-pane label="我的植物" name="plants">
            <FilterBar
              :search-query="searchQuery"
              @search-change="setSearchQuery"
              :sort-by="sortBy"
              @sort-change="setSortBy"
              :view-mode="viewMode"
              @view-mode-change="setViewMode"
              :selected-location="selectedLocation"
              @location-change="setSelectedLocation"
              :selected-tag="selectedTag"
              @tag-change="setSelectedTag"
              :locations="locations"
              :tags="tags"
            />

            <template v-if="filteredPlants.length === 0">
              <view class="text-center py-12">
                <text class="text-neutral-500">没有找到匹配的植物</text>
              </view>
            </template>
            <template v-else>
              <view class="flex items-center justify-between">
                <text class="text-base sm:text-lg font-medium">
                  {{ searchQuery || selectedLocation !== 'all' || selectedTag !== 'all' 
                    ? `找到 ${filteredPlants.length} 株植物`
                    : `我的植物 (${filteredPlants.length})` }}
                </text>
              </view>

              <view v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                <PlantCard
                  v-for="plant in filteredPlants"
                  :key="plant.id"
                  :plant="plant"
                  :care-records="getCareRecordsByPlant(plant.id)"
                  @view="() => handleViewPlant(plant)"
                  @delete="() => handleDeletePlant(plant)"
                />
              </view>
              <view v-else class="space-y-3 sm:space-y-4">
                <PlantListItem
                  v-for="plant in filteredPlants"
                  :key="plant.id"
                  :plant="plant"
                  :care-records="getCareRecordsByPlant(plant.id)"
                  @view="() => handleViewPlant(plant)"
                  @delete="() => handleDeletePlant(plant)"
                />
              </view>
            </template>
          </uni-tabs-pane>
          <uni-tabs-pane label="统计分析" name="stats">
            <StatsDashboard :plants="plants" :care-records="careRecords" />
          </uni-tabs-pane>
        </uni-tabs>
      </template>
    </view>

    <!-- Plant Detail Dialog -->
    <PlantDetailDialog
      :plant="selectedPlant"
      :open="detailDialogOpen"
      @open-change="setDetailDialogOpen"
      :care-records="selectedPlant ? getCareRecordsByPlant(selectedPlant.id) : []"
      @add-record="handleAddRecord"
      @delete-record="handleDeleteRecord"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePlants from '../../hooks/usePlants';
import { Plant, ViewMode, SortBy } from '../../types/plant';
import AddPlantDialog from '../../components/AddPlantDialog.vue';
import PlantCard from '../../components/PlantCard.vue';
import PlantListItem from '../../components/PlantListItem.vue';
import PlantDetailDialog from '../../components/PlantDetailDialog.vue';
import StatsDashboard from '../../components/StatsDashboard.vue';
import QuickWaterDialog from '../../components/QuickWaterDialog.vue';
import FilterBar from '../../components/FilterBar.vue';
import { format } from 'date-fns';

const activeTab = ref('plants');

const {
  plants,
  careRecords,
  addPlant,
  deletePlant,
  addCareRecord,
  deleteCareRecord,
  getCareRecordsByPlant,
} = usePlants();

const selectedPlant = ref<Plant | null>(null);
const detailDialogOpen = ref(false);
const viewMode = ref<ViewMode>('grid');
const searchQuery = ref('');
const sortBy = ref<SortBy>('name');
const selectedLocation = ref('all');
const selectedTag = ref('all');

const locations = computed(() => {
  const locs = new Set<string>();
  plants.value.forEach(p => p.location && locs.add(p.location));
  return Array.from(locs);
});

const tags = computed(() => {
  const tagSet = new Set<string>();
  plants.value.forEach(p => p.tags?.forEach(t => tagSet.add(t)));
  return Array.from(tagSet);
});

const filteredPlants = computed(() => {
  let filtered = plants.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.species?.toLowerCase().includes(query)
    );
  }

  if (selectedLocation.value !== 'all') {
    filtered = filtered.filter(p => p.location === selectedLocation.value);
  }

  if (selectedTag.value !== 'all') {
    filtered = filtered.filter(p => p.tags?.includes(selectedTag.value));
  }

  filtered = [...filtered].sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy.value === 'date') {
      return new Date(b.plantedDate).getTime() - new Date(a.plantedDate).getTime();
    } else if (sortBy.value === 'recent-care') {
      const aLastCare = getCareRecordsByPlant(a.id)[0]?.date || '1900-01-01';
      const bLastCare = getCareRecordsByPlant(b.id)[0]?.date || '1900-01-01';
      return new Date(bLastCare).getTime() - new Date(aLastCare).getTime();
    }
    return 0;
  });

  return filtered;
});

const handleAddPlant = (plantData: Omit<Plant, 'id'>) => {
  addPlant(plantData);
  uni.showToast({
    title: '植物添加成功！',
    icon: 'success'
  });
};

const handleDeletePlant = (plant: Plant) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除 ${plant.name} 吗？这将同时删除所有相关记录。`,
    success: (res) => {
      if (res.confirm) {
        deletePlant(plant.id);
        uni.showToast({
          title: '植物已删除',
          icon: 'success'
        });
      }
    }
  });
};

const handleViewPlant = (plant: Plant) => {
  selectedPlant.value = plant;
  detailDialogOpen.value = true;
};

const handleAddRecord = (record: Omit<import('../../types/plant').CareRecord, 'id'>) => {
  addCareRecord(record);
  uni.showToast({
    title: '记录添加成功！',
    icon: 'success'
  });
};

const handleDeleteRecord = (id: string) => {
  deleteCareRecord(id);
  uni.showToast({
    title: '记录已删除',
    icon: 'success'
  });
};

const handleQuickWater = (plantIds: string[]) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  plantIds.forEach(plantId => {
    addCareRecord({
      plantId,
      type: 'water',
      date: today,
      notes: '快速浇水',
    });
  });
  uni.showToast({
    title: `已为 ${plantIds.length} 株植物记录浇水`,
    icon: 'success'
  });
};

const setSearchQuery = (query: string) => {
  searchQuery.value = query;
};

const setSortBy = (sort: SortBy) => {
  sortBy.value = sort;
};

const setViewMode = (mode: ViewMode) => {
  viewMode.value = mode;
};

const setSelectedLocation = (location: string) => {
  selectedLocation.value = location;
};

const setSelectedTag = (tag: string) => {
  selectedTag.value = tag;
};
</script>

<style>
page {
  background-color: #f9fafb;
}

.min-h-screen {
  min-height: 100vh;
}

.bg-neutral-50 {
  background-color: #f9fafb;
}

.bg-white {
  background-color: #ffffff;
}

.border-b {
  border-bottom: 1px solid #e5e7eb;
}

.sticky {
  position: sticky;
}

.top-0 {
  top: 0;
}

.z-10 {
  z-index: 10;
}

.max-w-7xl {
  max-width: 80rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 0.5rem;
}

.min-w-0 {
  min-width: 0;
}

.w-8 {
  width: 2rem;
}

.h-8 {
  height: 2rem;
}

.bg-green-500 {
  background-color: #10b981;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.justify-center {
  justify-content: center;
}

.shrink-0 {
  flex-shrink: 0;
}

.text-white {
  color: #ffffff;
}

.text-base {
  font-size: 1rem;
}

.font-semibold {
  font-weight: 600;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-xs {
  font-size: 0.75rem;
}

.text-neutral-500 {
  color: #6b7280;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.text-center {
  text-align: center;
}

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.w-12 {
  width: 3rem;
}

.h-12 {
  height: 3rem;
}

.bg-green-100 {
  background-color: #d1fae5;
}

.rounded-full {
  border-radius: 9999px;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-medium {
  font-weight: 500;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.space-y-4 {
  gap: 1rem;
}

.space-y-6 {
  gap: 1.5rem;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

.space-y-3 {
  gap: 0.75rem;
}

.block {
  display: block;
}

.text-sm {
  font-size: 0.875rem;
}

.text-xl {
  font-size: 1.25rem;
}

@media (min-width: 640px) {
  .sm\:px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .sm\:py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .sm\:gap-3 {
    gap: 0.75rem;
  }
  .sm\:gap-4 {
    gap: 1rem;
  }
  .sm\:gap-6 {
    gap: 1.5rem;
  }
  .sm\:text-xl {
    font-size: 1.25rem;
  }
  .sm\:text-base {
    font-size: 1rem;
  }
  .sm\:w-10 {
    width: 2.5rem;
  }
  .sm\:h-10 {
    height: 2.5rem;
  }
  .sm\:space-y-4 {
    gap: 1rem;
  }
  .sm\:space-y-6 {
    gap: 1.5rem;
  }
  .sm\:py-8 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  .sm\:py-16 {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  .sm\:text-lg {
    font-size: 1.125rem;
  }
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .sm\:flex-initial {
    flex: 0 1 auto;
  }
}

@media (min-width: 1024px) {
  .lg\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .xl\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
