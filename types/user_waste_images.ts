interface OldDetectionPoints {
  class_name: string;
  contour_normalized: number[][];
}

interface NewDetectionPoints {
  lixo_detections: Array<{
    lixo_id: number;
    lixo_contour: number[][];
    sub_classes: Array<{
      class_name: "papel" | "plastico" | "vidro" | "metal";
      contour: number[][];
      confidence: number;
    }>;
  }>;
  class_counts: {
    papel: number;
    plastico: number;
    vidro: number;
    metal: number;
  };
}

export interface WasteDetectionData {
  id: string;
  base64: string;
  latitude: number;
  longitude: number;
  date_taken: string;
  user_id: string;
  detected_classes: string[];
  status: string;
  detection_points?: OldDetectionPoints[] | NewDetectionPoints;
}

export interface LixoItemProps {
  detectionId: string;
}
