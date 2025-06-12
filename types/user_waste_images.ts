export interface WasteDetectionData {
  id: string;
  createdAt: string; 
  base64: string;
  latitude: number;
  longitude: number;
  date_taken: string;
  status: string;
  // user_id?: string;
  // detected_classes?: string;
}

export interface LixoItemProps {
  detectionId: string;
  // initialStatus?: string; // Se você decidir usar isso
}