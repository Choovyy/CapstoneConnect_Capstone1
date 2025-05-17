package CapstoneConnect.Capstone_1.service;


import CapstoneConnect.Capstone_1.entity.ProjectEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.repository.ProjectRepository;
import CapstoneConnect.Capstone_1.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public ProjectEntity createProject(ProjectEntity project) {
        if (project.getUser() == null || project.getUser().getId() == null) {
            throw new IllegalArgumentException("User ID is required to create a project");
        }

        Long userId = project.getUser().getId();

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        project.setUser(user);

        return projectRepository.save(project);
    }


    public List<ProjectEntity> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<ProjectEntity> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public List<ProjectEntity> getProjectsByUserId(Long userId) {
        Optional<UserEntity> userOpt = userRepository.findById(userId);
        return userOpt.map(projectRepository::findByUser).orElse(null);
    }

    public ProjectEntity updateProject(Long id, ProjectEntity updatedProject) {
        Optional<ProjectEntity> existingProjectOpt = projectRepository.findById(id);
        if (existingProjectOpt.isPresent()) {
            ProjectEntity existing = existingProjectOpt.get();
            existing.setName(updatedProject.getName());
            existing.setDescription(updatedProject.getDescription());
            existing.setRolesNeeded(updatedProject.getRolesNeeded());
            existing.setSkillsRequired(updatedProject.getSkillsRequired());
            existing.setProjectInterests(updatedProject.getProjectInterests());
            return projectRepository.save(existing);
        }
        return null;
    }

    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void applyToProject(Long projectId, Long userId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent applying to own project
        if (project.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot apply to your own project");
        }

        if (project.getApplicants().contains(user)) {
            throw new RuntimeException("User already applied to this project");
        }

        project.getApplicants().add(user);
        projectRepository.save(project);
    }

    public List<UserEntity> getApplicantsForProject(Long projectId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return project.getApplicants();
    }

    public void acceptApplicant(Long projectId, Long userId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!project.getApplicants().contains(user)) {
            throw new RuntimeException("User is not an applicant for this project");
        }
        // Remove from applicants, add to team members
        project.getApplicants().remove(user);
        if (!project.getTeamMembers().contains(user)) {
            project.getTeamMembers().add(user);
        }
        projectRepository.save(project);
    }

    public void rejectApplicant(Long projectId, Long userId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!project.getApplicants().contains(user)) {
            throw new RuntimeException("User is not an applicant for this project");
        }
        project.getApplicants().remove(user);
        projectRepository.save(project);
    }

}
