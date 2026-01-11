
export interface HandData {
  x: number;
  y: number;
  z: number;
  isPinching: boolean;
  isFist: boolean;
  isThumbsUp: boolean;
  active: boolean;
  landmarks: any[]; // 21 landmarks for complex gestures
}

export class HandService {
  private static instance: HandService;
  private hands: any = null;
  private camera: any = null;
  private videoElement: HTMLVideoElement | null = null;
  private callbacks: ((data: HandData) => void)[] = [];
  
  public currentData: HandData = { x: 0, y: 0, z: 0, isPinching: false, isFist: false, isThumbsUp: false, active: false, landmarks: [] };

  private constructor() {
    this.videoElement = document.createElement('video');
    this.videoElement.setAttribute('playsinline', '');
    this.videoElement.style.display = 'none';
    document.body.appendChild(this.videoElement);
  }

  static getInstance() {
    if (!HandService.instance) HandService.instance = new HandService();
    return HandService.instance;
  }

  async init() {
    if (this.hands) return;

    // @ts-ignore
    this.hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    this.hands.onResults((results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];
        const middleMCP = landmarks[9];

        const dist = (p1: any, p2: any) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

        const pinchDist = dist(thumbTip, indexTip);
        
        // Fist logic: all finger tips close to wrist
        const fingerDists = [dist(indexTip, wrist), dist(middleTip, wrist), dist(ringTip, wrist), dist(pinkyTip, wrist)];
        const isFist = fingerDists.every(d => d < 0.25) && dist(thumbTip, wrist) < 0.3;

        // Thumbs up logic: thumb tip significantly higher than wrist, others curled
        const thumbUp = thumbTip.y < landmarks[3].y && thumbTip.y < landmarks[2].y;
        const othersCurled = fingerDists.every(d => d < 0.3);
        const isThumbsUp = thumbUp && othersCurled && !isFist;

        this.currentData = {
          x: (middleMCP.x - 0.5) * -2,
          y: (middleMCP.y - 0.5) * -2,
          z: middleMCP.z,
          isPinching: pinchDist < 0.05,
          isFist,
          isThumbsUp,
          active: true,
          landmarks: landmarks
        };
      } else {
        this.currentData.active = false;
        this.currentData.isPinching = false;
        this.currentData.isFist = false;
        this.currentData.isThumbsUp = false;
        this.currentData.landmarks = [];
      }
      this.callbacks.forEach(cb => cb(this.currentData));
    });

    // @ts-ignore
    this.camera = new window.Camera(this.videoElement, {
      onFrame: async () => {
        if (this.videoElement) await this.hands.send({ image: this.videoElement });
      },
      width: 640,
      height: 480
    });
    
    await this.camera.start();
  }

  subscribe(callback: (data: HandData) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  stop() {
    if (this.camera) this.camera.stop();
    this.camera = null;
    this.hands = null;
  }
}

export const handService = HandService.getInstance();
