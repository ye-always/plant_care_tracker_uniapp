import { ref, onMounted, watch } from 'vue';
import { Plant, CareRecord, HealthIssue } from '../types/plant';

const PLANTS_KEY = 'plant-tracker-plants';
const CARE_RECORDS_KEY = 'plant-tracker-care-records';
const HEALTH_ISSUES_KEY = 'plant-tracker-health-issues';

export function usePlants() {
  const plants = ref<Plant[]>([]);
  const careRecords = ref<CareRecord[]>([]);
  const healthIssues = ref<HealthIssue[]>([]);

  onMounted(() => {
    // 使用uni-app的storage API替代localStorage
    uni.getStorage({ 
      key: PLANTS_KEY, 
      success: (res) => {
        plants.value = JSON.parse(res.data as string);
      }
    });
    uni.getStorage({ 
      key: CARE_RECORDS_KEY, 
      success: (res) => {
        careRecords.value = JSON.parse(res.data as string);
      }
    });
    uni.getStorage({ 
      key: HEALTH_ISSUES_KEY, 
      success: (res) => {
        healthIssues.value = JSON.parse(res.data as string);
      }
    });
  });

  watch(plants, (newPlants) => {
    uni.setStorage({ 
      key: PLANTS_KEY, 
      data: JSON.stringify(newPlants) 
    });
  }, { deep: true });

  watch(careRecords, (newCareRecords) => {
    uni.setStorage({ 
      key: CARE_RECORDS_KEY, 
      data: JSON.stringify(newCareRecords) 
    });
  }, { deep: true });

  watch(healthIssues, (newHealthIssues) => {
    uni.setStorage({ 
      key: HEALTH_ISSUES_KEY, 
      data: JSON.stringify(newHealthIssues) 
    });
  }, { deep: true });

  const addPlant = (plant: Omit<Plant, 'id'>) => {
    const newPlant: Plant = {
      ...plant,
      id: Date.now().toString(),
    };
    plants.value.push(newPlant);
    return newPlant;
  };

  const updatePlant = (id: string, updates: Partial<Plant>) => {
    const index = plants.value.findIndex(p => p.id === id);
    if (index !== -1) {
      plants.value[index] = { ...plants.value[index], ...updates };
    }
  };

  const deletePlant = (id: string) => {
    plants.value = plants.value.filter(p => p.id !== id);
    careRecords.value = careRecords.value.filter(r => r.plantId !== id);
    healthIssues.value = healthIssues.value.filter(i => i.plantId !== id);
  };

  const addCareRecord = (record: Omit<CareRecord, 'id'>) => {
    const newRecord: CareRecord = {
      ...record,
      id: Date.now().toString(),
    };
    careRecords.value.push(newRecord);
    return newRecord;
  };

  const deleteCareRecord = (id: string) => {
    careRecords.value = careRecords.value.filter(r => r.id !== id);
  };

  const addHealthIssue = (issue: Omit<HealthIssue, 'id'>) => {
    const newIssue: HealthIssue = {
      ...issue,
      id: Date.now().toString(),
    };
    healthIssues.value.push(newIssue);
    return newIssue;
  };

  const updateHealthIssue = (id: string, updates: Partial<HealthIssue>) => {
    const index = healthIssues.value.findIndex(i => i.id === id);
    if (index !== -1) {
      healthIssues.value[index] = { ...healthIssues.value[index], ...updates };
    }
  };

  const deleteHealthIssue = (id: string) => {
    healthIssues.value = healthIssues.value.filter(i => i.id !== id);
  };

  const getCareRecordsByPlant = (plantId: string) => {
    return careRecords.value
      .filter(r => r.plantId === plantId)
      .sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  };

  const getHealthIssuesByPlant = (plantId: string) => {
    return healthIssues.value
      .filter(i => i.plantId === plantId)
      .sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  };

  return {
    plants,
    careRecords,
    healthIssues,
    addPlant,
    updatePlant,
    deletePlant,
    addCareRecord,
    deleteCareRecord,
    addHealthIssue,
    updateHealthIssue,
    deleteHealthIssue,
    getCareRecordsByPlant,
    getHealthIssuesByPlant,
  };
}