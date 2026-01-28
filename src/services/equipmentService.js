import saxiEquipment from '../data/saxi-equipment.json'
import saxiThermography from '../data/saxi-thermography.json'
import mondoEquipment from '../data/mondo-equipment.json'
import mondoThermography from '../data/mondo-thermography.json'
import ngomaEquipment from '../data/ngoma-equipment.json'
import ngomaThermography from '../data/ngoma-thermography.json'

const equipmentData = {
  saxi: {
    vibration: saxiEquipment,
    thermography: saxiThermography
  },
  mondo: {
    vibration: mondoEquipment,
    thermography: mondoThermography
  },
  ngoma: {
    vibration: ngomaEquipment,
    thermography: ngomaThermography
  }
}

export function loadEquipmentData(vessel, technology) {
  return new Promise((resolve) => {
    const data = equipmentData[vessel]?.[technology] || []
    resolve(data)
  })
}

export function getEquipmentById(vessel, technology, equipmentId) {
  const data = equipmentData[vessel]?.[technology] || []
  return data.find(eq => eq.id === equipmentId)
}

export function searchEquipment(vessel, technology, searchTerm) {
  const data = equipmentData[vessel]?.[technology] || []
  if (!searchTerm) return data
  
  const term = searchTerm.toLowerCase()
  return data.filter(eq => 
    eq.equipmentDesc?.toLowerCase().includes(term) ||
    eq.area?.toLowerCase().includes(term) ||
    eq.functionLocation?.toLowerCase().includes(term) ||
    eq.sapNumber?.toLowerCase().includes(term)
  )
}

export function getEquipmentByArea(vessel, technology, area) {
  const data = equipmentData[vessel]?.[technology] || []
  return data.filter(eq => eq.area === area)
}

export function getUniqueAreas(vessel, technology) {
  const data = equipmentData[vessel]?.[technology] || []
  return [...new Set(data.map(eq => eq.area))]
}

export default {
  loadEquipmentData,
  getEquipmentById,
  searchEquipment,
  getEquipmentByArea,
  getUniqueAreas
}
