export interface Task {
  id: string;
  session_id: string;
  title: string;
  duration_minutes: number | null;
  scheduled_time: string | null;
  color: string | null;
  completed: boolean | null;
  position: number | null;
  created_at: string;
}

export type Database = {
  tasks: Task;
};