import { useMe } from '@/queries/useAuthQueries';

/** Fires the session-restore check once at app boot, regardless of which route mounts first. */
export function useBootSession() {
  useMe();
}
