/**
 * TypeScript declarations for the AirConsole API v1.10.0.
 * Loaded via CDN <script> tag — we declare the global class here.
 */

declare class AirConsole {
  static readonly SCREEN: 0;

  static readonly VIBRATE: {
    TYPE: { COMPOSITION: string };
    PRIMITIVE: {
      TICK: string;
      CLICK: string;
      HEAVY_CLICK: string;
      DOUBLE_CLICK: string;
      THUD: string;
      QUICK_FALL: string;
      QUICK_RISE: string;
      SLOW_RISE: string;
      SPIN: string;
    };
  };

  constructor(opts?: { orientation?: string; synchronize_time?: boolean });

  // ─── Lifecycle ───
  onReady: (code: string) => void;
  onConnect: (device_id: number) => void;
  onDisconnect: (device_id: number) => void;
  onMessage: (from: number, data: unknown) => void;
  onDeviceProfileChange: (device_id: number) => void;
  onCustomDeviceStateChange: (device_id: number, data: unknown) => void;
  onPause: () => void;
  onResume: () => void;
  onAdShow: () => void;
  onAdComplete: (ad_was_shown: boolean) => void;

  // ─── Messaging ───
  message(device_id: number, data: unknown): void;
  broadcast(data: unknown): void;

  // ─── Device Info ───
  getDeviceId(): number;
  getMasterControllerDeviceId(): number;
  getControllerDeviceIds(): number[];
  getNickname(device_id?: number): string;
  getProfilePicture(device_id?: number, size?: number): string;
  getUID(device_id?: number): string;
  isPremium(device_id?: number): boolean;

  // ─── Active Players ───
  setActivePlayers(max_players?: number): void;
  getActivePlayerDeviceIds(): number[];
  convertPlayerNumberToDeviceId(player_number: number): number;
  convertDeviceIdToPlayerNumber(device_id: number): number;

  // ─── Custom Device State ───
  setCustomDeviceState(data: unknown): void;
  setCustomDeviceStateProperty(key: string, value: unknown): void;
  getCustomDeviceState(device_id?: number): unknown;

  // ─── Ads ───
  showAd(): void;

  // ─── Controller Inputs ───
  vibrate(opts: unknown): void;
}
