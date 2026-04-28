import { Task, TaskStatus } from '../types';
import { useAuthStore } from '../store/auth.store';

interface Props {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAssign: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const STATUS_OPTIONS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export function TaskCard({ task, onStatusChange, onAssign, onDelete }: Props) {
  const userId = useAuthStore((s) => s.userId);
  const isAssignee = task.assignee?.id === userId;

  return (
    <div className={`task-card status-${task.status.toLowerCase()}`}>
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <button onClick={() => onDelete(task.id)} className="btn-icon" title="Delete task">✕</button>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-meta">
        <span className={`badge badge-${task.status.toLowerCase()}`}>{STATUS_LABELS[task.status]}</span>
        <span className="task-assignee">
          {task.assignee ? `👤 ${task.assignee.name}` : 'Unassigned'}
        </span>
      </div>

      <div className="task-actions">
        {isAssignee && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="select-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        )}
        <button onClick={() => onAssign(task)} className="btn btn-sm">Assign</button>
      </div>

      <p className="task-creator">Created by {task.creator.name}</p>
    </div>
  );
}
