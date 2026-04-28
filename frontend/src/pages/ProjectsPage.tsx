import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects';
import { Navbar } from '../components/Navbar';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export function ProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowForm(false);
      setName('');
      setDescription('');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name, description });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h2>My Projects</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="card form-card">
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
            />
            <button type="submit" disabled={createMutation.isPending} className="btn btn-primary">
              {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        )}

        {isLoading && <Spinner />}
        {isError && <ErrorMessage message="Failed to load projects" />}

        <div className="projects-grid">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="card project-card"
              onClick={() => navigate(`/projects/${project.id}/tasks`)}
            >
              <h3>{project.name}</h3>
              {project.description && <p>{project.description}</p>}
              <span className="member-count">{project.members.length} member(s)</span>
            </div>
          ))}
        </div>

        {projects?.length === 0 && !isLoading && (
          <p className="empty-state">No projects yet. Create your first project!</p>
        )}
      </div>
    </>
  );
}
