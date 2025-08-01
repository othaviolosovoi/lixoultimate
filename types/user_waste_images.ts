export interface DetectionPoint {
  class_name: string;
  contour_normalized: number[][];
}
export interface WasteDetectionData {
  id: string;
  createdAt: string;
  base64: string;
  latitude: number;
  longitude: number;
  date_taken: string;
  status: string;
  detection_points: DetectionPoint[]; // De 'JSON' para 'DetectionPoint[]'
}

export interface LixoItemProps {
  detectionId: string;
  // initialStatus?: string; // Se você decidir usar isso
}
