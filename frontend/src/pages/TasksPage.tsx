import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects';
import { usersApi } from '../api/users';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskStatus } from '../types';
import { Navbar } from '../components/Navbar';
import { TaskCard } from '../components/TaskCard';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

const STATUS_FILTERS: Array<{ label: string; value: TaskStatus | '' }> = [
  { label: 'All', value: '' },
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
];

export function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const queryClient = useQueryClient();

  const {
    tasksQuery, page, setPage, statusFilter, changeFilter,
    createMutation, statusMutation, assignMutation, deleteMutation,
  } = useTasks(projectId!);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [assigningTask, setAssigningTask] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState('');
  const [memberUserId, setMemberUserId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const projectQuery = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getOne(projectId!),
    enabled: !!projectId,
  });

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const addMemberMutation = useMutation({
    mutationFn: (userId: string) => projectsApi.addMember(projectId!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setShowMemberForm(false);
      setMemberUserId('');
    },
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { title: newTitle, description: newDesc || undefined, assigneeId: newAssigneeId || undefined },
      { onSuccess: () => { setShowCreateForm(false); setNewTitle(''); setNewDesc(''); setNewAssigneeId(''); } },
    );
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigningTask && assigneeId) {
      assignMutation.mutate({ taskId: assigningTask.id, assigneeId }, { onSuccess: () => setAssigningTask(null) });
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberUserId) addMemberMutation.mutate(memberUserId);
  };

  const { tasks = [], totalPages = 1 } = tasksQuery.data ?? {};
  const members = projectQuery.data?.members ?? [];

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <div>
            <Link to="/projects" className="back-link">← Projects</Link>
            <h2>{projectQuery.data?.name ?? 'Loading...'}</h2>
          </div>
          <div className="header-actions">
            <button onClick={() => setShowMemberForm(!showMemberForm)} className="btn btn-secondary">
              Manage Members
            </button>
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary">
              + New Task
            </button>
          </div>
        </div>

        {showMemberForm && (
          <div className="card form-card">
            <h4>Add Member</h4>
            <form onSubmit={handleAddMember} className="inline-form">
              <select value={memberUserId} onChange={(e) => setMemberUserId(e.target.value)} className="input" required>
                <option value="">Select user</option>
                {usersQuery.data?.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <button type="submit" disabled={addMemberMutation.isPending} className="btn btn-primary">Add</button>
            </form>
            {addMemberMutation.isError && (
              <ErrorMessage message={(addMemberMutation.error as any)?.response?.data?.message} />
            )}
            <div className="members-list">
              {members.map((m) => (
                <span key={m.id} className="member-tag">{m.user.name} ({m.role})</span>
              ))}
            </div>
          </div>
        )}

        {showCreateForm && (
          <form onSubmit={handleCreateTask} className="card form-card">
            <h4>Create Task</h4>
            <input type="text" placeholder="Task title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className="input" />
            <input type="text" placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="input" />
            <select value={newAssigneeId} onChange={(e) => setNewAssigneeId(e.target.value)} className="input">
              <option value="">Assign to (optional)</option>
              {members.map((m) => <option key={m.userId} value={m.userId}>{m.user.name}</option>)}
            </select>
            {createMutation.isError && <ErrorMessage message="Failed to create task" />}
            <button type="submit" disabled={createMutation.isPending} className="btn btn-primary">
              {createMutation.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        )}

        {assigningTask && (
          <div className="modal-overlay" onClick={() => setAssigningTask(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h4>Assign "{assigningTask.title}"</h4>
              <form onSubmit={handleAssign}>
                <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="input" required>
                  <option value="">Select member</option>
                  {members.map((m) => <option key={m.userId} value={m.userId}>{m.user.name}</option>)}
                </select>
                <div className="modal-actions">
                  <button type="button" onClick={() => setAssigningTask(null)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" disabled={assignMutation.isPending} className="btn btn-primary">Assign</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="filter-bar">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => changeFilter(f.value as TaskStatus | '')}
              className={`btn btn-filter ${statusFilter === f.value ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {tasksQuery.isLoading && <Spinner />}
        {tasksQuery.isError && <ErrorMessage message="Failed to load tasks" />}

        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={(taskId, status) => statusMutation.mutate({ taskId, status })}
              onAssign={(task) => { setAssigningTask(task); setAssigneeId(''); }}
              onDelete={(taskId) => deleteMutation.mutate(taskId)}
            />
          ))}
        </div>

        {tasks.length === 0 && !tasksQuery.isLoading && (
          <p className="empty-state">No tasks found. Create your first task!</p>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="btn btn-secondary">Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} className="btn btn-secondary">Next</button>
          </div>
        )}
      </div>
    </>
  );
}
