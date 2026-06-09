/**
 * Minimal type stubs for Nimbalyst extension APIs we use.
 *
 * The Nimbalyst host provides these at runtime via the `@nimbalyst/runtime`
 * module, but that module isn't published to npm as a standalone package —
 * it's a workspace-internal package in the Nimbalyst monorepo. We stub
 * what we need here so our build can typecheck without depending on the
 * upstream package.
 */

declare module '@nimbalyst/runtime' {
  /**
   * Storage interface passed to settings panel components.
   * Provides persistence for both regular preferences and secrets.
   */
  export interface ExtensionStorage {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<void>;
    getSecret(key: string): Promise<string | null>;
    setSecret(key: string, value: string): Promise<void>;
    deleteSecret(key: string): Promise<void>;
  }

  /**
   * Props passed to settings panel components.
   * `theme` is the current Nimbalyst theme name (e.g., 'dark', 'crystal-dark',
   * 'com.bglti148.tokyo-night:tokyo-night').
   */
  export interface SettingsPanelProps {
    storage: ExtensionStorage;
    theme: string;
  }

  /**
   * Extension activation context. The runtime passes this to activate().
   * Shape varies across SDK versions; we only use `subscriptions` for
   * cleanup registration, so the type is permissive.
   */
  export interface ExtensionContext {
    subscriptions?: Array<{ dispose: () => void }>;
    services?: {
      configuration?: {
        get<T = unknown>(key: string, defaultValue?: T): T;
        update(key: string, value: unknown, scope?: 'user' | 'workspace'): Promise<void>;
      };
    };
    storage?: ExtensionStorage;
  }
}
